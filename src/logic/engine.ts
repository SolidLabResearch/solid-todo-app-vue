import { QueryEngine } from '@comunica/query-sparql-link-traversal-solid'
import { ActorHttpInruptSolidClientAuthn } from '@comunica/actor-http-inrupt-solid-client-authn'
import { Bindings, BindingsStream, QueryStringContext } from '@comunica/types'
import { fetch, Session } from '@inrupt/solid-client-authn-browser'

const queryEngine: QueryEngine = new QueryEngine()
const fetchedUrls: Set<string> = new Set<string>()

type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

function createCustomFetch(hostnamesWithoutCaching: string[]): FetchFunction {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    let currentUrl: URL
    if (input instanceof Request) {
      currentUrl = new URL(input.url)
    } else if (input instanceof URL) {
      currentUrl = input
    } else {
      currentUrl = new URL(input)
    }
    if (hostnamesWithoutCaching.includes(currentUrl.hostname)) {
      fetchedUrls.add(currentUrl.href)
      init = init ?? {}
      init.cache = 'no-store'
    }
    return await fetch(input, init)
  }
}

function context(session?: Session, url?: string): QueryStringContext {
  const source: URL = new URL(url ?? session?.info.webId as string)
  const context: QueryStringContext = {
    sources: [source.href],
    lenient: true,
    baseIRI: url,
    fetch: createCustomFetch([source.hostname])
  }
  if (session?.info.isLoggedIn ?? false) {
    context[ActorHttpInruptSolidClientAuthn.CONTEXT_KEY_SESSION.name] = session
  }
  return context
}

async function invalidateAllFetchedUrlsForHostname(hostname: string): Promise<void> {
  const urlsToInvalidate: string[] = [...fetchedUrls.values()].filter((url) => url != null && new URL(url).hostname === hostname)
  await Promise.all(urlsToInvalidate.map(async (url) => await queryEngine.invalidateHttpCache(url)))
  fetchedUrls.clear()
}

async function find<T>(query: string, session?: Session, url?: string): Promise<T[]> {
  return await new Promise<T[]>((resolve, reject) => {
    const output: Map<string, Record<string, string>> = new Map<string, Record<string, string>>()
    queryEngine.invalidateHttpCache().then(() => {
      queryEngine.queryBindings(query, context(session, url))
        .then((bindingsStream: BindingsStream) => bindingsStream
          .on('data', (bindings: Bindings) => {
            const subject: string | undefined = bindings.get('id')?.value
            if (subject != null) {
              let entity: Record<string, string>
              if (output.has(subject)) {
                entity = output.get(subject) as Record<string, string>
              } else {
                entity = { id: subject }
                output.set(subject, entity)
              }
              bindings.delete('id').forEach((value, key) => { entity[key.value] = value.value })
            }
          })
          .on('end', () => resolve(Array.from(output.values()) as T[]))
          .on('error', reject)
        )
        .catch(reject)
    }).catch(reject)
  })
}

async function findOne<T>(query: string, session?: Session, url?: string): Promise<T> {
  const results: T[] = await find<T>(query, session, url)
  return results[0]
}

async function update(query: string, session?: Session, url?: string): Promise<void> {
  const targetHostname: string = new URL(url ?? session?.info.webId as string).hostname
  await queryEngine.queryVoid(query, context(session, url))
  await invalidateAllFetchedUrlsForHostname(targetHostname)
}

export { find, findOne, update }
