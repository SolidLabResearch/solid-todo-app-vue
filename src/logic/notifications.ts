import { type Ref, ref } from 'vue'
import { type INotification } from './model'

const notifications: Ref<Set<INotification>> = ref(new Set<INotification>())
const defaultDuration: number = 5000

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
  notifications.value.add(notification)
  if (duration != null) {
    setTimeout(() => {
      if (notifications.value.has(notification)) {
        notifications.value.delete(notification)
      }
    }, duration)
  }
}

const error = (message: string): void => { notify('error', message) }
const info = (message: string): void => { notify('info', message, defaultDuration) }
const confirmation = (message: string): void => { notify('confirmation', message, defaultDuration) }

export { notifications, error, info, confirmation }
