<script setup lang="ts">
import { type Ref, type PropType, ref } from 'vue'
import { type ITask, type ITaskList, getTasks, saveTaskList, createTask, confirmation, error, translations, removeTask } from '../logic'
import SubmitButton from './SubmitButton.vue'
import TaskListItem from './TaskListItem.vue'
import CreateEntryForm from './CreateEntryForm.vue'

const props = defineProps({
  list: { type: Object as PropType<ITaskList>, required: true },
  removeHandler: { type: Function, required: true }
})

const busy: Ref<boolean> = ref(false)
const tasks: Ref<ITask[]> = ref([])
const showEntries: Ref<boolean> = ref(false)

function toggleItems(event?: Event): void {
  event?.preventDefault()
  showEntries.value = !showEntries.value
  if (showEntries.value && tasks.value.length < 1) {
    getTasks(props.list).then((value) => { tasks.value = value }).catch(error)
  } else if (tasks.value.length > 0) {
    tasks.value = []
  }
}

function save(): void {
  saveTaskList(props.list)
    .then(() => confirmation(`${translations.value.updateSuccess}: <${props.list.name}>`))
    .catch((reason: any) => error(reason))
}

async function createTaskWrapper(name: string): Promise<void> {
  busy.value = true
  await createTask(props.list, name)
  const entries: ITask[] = await getTasks(props.list)
  tasks.value = entries
  busy.value = false
}

function createTaskHandler(name: string): void {
  createTaskWrapper(name)
    .then(() => confirmation(`${translations.value.createSuccess}: ${name}`))
    .catch(error)
}

async function removeTaskWrapper(task: ITask): Promise<void> {
  await removeTask(task)
  const entries: ITask[] = await getTasks(props.list)
  tasks.value = entries
}

function removeTaskHandler(task: ITask): void {
  removeTaskWrapper(task)
    .then(() => confirmation(`${translations.value.deleteSuccess}: <${task.name}>`))
    .catch(error)
}
</script>

<template>
  <div class="flex flex-col border-l-2 border-b-2 border-r-2 border-white" :title="list.id">
    <form class="flex flex-row p-2 bg-white">
      <input type="text" v-model="list.name" class="flex-grow font-semibold" :placeholder="translations.name" />
      <SubmitButton icon="save" @click="save" />
      <SubmitButton icon="remove" @click="removeHandler(list)" />
      <SubmitButton icon="toggle" @click="toggleItems" :toggle="showEntries" />
    </form>
    <div v-if="showEntries" class="flex flex-col gap-2 p-2">
      <CreateEntryForm :create-handler="createTaskHandler" :busy="busy" class="py-1 px-2 bg-white" />
      <TaskListItem v-for="task in tasks" v-bind:key="task.id" :list="list" :task="task" :remove-handler="removeTaskHandler" class="py-1 px-2 bg-white" />
    </div>
  </div>
</template>
