import { session } from './session'
import { find, findOne, update, invalidateCache } from './engine'
import { type ITaskList, type ITask, type IWebID } from './model'
import { defaultTaskPath, taskStatusValues, identifierFromName } from './utils'

const prefixes: string = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX solid: <http://www.w3.org/ns/solid/terms#>
    PREFIX pim: <http://www.w3.org/ns/pim/space#>
    PREFIX ex: <http://example.org/>
    PREFIX acl: <http://www.w3.org/ns/auth/acl#>
    PREFIX todo: <http://example.org/todolist/>
`

const taskListClasses: string = 'todo:TaskList'
const taskClasses: string = 'todo:Task'

let pendingWebId: Promise<IWebID> | undefined

/** Retrieval of specific entries */

async function getWebIdPromise(webId?: string): Promise<IWebID> {
  const webIdValue = webId ?? session.info.webId

  if (webIdValue == null) {
    throw new Error('WebID IRI is required to query it')
  }

  const query: string = `
    ${prefixes}

    SELECT ?id ?oidcIssuer ?storage ?name ?pathTemplate WHERE {
      ?id solid:oidcIssuer ?oidcIssuer .
      OPTIONAL { ?id pim:storage ?storage } .
      OPTIONAL { ?id foaf:name|foaf:givenName ?name } .
      OPTIONAL { ?id todo:pathTemplate ?pathTemplate } .
    }
  `
  const value: IWebID | undefined = await findOne<IWebID>(query, webIdValue)
  if (value === undefined) {
    throw new Error('Query discovered no WebID')
  }

  return value
}

async function getWebId(webId?: string): Promise<IWebID> {
  if (pendingWebId === undefined) {
    pendingWebId = getWebIdPromise(webId)
  }
  return await pendingWebId
}

async function getStoragePath(taskListName?: string, taskName?: string): Promise<string> {
  const webId: IWebID = await getWebId()

  const time: Date = new Date()

  const path: string = (webId.pathTemplate ?? defaultTaskPath)
    .replaceAll('{year}', time.getUTCFullYear().toString())
    .replaceAll('{month}', time.getUTCMonth().toString())
    .replaceAll('{date}', time.getUTCDate().toString())
    .replaceAll('{timenow}', Date.now().toString())
    .replaceAll('{storage}', webId.storage?.replace(/\/$/, '') ?? '')
    .replaceAll('{tasklist}', taskListName != null ? identifierFromName(taskListName) : '')
    .replaceAll('{task}', taskName != null ? identifierFromName(taskName) : '')
    .replaceAll('//', '/')
    .replace(/^\//, '')

  const pathBase: string | undefined = path.startsWith('http') ? undefined : webId.storage ?? webId.id
  const storagePath = new URL(path, pathBase)

  return storagePath.href
}

/** Creating */

async function create(query: string, url: string): Promise<void> {
  /*
  const accessQuery: string = `
    ${prefixes}

    INSERT DATA {
      <#owner> a acl:Authorization ;
        acl:agent <${session.info.webId as string}> ;
        acl:accessTo <${url}> ;
        acl:mode acl:Read, acl:Write, acl:Control .
    }
  `
  */

  await update(query, url)
  // await update(accessQuery, `${url}.acl`)
}

async function createTask(taskList: ITaskList, text: string): Promise<ITask> {
  const currentTime: Date = new Date()
  const url: string = await getStoragePath(taskList.title, text)

  const task: ITask = {
    id: `${url}#${currentTime.getTime()}`,
    title: text,
    created: currentTime.toISOString(),
    modified: currentTime.toISOString(),
    creator: session.info.webId as string,
    status: taskStatusValues[0]
  }

  const query: string = `
    ${prefixes}

    INSERT DATA {
      <${task.id}> a ${taskClasses} ;
        todo:title "${task.title}" ;
        todo:isPartOf <${taskList.id}> ;
        todo:createdBy <${task.creator as string}> ;
        todo:dateCreated "${task.created as string}" ;
        todo:dateModified "${task.modified as string}" ;
        todo:status "${task.status as string}" .
    }
  `

  await create(query, url)
  return task
}

async function createTaskList(text: string): Promise<ITaskList> {
  const currentTime: Date = new Date()
  const url: string = await getStoragePath(text)

  const taskList: ITaskList = {
    id: `${url}#${currentTime.getTime()}`,
    title: text,
    created: currentTime.toISOString(),
    modified: currentTime.toISOString(),
    creator: session.info.webId as string
  }

  const query: string = `
    ${prefixes}

    INSERT DATA {
      <${taskList.id}> a ${taskListClasses} ;
      todo:title "${taskList.title}" ;
      todo:createdBy <${session.info.webId as string}> ;
      todo:dateCreated "${taskList.created as string}" ;
      todo:dateModified "${taskList.modified as string}" .
    }
  `

  await create(query, url)
  return taskList
}

/** Removing */

async function remove(id: string, classes: string): Promise<void> {
  const query: string = `
    ${prefixes}

    DELETE WHERE {
      <${id}> a ${classes} ;
        ?p ?o .
    }
  `

  await update(query, id)
}

async function removeTask(task: ITask): Promise<void> {
  await remove(task.id, taskClasses)
}

async function removeTaskList(taskList: ITaskList): Promise<void> {
  const tasks: ITask[] = await getTasks(taskList)
  await Promise.all(tasks.map(async (task) => { await removeTask(task) }))
  await remove(taskList.id, taskListClasses)
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
      FILTER ( ?value != ${value} ) .
    }
  `)
  await Promise.all(individualQueries.map(async (query) => { await update(query, id) }))
}

async function saveTask(taskList: ITaskList, task: ITask): Promise<ITask> {
  task.modified = new Date().toISOString()
  task.created = task.created ?? task.modified
  task.status = task.status ?? taskStatusValues[0]
  const predicateValues: Record<string, string> = {
    'todo:title': `"${task.title}"`,
    'todo:description': `"${task.description ?? ''}"`,
    'todo:isPartOf': `<${taskList.id}>`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${task.created}"`,
    'todo:dateModified': `"${task.modified}"`,
    'todo:status': `"${task.status}"`
  }
  await save(taskClasses, task.id, predicateValues)
  return task
}

async function saveTaskList(taskList: ITaskList): Promise<ITaskList> {
  taskList.modified = new Date().toISOString()
  taskList.created = taskList.created ?? taskList.modified
  const predicateValues: Record<string, string> = {
    'todo:title': `"${taskList.title}"`,
    'todo:description': `"${taskList.description ?? ''}"`,
    'todo:createdBy': `<${session.info.webId as string}>`,
    'todo:dateCreated': `"${taskList.created}"`,
    'todo:dateModified': `"${taskList.modified}"`
  }
  await save(taskListClasses, taskList.id, predicateValues)
  return taskList
}

/** Retrieval */

async function getTasks(taskList: ITaskList): Promise<ITask[]> {
  const query: string = `
    ${prefixes}

    SELECT * WHERE {
      ?id a ${taskClasses} .
      ?id todo:isPartOf <${taskList.id}> .
      ?id todo:title ?title .
      OPTIONAL { ?id todo:createdBy ?creator } .
      OPTIONAL { ?id todo:dateCreated ?created } .
      OPTIONAL { ?id todo:dateModified ?modified } .
      OPTIONAL { ?id todo:status ?status } .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  const webId: IWebID = await getWebId()
  const tasks: ITask[] = await find<ITask>(query, webId.storage != null ? webId.id : new URL('..', webId.id).href)
  if (tasks.length > 0) {
    tasks.sort((a, b) => a.title.localeCompare(b.title))
  }
  return tasks
}

async function getTaskLists(refresh: boolean = false): Promise<ITaskList[]> {
  const query: string = `
    ${prefixes}

    SELECT ?id ?title ?creator ?created ?modified ?description WHERE {
      ?id a ${taskListClasses} .
      ?id todo:title ?title .
      OPTIONAL { ?id todo:createdBy ?creator } .
      OPTIONAL { ?id todo:dateCreated ?created } .
      OPTIONAL { ?id todo:dateModified ?modified } .
      OPTIONAL { ?id todo:description ?description } .
    }
  `
  if (refresh) {
    await invalidateCache()
  }

  const webId: IWebID = await getWebId()
  const seedUrl = webId.storage != null ? webId.id : new URL('..', webId.id).href
  const taskLists: ITaskList[] = await find<ITaskList>(query, seedUrl)
  if (taskLists.length > 0) {
    taskLists.sort((a, b) => a.title.localeCompare(b.title))
  }

  return taskLists
}

export { getTaskLists, createTaskList, saveTaskList, removeTaskList, getTasks, createTask, saveTask, removeTask, getWebId }
