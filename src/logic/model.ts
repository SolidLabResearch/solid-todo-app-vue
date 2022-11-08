interface ITask {
  id: URL
  name: string
  creator: string
  created: string
  modified: string
  status: string
  description: string
}

interface ITaskList {
  id: URL
  name: string
  creator: string
  created: string
  modified: string
  description: string
}

interface IWebID {
  id: URL
  name?: string
  storage?: string
  oidcIssuer: string
  pathTemplate?: string
}

interface INotification {
  type: string
  message: string
}

export { type ITask, type ITaskList, type IWebID, type INotification }
