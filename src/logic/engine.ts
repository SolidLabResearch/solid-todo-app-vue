import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { fetch as inruptFetch } from '@inrupt/solid-client-authn-browser'
import { session } from './session'

const queryEngine: QueryEngine = new QueryEngine()

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

function fetchWithoutCache(hostname: string): FetchFunction {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const currentUrl: URL = input instanceof URL ? input : input instanceof Request ? new URL(input.url) : new URL(input)
    if (currentUrl.hostname === hostname) {
      init = init ?? {}
      init.cache = 'no-store'
    }
    return await inruptFetch(input, init)
  }
}

function context(url?: URL): QueryStringContext {
  return {
    sources: [url?.href ?? session.info.webId as string],
    lenient: true,
    baseIRI: url?.href,
    [ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name]: session,
    fetch: fetchWithoutCache(url?.hostname ?? new URL(session.info.webId as string).hostname)
  }
}

async function find<T>(query: string, url?: URL): Promise<T[]> {
  return await new Promise<T[]>((resolve, reject) => {
    queryEngine.invalidateHttpCache().then(() => { // invalidates everything every time, needs to be fixed
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
                entity = { id: new URL(subject) }
                output.set(subject, entity)
              }
              bindings.delete('id').forEach((value, key) => { entity[key.value] = value.value })
            }
          }).on('end', () => resolve(Array.from(output.values()) as T[])).on('error', reject)
        }).catch(reject)
    }).catch(reject)
  })
}

async function findOne<T>(query: string, url?: URL): Promise<T> {
  const results: T[] = await find<T>(query, url)
  return results[0]
}

async function update(query: string, url: URL): Promise<void> {
  await queryEngine.queryVoid(query, context(url))
  await queryEngine.invalidateHttpCache()
}

export { find, findOne, update }
