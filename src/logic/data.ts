import { reactive } from 'vue'
import { type ITask } from './model'
import { findTaskEntries } from './query'
import { session } from './session'

const tasks: ITask[] = reactive(new Array<ITask>())

async function fillDataFromPod(): Promise<void> {
  if (session.info.isLoggedIn) {
    const taskData: ITask[] = await findTaskEntries(session)
    for (const task of taskData) {
      tasks.push(task)
    }
  }
}

await fillDataFromPod()

export { tasks }
