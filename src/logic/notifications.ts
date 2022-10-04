import { Ref, ref } from 'vue'

const notifications: Ref<Set<string>> = ref(new Set<string>())

function notify(message: string, duration?: number): void {
  notifications.value.add(message)
  setTimeout(() => {
    if (notifications.value.has(message)) {
      notifications.value.delete(message)
    }
  }, duration ?? 5000)
}

export { notifications, notify }
