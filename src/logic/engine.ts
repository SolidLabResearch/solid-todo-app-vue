import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import type { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { session } from './session'

const queryEngine: QueryEngine = new QueryEngine()

function context(url?: string): QueryStringContext {
  const querySource = url ?? session.info.webId
  if (querySource == null) {
    throw new Error('Queries require a source URL')
  }
  const context: QueryStringContext = {
    sources: [querySource],
    baseIRI: url,
    lenient: true
  }
  if (session.info.isLoggedIn) {
    // context.fetch = session.fetch
    context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session
  }
  return context
}

async function find<T>(query: string, url?: string): Promise<T[]> {
  return await new Promise((resolve, reject) => {
    queryEngine.queryBindings(query, context(url)).then((bindingsStream: BindingsStream) => {
      const output: T[] = []
      bindingsStream.on('data', (bindings: Bindings) => {
        const entry = {}
        for (const [key, value] of bindings) {
          entry[key.value] = value.value
        }
        output.push(entry as T)
      }).on('error', reject).on('end', () => { resolve(output) })
    }).catch(reject)
  })
}

async function findOne<T>(query: string, url?: string): Promise<T> {
  return await new Promise((resolve, reject) => {
    const queryForOne = query.includes('LIMIT 1') ? query : query.trimEnd() + ' LIMIT 1'
    find<T>(queryForOne, url).then((results: T[]) => { resolve(results[0]) }).catch(reject)
  })
}

async function update(query: string, url: string): Promise<void> {
  const queryContext = context(url)
  await queryEngine.queryVoid(query, queryContext)
  await queryEngine.invalidateHttpCache(undefined, queryContext)
}

async function invalidateCache(): Promise<void> {
  await queryEngine.invalidateHttpCache()
}

export { find, findOne, update, invalidateCache }
