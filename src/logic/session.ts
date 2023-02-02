import { type Session, getDefaultSession, fetch as fetchWithSession } from '@inrupt/solid-client-authn-browser'
import { error } from './notifications'
import { translations } from './language'

const session: Session = getDefaultSession()

async function login(provider: string, appName: string): Promise<void> {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: provider,
      clientName: appName,
      redirectUrl: window.location.href
    })
  } else {
    throw new Error('Already logged in')
  }
}

async function logout(): Promise<void> {
  if (session.info.isLoggedIn) {
    await session.logout()
    location.reload()
  }
}

async function handleRedirectAfterPageLoad(): Promise<void> {
  await session.handleIncomingRedirect({
    url: window.location.href,
    restorePreviousSession: true
  })
}

session.onSessionExpiration(() => {
  error(translations.value.sessionExpired)
})

session.onSessionRestore((currentUrl: string) => {
  if (!session.info.isLoggedIn) {
    error(translations.value.sessionExpired)
  } else {
    // confirmation(translations.value.sessionRestored) <- this works but feels like spam
  }
})

await handleRedirectAfterPageLoad()

export { login, logout, session, fetchWithSession }
