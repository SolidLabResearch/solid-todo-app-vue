import { Ref, ref } from 'vue'
import { type INotification } from './model'

const notifications: Ref<INotification[]> = ref([])
const defaultDuration: number = 5000

function findIndex(notification: INotification): number {
  return notifications.value.findIndex((n) => n.message === notification.message && n.type === notification.type)
}

function removeNotification(notification: INotification): void {
  for (let match = findIndex(notification); match > -1; match = findIndex(notification)) {
    notifications.value.splice(match, 1)
  }
}

function notify(notificationType: string, notificationMessage: string, duration?: number): void {
  const notification: INotification = {
    type: notificationType,
    message: notificationMessage
  }
  for (const existingNotification of notifications.value) {
    if (existingNotification.message === notification.message && existingNotification.type === notification.type) {
      return
    }
  }
  notifications.value.push(notification)
  if (duration != null) {
    setTimeout(() => removeNotification(notification), duration)
  }
}

const error = (message: string): void => notify('error', message)
const info = (message: string): void => notify('info', message, defaultDuration)
const confirmation = (message: string): void => notify('confirmation', message, defaultDuration)

export { notifications, error, info, confirmation, removeNotification }
