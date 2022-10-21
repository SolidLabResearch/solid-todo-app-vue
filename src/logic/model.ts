interface ITask {
  id: string
  name: string
  creator: string
  created: string
  modified: string
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
  name?: string
  storage?: string
  oidcIssuer: string
  taskContainerPathTemplate?: string
  taskInstancePathTemplate?: string
}

interface INotification {
  type: string
  message: string
}

const taskStatusValues: Set<string> = new Set<string>([
  'http://schema.org/ActiveActionStatus',
  'http://schema.org/PotentialActionStatus',
  'http://schema.org/CompletedActionStatus',
  'http://schema.org/FailedActionStatus'
])

const allowedCharacters: string = 'abcdefghijklmnopqrstuwvxyz1234567890'
const defaultContainerPathTemplate: string = '{storage}/tasks'
const defaultInstancePathTemplate: string = '{storage}/tasks/{tasklist}'

const defaultWebId: string = '' // 'http://localhost:3000/example/profile/card#me' // for local development purposes

function identifierFromName(name: string): string {
  // This will throw an error when name is undefined, which can be the case if the user does not provide one, but it is fine
  return Array.from(name.trim().toLowerCase()).map((char) => allowedCharacters.includes(char) ? char : '-').join('')
}

export { type ITask, type ITaskList, type IWebID, type INotification, taskStatusValues, defaultWebId, defaultContainerPathTemplate, defaultInstancePathTemplate, identifierFromName }
