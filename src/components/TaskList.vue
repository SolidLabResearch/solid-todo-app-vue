<script setup lang="ts">
import { type Ref, type PropType, ref } from 'vue'
import { type ITask, type ITaskList } from '../logic/model'
import { getTasks, createTask, removeTask, saveTask } from '../logic/queries'
import { confirmation, error } from '../logic/notifications'
import { translations } from '../logic/language'

import SubmitButton from './SubmitButton.vue'
import TaskListItem from './TaskListItem.vue'
import CreateEntryForm from './CreateEntryForm.vue'

const props = defineProps({
  list: { type: Object as PropType<ITaskList>, required: true },
  removeHandler: { type: Function, required: true },
  saveHandler: { type: Function, required: true }
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

async function saveTaskWrapper(task: ITask): Promise<void> {
  await saveTask(props.list, task)
  const entries: ITask[] = await getTasks(props.list)
  tasks.value = entries
}

function saveTaskHandler(task: ITask): void {
  saveTaskWrapper(task)
    .then(() => confirmation(`${translations.value.updateSuccess}: ${task.name}`))
    .catch(error)
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
  <div class="flex flex-col border-x-2 border-b-2 border-background" :title="list.id.href">
    <form class="flex flex-row p-2 bg-background">
      <input type="text" v-model="list.name" class="flex-grow font-semibold" :placeholder="translations.name" />
      <SubmitButton icon="save" @click="saveHandler(list)" />
      <SubmitButton icon="remove" @click="removeHandler(list)" />
      <SubmitButton icon="toggle" @click="toggleItems" :toggle="showEntries" />
    </form>
    <div v-if="showEntries" class="grid grid-cols-5 gap-1 bg-white mt-2 ml-2 mr-2 p-2">
      <label for="{{ list.id }}#id" class="text-sm">id</label>
      <p v-if="list.id" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#id">{{ list.id }}</p>
      <label v-if="list.creator" for="{{ list.id }}#creator" class="text-sm">{{ translations.creator }}</label>
      <a v-if="list.creator" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#creator" :href="list.creator">{{ list.creator }}</a>
      <label v-if="list.created" for="{{ list.id }}#created" class="text-sm">{{ translations.created }}</label>
      <p v-if="list.created" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#created">{{ list.created }}</p>
      <label v-if="list.modified" for="{{ list.id }}#modified" class="text-sm">{{ translations.modified }}</label>
      <p v-if="list.modified" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#modified">{{ list.modified }}</p>
    </div>
    <div v-if="showEntries" class="flex flex-col gap-2 p-2">
      <CreateEntryForm :create-handler="createTaskHandler" :busy="busy" class="py-1 px-2 bg-white" />
      <TaskListItem v-for="task in tasks" v-bind:key="task.id.href" :list="list" :task="task" :remove-handler="removeTaskHandler" :save-handler="saveTaskHandler" class="py-1 px-2 bg-white" />
    </div>
  </div>
</template>
