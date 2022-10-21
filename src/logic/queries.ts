import { session } from './session'
import { find, findOne, update } from './engine'
import { type ITaskList, type ITask, type IWebID, defaultContainerPathTemplate, defaultInstancePathTemplate, identifierFromName } from './model'

const prefixes: string = `
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX solid: <http://www.w3.org/ns/solid/terms#>
  PREFIX schema: <http://schema.org/>
  PREFIX pim: <http://www.w3.org/ns/pim/space#>
  PREFIX ex: <http://example.org/>
  PREFIX acl: <http://www.w3.org/ns/auth/acl#>
  PREFIX todo: <http://example.org/todolist/>
`

const taskListClasses: string = 'todo:TaskList'
const taskClasses: string = 'todo:Task'

/** Retrieval of specific entries */

async function getWebID(webId?: string): Promise<IWebID> {
  const webIdValue: string | undefined = session.info.isLoggedIn ? session.info.webId : webId
  if (webIdValue != null && webIdValue.length > 0 && webIdValue.match(/http(s)?:\/\//) != null) {
    const query: string = `
      ${prefixes}

      SELECT * WHERE {
        ?id a foaf:Person .
        FILTER ( ?id = <${webIdValue}> ) .
        ?id solid:oidcIssuer ?oidcIssuer .
        OPTIONAL { ?id pim:storage ?storage } .
        OPTIONAL { ?id foaf:name|foaf:givenName ?name } .
        OPTIONAL { ?id ex:taskPathTemplate ?taskPathTemplate } .
      }
    `
    return await findOne<IWebID>(query, undefined, webIdValue)
  }
  throw new Error('No WebID URL provided for retrieval')
}

async function replaceTemplateValues(input: string, webId?: IWebID, taskListId?: string, taskId?: string): Promise<string> {
  const time: Date = new Date()
  let output = input
    .replace('{year}', time.getUTCFullYear().toString())
    .replace('{month}', time.getUTCMonth().toString())
    .replace('{date}', time.getUTCDate().toString())
  if (webId?.storage != null) {
    output = output.replace('{storage}', webId.storage.replace(/\/$/, ''))
  }
  if (taskListId != null) {
    output = output.replace('{tasklist}', taskListId)
  }
  if (taskId != null) {
    output = output.replace('{task}', taskId)
  }
  if (output.includes('{path}')) {
    const path: string = await getTaskDataContainerPath()
    output = output.replace('{path}', path)
  }
  while (output.includes('//')) {
    output = output.replace('//', '/')
  }
  output = output.replace('http:/', 'http://').replace('https:/', 'https://') // fixes the first double slash :d
  return output
}

async function getTaskDataContainerPath(): Promise<string> {
  const webId: IWebID = await getWebID(session.info.webId)
  if (webId.taskContainerPathTemplate == null) {
    await save('foaf:Person', webId.id, { 'ex:taskContainerPathTemplate': `"${defaultContainerPathTemplate}"` })
    webId.taskContainerPathTemplate = defaultContainerPathTemplate
  }
  return await replaceTemplateValues(webId.taskContainerPathTemplate, webId)
}

async function getTaskDataInstancePath(taskListId?: string, taskId?: string): Promise<string> {
  const webId: IWebID = await getWebID(session.info.webId)
  if (webId.taskInstancePathTemplate == null) {
    await save('foaf:Person', webId.id, { 'ex:taskInstancePathTemplate': `"${defaultInstancePathTemplate}"` })
    webId.taskInstancePathTemplate = defaultInstancePathTemplate
  }
  return await replaceTemplateValues(webId.taskInstancePathTemplate, webId, taskListId, taskId)
}

/** Creating */

async function create(classes: string, url: string, id: string | undefined, predicateValues: Record<string, string>): Promise<void> {
  const actualId: string = id == null ? '' : `#${id}`

  const predicateData: string = Object.entries(predicateValues).map(([predicate, value]) => `<${actualId}> ${predicate} ${value} .`).join('\n')

  const dataQuery: string = `
    ${prefixes}

    INSERT DATA {
      <${actualId}> a ${classes} .
      ${predicateData}
    }
  `
  await update(dataQuery, session, url)

  const accessQuery: string = `
    ${prefixes}

    INSERT DATA {
      <#owner> a acl:Authorization .
      <#owner> acl:agent <${session.info.webId as string}> .
      <#owner> acl:accessTo <${url}> .
      <#owner> acl:mode acl:Read, acl:Write, acl:Control .
    }
  `

  await update(accessQuery, session, `${url}.acl`)
}

async function createTask(taskList: ITaskList, name: string): Promise<void> {
  const id: string = identifierFromName(name)
  const path: string = await getTaskDataInstancePath(taskList.id.split('/').at(-1) as string, id)
  const predicateValues: Record<string, string> = {
    'todo:title': `"${name}"`,
    'todo:isPartOf': `<${taskList.id}>`
  }
  return await create(taskClasses, path, id, predicateValues)
}

async function createTaskList(name: string): Promise<void> {
  const id: string = identifierFromName(name)
  const path: string = await getTaskDataInstancePath(id)
  const predicateValues: Record<string, string> = {
    'todo:title': `"${name}"`
  }
  return await create(taskListClasses, path, undefined, predicateValues)
}

/** Removing */

async function remove(classes: string, id: string): Promise<void> {
  const dataQuery: string = `
    ${prefixes}

    DELETE WHERE {
      <${id}> a ${classes} ;
        ?p ?o .
    }
  `

  await update(dataQuery, session, id)

  /*
  The code here works, but is left commented and unused because removing the ACL entries
  causes a lot of access control issues when running read queries. Deleting all entries from a
  file on a server via SPARQL query does not remove the file itself, so the queries attempt to
  access it, even when empty. Leaving the ACL entries in place helps avoid the errors.
  Ideally, when removing the last entry from a file, the file and its ACL could be removed,
  but this is maybe beyond the scope of the challenge.

  const aclQuery: string = `
    ${prefixes}

    DELETE WHERE {
      ?id a acl:Authorization ;
        acl:accessTo <${id}> ;
        ?p ?o .
    }
  `

  await update(aclQuery, session, `${id}.acl`)
  */
}

async function removeTask(task: ITask): Promise<void> {
  await remove(taskClasses, task.id)
}

async function removeTaskList(taskList: ITaskList): Promise<void> {
  const tasks: ITask[] = await getTasks(taskList)
  await Promise.all(tasks.map(async (task) => await removeTask(task)))
  await remove(taskListClasses, taskList.id)
}

/** Updating */

async function save(classes: string, id: string, predicateValues: Record<string, string>): Promise<void> {
  const individualQueries: string[] = Object.entries(predicateValues).map(([predicate, value]) => `
    ${prefixes}

    DELETE {
      ?id ${predicate} ?value .
    }
    INSERT {
      ?id ${predicate} ${value} .
    }
    WHERE {
      ?id a ${classes} .
      FILTER ( ?id = <${id}> ) .
      ?id ${predicate} ?value .
      FILTER ( ?value != ${value} )
    }
  `)

  await Promise.all(individualQueries.map(async (query) => await update(query, session, id)))
}

async function saveTask(taskList: ITaskList, task: ITask): Promise<void> {
  const predicateValues: Record<string, string> = {
    'todo:title': `"${task.name}"`,
    'todo:description': `"${task.description}"`,
    'todo:isPartOf': `<${taskList.id}>`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${task.created ?? new Date().toISOString()}"`,
    'todo:dateModified': `"${new Date().toISOString()}"`,
    'schema:actionStatus': `<${task.status}>`
  }
  return await save(taskClasses, task.id, predicateValues)
}

async function saveTaskList(taskList: ITaskList): Promise<void> {
  const predicateValues: Record<string, string> = {
    'todo:title': `"${taskList.name}"`,
    'todo:description': `"${taskList.description}"`
  }
  return await save(taskListClasses, taskList.id, predicateValues)
}

/** Retrieval */

async function getTasks(taskList: ITaskList): Promise<ITask[]> {
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a ${taskClasses} .
      ?id todo:isPartOf <${taskList.id}> .
      ?id todo:title ?name .
      OPTIONAL { ?id todo:createdBy ?creator } .
      OPTIONAL { ?id todo:dateCreated ?created } .
      OPTIONAL { ?id todo:dateModified ?modified } .
      OPTIONAL { ?id todo:actionStatus ?status } .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  const tasks: ITask[] = await find<ITask>(query, session)
  tasks.sort((a, b) => a.name.localeCompare(b.name))
  return tasks
}

async function getTaskLists(): Promise<ITaskList[]> {
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a ${taskListClasses} .
      ?id todo:title ?name .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  const taskLists: ITaskList[] = await find<ITaskList>(query, session)
  taskLists.sort((a, b) => a.name.localeCompare(b.name))
  return taskLists
}

export { getTaskLists, createTaskList, saveTaskList, removeTaskList, getTasks, createTask, saveTask, removeTask, getWebID }
