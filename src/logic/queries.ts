import { session } from './session'
import { find, findOne, update } from './engine'
import { type ITaskList, type ITask, type IWebID, defaultTaskPath, taskStatusValues, identifierFromName } from './model'

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
  const webIdValue: URL = new URL(webId ?? session.info.webId as string)
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a foaf:Person .
      FILTER ( ?id = <${webIdValue.href}> ) .
      ?id solid:oidcIssuer ?oidcIssuer .
      OPTIONAL { ?id pim:storage ?storage } .
      OPTIONAL { ?id foaf:name|foaf:givenName ?name } .
      OPTIONAL { ?id todo:pathTemplate ?pathTemplate } .
    }
  `
  return await findOne<IWebID>(query, session, webIdValue)
}

async function getStoragePath(taskListName?: string, taskName?: string): Promise<URL> {
  const webId: IWebID = await getWebID()

  let path: string = new URL(defaultTaskPath, webId.storage ?? webId.id).href

  if (webId.pathTemplate != null) {
    const time: Date = new Date()

    path = webId.pathTemplate
      .replace('{year}', time.getUTCFullYear().toString())
      .replace('{month}', time.getUTCMonth().toString())
      .replace('{date}', time.getUTCDate().toString())
      .replace('{storage}', webId.storage?.replace(/\/$/, '') ?? '')
      .replace('{tasklist}', taskListName != null ? identifierFromName(taskListName) : '')
      .replace('{task}', taskName != null ? identifierFromName(taskName) : '')

    // removes duplicate slashes in the middle
    while (path.includes('//')) {
      path = path.replace('//', '/')
    }

    path = path.replace('http:/', 'http://').replace('https:/', 'https://') // fixes the first double slash :d
  }

  return new URL(path)
}

/** Creating */

async function create(classes: string, url: URL, id: string | undefined, predicateValues: Record<string, string>): Promise<void> {
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
      <#owner> acl:accessTo <${url.href}> .
      <#owner> acl:mode acl:Read, acl:Write, acl:Control .
    }
  `

  await update(accessQuery, session, new URL(`${url.href}.acl`))
}

async function createTask(taskList: ITaskList, name: string): Promise<void> {
  const id: string = identifierFromName(name)
  const path: URL = await getStoragePath(taskList.name, name)
  const date: Date = new Date()
  const predicateValues: Record<string, string> = {
    'todo:title': `"${name}"`,
    'todo:isPartOf': `<${taskList.id.href}>`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${date.toISOString()}"`,
    'todo:dateModified': `"${date.toISOString()}"`,
    'todo:actionStatus': `<${taskStatusValues[0]}>`
  }
  return await create(taskClasses, path, id, predicateValues)
}

async function createTaskList(name: string): Promise<void> {
  const path: URL = await getStoragePath(name)
  const date: Date = new Date()
  const predicateValues: Record<string, string> = {
    'todo:title': `"${name}"`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${date.toISOString()}"`,
    'todo:dateModified': `"${date.toISOString()}"`
  }
  return await create(taskListClasses, path, undefined, predicateValues)
}

/** Removing */

async function remove(classes: string, id: URL): Promise<void> {
  const dataQuery: string = `
    ${prefixes}

    DELETE WHERE {
      <${id.href}> a ${classes} ;
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
        acl:accessTo <${id.href}> ;
        ?p ?o .
    }
  `

  await update(aclQuery, session, new URL(`${id}.acl`))
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

async function save(classes: string, id: URL, predicateValues: Record<string, string>): Promise<void> {
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
      FILTER ( ?id = <${id.href}> ) .
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
    'todo:isPartOf': `<${taskList.id.href}>`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${task.created ?? new Date().toISOString()}"`,
    'todo:dateModified': `"${new Date().toISOString()}"`,
    'todo:actionStatus': `<${task.status}>`
  }
  return await save(taskClasses, task.id, predicateValues)
}

async function saveTaskList(taskList: ITaskList): Promise<void> {
  const predicateValues: Record<string, string> = {
    'todo:title': `"${taskList.name}"`,
    'todo:description': `"${taskList.description}"`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${taskList.created ?? new Date().toISOString()}"`,
    'todo:dateModified': `"${new Date().toISOString()}"`
  }
  return await save(taskListClasses, taskList.id, predicateValues)
}

/** Retrieval */

async function getTasks(taskList: ITaskList): Promise<ITask[]> {
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a ${taskClasses} .
      ?id todo:isPartOf <${taskList.id.href}> .
      ?id todo:title ?name .
      OPTIONAL { ?id todo:createdBy ?creator } .
      OPTIONAL { ?id todo:dateCreated ?created } .
      OPTIONAL { ?id todo:dateModified ?modified } .
      OPTIONAL { ?id todo:actionStatus ?status } .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  const tasks: ITask[] = await find<ITask>(query, session, new URL(session.info.webId as string))
  tasks.sort((a, b) => a.name.localeCompare(b.name))
  return tasks
}

async function getTaskLists(): Promise<ITaskList[]> {
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a ${taskListClasses} .
      ?id todo:title ?name .
      OPTIONAL { ?id todo:createdBy ?creator } .
      OPTIONAL { ?id todo:dateCreated ?created } .
      OPTIONAL { ?id todo:dateModified ?modified } .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  const taskLists: ITaskList[] = await find<ITaskList>(query, session, new URL(session.info.webId as string))
  taskLists.sort((a, b) => a.name.localeCompare(b.name))
  return taskLists
}

export { getTaskLists, createTaskList, saveTaskList, removeTaskList, getTasks, createTask, saveTask, removeTask, getWebID }
