import { Session } from '@inrupt/solid-client-authn-browser'

const session: Session = new Session()
const afterRedirectCallbacks: CallableFunction[] = new Array<CallableFunction>()

async function login(provider: string): Promise<void> {
  if (!session.info.isLoggedIn) {
    console.log(`Login with ${provider}`)
    await session.login({
      oidcIssuer: provider,
      clientName: 'Solid Tasks',
      redirectUrl: window.location.href
    })
  }
}

async function logout(): Promise<void> {
  if (session.info.isLoggedIn) {
    console.log(`Logout from ${session.info.webId as string}`)
    await session.logout()
    const navigateTo: string = window.location.href
    window.location.href = navigateTo
  }
}

async function handleRedirect(): Promise<void> {
  await session.handleIncomingRedirect(window.location.href)
  if (session.info.isLoggedIn) {
    for (const callback of afterRedirectCallbacks) {
      await callback(session)
    }
  }
}

function registerCallback(callback: CallableFunction): void {
  afterRedirectCallbacks.push(callback)
}

await handleRedirect()

export { login, logout, session, registerCallback }
