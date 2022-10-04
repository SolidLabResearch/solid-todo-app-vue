import { session } from './session'
import { type ITaskList, type ITask, type IWebID, find, update } from './model'

async function getTaskLists(): Promise<ITaskList[]> {
  const query: string = `
    PREFIX schema: <http://schema.org/>

    SELECT ?id ?name ?description WHERE {
      ?id a schema:CreativeWork, schema:DataFeed, schema:ItemList .
      ?id schema:name ?name .
      ?id schema:description ?description .
    }
  `
  const matchingTaskLists: ITaskList[] = await find<ITaskList>(query, session)
  // console.log(matchingTaskLists)
  // throw new Error('break')
  return matchingTaskLists
}

/*
async function testTaskListData(taskList: ITaskList): Promise<void> {
  const query: string = `
    PREFIX schema: <http://schema.org/>

    SELECT * WHERE {
      ?id a schema:CreativeWork, schema:DataFeed, schema:ItemList .
      FILTER ( ?id = <${taskList.id}> ) .
    }
  `
  console.log(query)
  await print(query, session, taskList.id)
}
*/

function updateQueries(properies: Record<string, string>, classes: string, id: string): Array<Promise<void>> {
  const updateQuery = (property: string, value: string, classes: string): string => `
    PREFIX schema: <http://schema.org/>

    DELETE {
      ?id ${property} ?value .
    }
    INSERT {
      ?id ${property} ${value} .
    }
    WHERE {
      ?id a ${classes} .
      FILTER ( ?id = <${id}> ) .
      ?id ${property} ?value .
      FILTER ( ?value != ${value} )
    }
  `
  return Object.entries(properies).map(async ([key, value]) => await update(updateQuery(key, value, classes), session, id))
}

async function saveTaskListData(taskList: ITaskList): Promise<void> {
  const classes: string = 'schema:CreativeWork, schema:DataFeed, schema:ItemList'
  const properties: Record<string, string> = {
    'schema:name': `"${taskList.name}"`,
    'schema:description': `"${taskList.description}"`
  }
  await Promise.all(updateQueries(properties, classes, taskList.id))
}

/*
async function saveTaskListAccess(taskList: ITaskList): Promise<void> {
  const query: string = `
    PREFIX acl: <http://www.w3.org/ns/auth/acl#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    WITH <${taskList.id}.acl>
    DELETE {
      ?id acl:accessTo ?accessTo .
      ?id acl:mode ?mode .
    }
    INSERT {
      ?id acl:accessTo <${taskList.id}> .
      ?id acl:agent <${session.info.webId as string}> .
      ?id acl:mode acl:Read, acl:Write, acl:Control .
    }
    WHERE {
      ?id a acl:Authorization .
      ?id acl:agent <${session.info.webId as string}> .
      ?id acl:accessTo <${taskList.id}> .
    }
  `
  console.log(query)
  await update(query, session, `${taskList.id}.acl`)
}
*/

async function saveTaskList(taskList: ITaskList): Promise<void> {
  // await testTaskListData(taskList)
  await saveTaskListData(taskList)
  // await saveTaskListAccess(taskList)
}

async function saveTaskData(taskList: ITaskList, task: ITask): Promise<void> {
  const classes: string = 'schema:CreativeWork, schema:DataFeedItem, schema:ListItem'
  const properties: Record<string, string> = {
    'schema:name': `"${task.name}"`,
    'schema:description': `"${task.description}"`,
    'schema:isPartOf': `<${taskList.id}>`,
    'schema:creator': `<${session.info.webId as string}>`,
    'schema:dateCreated': `"${task.created ?? new Date().toISOString()}"`,
    'schema:dateModified': `"${new Date().toISOString()}"`,
    'schema:position': `"${task.position ?? '0'}"`,
    'schema:actionStatus': `<${task.status}>`
  }
  await Promise.all(updateQueries(properties, classes, task.id ?? `${taskList.id}#${task.name?.toLowerCase().replace(' ', '-')}`))
}

async function saveTask(taskList: ITaskList, task: ITask): Promise<void> {
  await saveTaskData(taskList, task)
}

async function getTasks(taskList: ITaskList): Promise<ITask[]> {
  const query: string = `
    PREFIX schema: <http://schema.org/>

    SELECT ?id ?name ?creator ?created ?modified ?position ?status ?description WHERE {
      ?id a schema:CreativeWork, schema:DataFeedItem, schema:ListItem .
      ?id schema:isPartOf <${taskList.id}> .
      ?id schema:name ?name .
      ?id schema:creator ?creator .
      ?id schema:dateCreated ?created .
      ?id schema:dateModified ?modified .
      ?id schema:position ?position .
      ?id schema:actionStatus ?status .
      ?id schema:description ?description .
    }
  `
  const matchingTasks: ITask[] = await find<ITask>(query, session)
  // console.log(matchingTasks)
  // throw new Error('break')
  return matchingTasks
}

async function getWebID(webId?: string): Promise<IWebID> {
  const webIdUrl: string = session.info.isLoggedIn ? session.info.webId as string : webId as string
  const query: string = `
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX solid: <http://www.w3.org/ns/solid/terms#>

    SELECT ?id ?givenName ?familyName ?oidcIssuer WHERE {
      ?id a foaf:Person .
      ?id foaf:givenName ?givenName .
      ?id foaf:familyName ?familyName .
      ?id solid:oidcIssuer ?oidcIssuer .
    } LIMIT 1
  `
  const matchingWebIds: IWebID[] = await find<IWebID>(query, undefined, webIdUrl)
  // console.log(matchingWebIds)
  // throw new Error('break')
  return matchingWebIds[0]
}

export { getTaskLists, getTasks, getWebID, saveTaskList, saveTask }
