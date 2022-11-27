interface ITask {
  id: string
  title: string
  creator?: string
  created?: string
  modified?: string
  status?: string
  description?: string
}

interface ITaskList {
  id: string
  title: string
  creator?: string
  created?: string
  modified?: string
  description?: string
}

interface IWebID {
  id: string
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
