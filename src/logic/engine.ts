import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { session, fetchWithSession } from './session'

const queryEngine: QueryEngine = new QueryEngine()

function context(url?: string): QueryStringContext {
  return {
    sources: [url ?? session.info.webId as string],
    lenient: true,
    baseIRI: url,
    fetch: fetchWithSession,
    [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session
  }
}

async function find<T>(query: string, url?: string): Promise<T[]> {
  return await new Promise<T[]>((resolve, reject) => {
    queryEngine.queryBindings(query, context(url))
      .then((bindingsStream: BindingsStream) => {
        const output: Map<string, Record<string, string | URL>> = new Map<string, Record<string, string>>()
        bindingsStream.on('data', (bindings: Bindings) => {
          const subject: string | undefined = bindings.get('id')?.value
          if (subject != null) {
            let entity: Record<string, string | URL>
            if (output.has(subject)) {
              entity = output.get(subject) as Record<string, string>
            } else {
              entity = { id: subject }
              output.set(subject, entity)
            }
            bindings.delete('id').forEach((value, key) => { entity[key.value] = value.value })
          }
        }).on('end', () => resolve(Array.from(output.values()) as T[])).on('error', reject)
      }).catch(reject)
  })
}

async function findOne<T>(query: string, url?: string): Promise<T> {
  const results: T[] = await find<T>(query, url)
  return results[0]
}

async function update(query: string, url: string): Promise<void> {
  const queryContext: QueryStringContext = context(url)
  await queryEngine.queryVoid(query, queryContext)
  await queryEngine.invalidateHttpCache(undefined, queryContext)
}

async function invalidateCache(): Promise<void> {
  await queryEngine.invalidateHttpCache()
}

export { find, findOne, update, invalidateCache }
