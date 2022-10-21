import { getDefaultSession, Session } from '@inrupt/solid-client-authn-browser'

const session: Session = getDefaultSession()

async function login(provider: string, appName: string): Promise<void> {
  if (!session.info.isLoggedIn) {
    await session.login({
      oidcIssuer: provider,
      clientName: appName,
      redirectUrl: window.location.href
    })
  }
}

async function logout(): Promise<void> {
  if (session.info.isLoggedIn) {
    await session.logout()
    location.reload()
  }
}

async function handleRedirectAfterPageLoad(): Promise<void> {
  await session.handleIncomingRedirect(window.location.href)
}

await handleRedirectAfterPageLoad()

export { login, logout, session }
