import { Session } from '@inrupt/solid-client-authn-browser'
import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { Quad, Term, NamedNode } from 'n3'

import { type ITask, Task } from './model'

const engine: QueryEngine = new QueryEngine()
const sessionKey: string = '@comunica/actor-http-inrupt-solid-client-authn:session'
type BindingsHandler = (bindings: Bindings) => void

async function execute(query: string, initialDocument: string, session: Session | undefined, bindingsHandler: BindingsHandler): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    const context: QueryStringContext = {
      sources: [initialDocument],
      [sessionKey]: session,
      lenient: true
    }
    engine
      .queryBindings(query, context)
      .then((bindingsStream: BindingsStream) => {
        bindingsStream
          .on('data', (bindings: Bindings) => bindingsHandler(bindings))
          .on('error', (error: Error) => reject(error))
          .on('end', () => resolve())
      })
      .catch((reason: any) => reject(reason))
  })
}

async function findTaskEntries(session: Session): Promise<ITask[]> {
  return await new Promise<ITask[]>((resolve, reject) => {
    const taskData: Map<NamedNode, Quad[]> = new Map<NamedNode, Quad[]>()
    const taskQuery: string = `
      PREFIX todo: <https://example.org/todo/>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

      SELECT ?s ?p ?o WHERE {
        ?s rdf:type todo:Task .
        ?s ?p ?o .
      }
    `
    void execute(taskQuery, session.info.webId as string, session, (bindings: Bindings) => {
      const todoURI: NamedNode = bindings.get('s') as NamedNode
      if (!taskData.has(todoURI)) {
        taskData.set(todoURI, new Array<Quad>())
      }
      taskData.get(todoURI)?.push(new Quad(todoURI, bindings.get('p') as Term, bindings.get('o') as Term))
    })
      .catch((reason: any) => reject(reason))
      .then(() => {
        const taskList: ITask[] = new Array<ITask>()
        for (const quads of taskData.values()) {
          taskList.push(new Task(quads))
        }
        resolve(taskList)
      })
  })
}

async function findOidcIssuer(webId: URL): Promise<URL> {
  return await new Promise<URL>((resolve, reject) => {
    const issuerQuery: string = `
      PREFIX solid: <http://www.w3.org/ns/solid/terms#>

      SELECT ?s ?o WHERE {
        ?s solid:oidcIssuer ?o .
      }
    `
    void execute(issuerQuery, webId.href, undefined, (bindings: Bindings) => {
      const issuer: NamedNode = bindings.get('o') as NamedNode
      const issuerURL: URL = new URL(issuer.value)
      console.log(`Found webID issuer for ${webId.href} at ${issuerURL.href}`)
      // throw 'in the towel'
      resolve(issuerURL)
    })
  })
}

export { findTaskEntries, findOidcIssuer }
