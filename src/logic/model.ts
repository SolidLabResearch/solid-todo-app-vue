import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { Session } from '@inrupt/solid-client-authn-browser'

interface ITask {
  id: string
  name: string
  creator: string
  created: string
  modified: string
  position: string
  status: string
  description: string
}

interface ITaskList {
  id: string
  name: string
  description: string
}

interface IWebID {
  id: string
  givenName: string
  familyName: string
  oidcIssuer: string
}

const queryEngine: QueryEngine = new QueryEngine()

const taskStatusValues: string[] = [
  'https://schema.org/ActiveActionStatus',
  'https://schema.org/PotentialActionStatus',
  'https://schema.org/CompletedActionStatus',
  'https://schema.org/FailedActionStatus'
]

function context(session?: Session, url?: string): QueryStringContext {
  const context: QueryStringContext = {
    sources: [url ?? session?.info.webId as string],
    lenient: true
  }
  if (session?.info.isLoggedIn ?? false) {
    context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session
  }
  return context
}

async function find<T>(query: string, session?: Session, url?: string): Promise<T[]> {
  return await new Promise<T[]>((resolve, reject) => {
    const output: Map<string, any> = new Map<string, any>()
    queryEngine.queryBindings(query, context(session, url))
      .then((bindingsStream: BindingsStream) => bindingsStream
        .on('data', (bindings: Bindings) => {
          const id: string = bindings.get('id')?.value as string
          if (!output.has(id)) {
            const newObject: any = {}
            newObject.id = id
            output.set(id, newObject)
          }
          for (const key of bindings.keys()) {
            if (key.value !== 'id') {
              output.get(id)[key.value] = bindings.get(key)?.value
            }
          }
        })
        .on('end', () => resolve(Array.from(output.values())))
        .on('error', reject)
      )
      .catch(reject)
  })
}

async function update(query: string, session?: Session, url?: string): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    queryEngine.queryVoid(query, context(session, url)).then(resolve).catch(reject)
  })
}

async function print(query: string, session?: Session, url?: string): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    queryEngine.queryBindings(query, context(session, url)).then((bindingsStream: BindingsStream) => {
      bindingsStream
        .on('data', (bindings: Bindings) => bindings.forEach((value, key) => console.log({ [key.value]: value.value })))
        .on('error', reject)
        .on('end', resolve)
    }).catch(reject)
  })
}

export { type ITask, type ITaskList, type IWebID, find, update, print, taskStatusValues }
