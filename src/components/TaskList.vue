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
  setBusy: { type: Function, required: true },
  removeHandler: { type: Function, required: true },
  saveHandler: { type: Function, required: true }
})

const tasks: Ref<ITask[]> = ref([])
const showEntries: Ref<boolean> = ref(false)

function toggleItems(event: Event): void {
  event.preventDefault()
  showEntries.value = !showEntries.value
  if (showEntries.value && tasks.value.length < 1) {
    getTasks(props.list).then((value) => { tasks.value = value }).catch(error)
  } else if (tasks.value.length > 0) {
    tasks.value = []
  }
}

function saveTaskHandler(task: ITask): void {
  props.setBusy(true)
  saveTask(props.list, task)
    .then(() => {
      props.setBusy(false)
      confirmation(`${translations.value.updateSuccess}: ${task.title}`)
    })
    .catch(error)
}

function createTaskHandler(title: string): void {
  props.setBusy(true)
  createTask(props.list, title)
    .then((task) => {
      tasks.value.push(task)
      tasks.value.sort((a, b) => a.title.localeCompare(b.title))
      props.setBusy(false)
      confirmation(`${translations.value.createSuccess}: ${task.title}`)
    })
    .catch(error)
}

function removeTaskHandler(task: ITask): void {
  props.setBusy(true)
  removeTask(task)
    .then(() => {
      tasks.value = tasks.value.filter((t) => t.id !== task.id)
      props.setBusy(false)
      confirmation(`${translations.value.deleteSuccess}: <${task.title}>`)
    })
    .catch(error)
}
</script>

<template>
  <div class="flex flex-col border-x-2 border-b-2 border-background rounded" :title="list.id">
    <form class="flex flex-row p-2 bg-background">
      <input type="text" v-model="list.title" class="flex-grow font-bold" :placeholder="translations.name" />
      <SubmitButton icon="save" @click="saveHandler(list)" />
      <SubmitButton icon="remove" @click="removeHandler(list)" />
      <SubmitButton icon="toggle" @click="toggleItems" :toggle="showEntries" />
    </form>
    <div v-if="showEntries" class="grid grid-cols-5 gap-1 bg-white mt-2 ml-2 mr-2 p-2 rounded">
      <label for="{{ list.id }}#id" class="text-sm">id</label>
      <a v-if="list.id" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#id" :href="list.id">{{ list.id }}</a>
      <label v-if="list.creator" for="{{ list.id }}#creator" class="text-sm">{{ translations.creator }}</label>
      <a v-if="list.creator" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#creator" :href="list.creator">{{ list.creator }}</a>
      <label v-if="list.created" for="{{ list.id }}#created" class="text-sm">{{ translations.created }}</label>
      <p v-if="list.created" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#created">{{ list.created }}</p>
      <label v-if="list.modified" for="{{ list.id }}#modified" class="text-sm">{{ translations.modified }}</label>
      <p v-if="list.modified" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#modified">{{ list.modified }}</p>
    </div>
    <div v-if="showEntries" class="flex flex-col gap-2 p-2">
      <CreateEntryForm :create-handler="createTaskHandler" :set-busy="setBusy" :placeholder="translations.newTask" class="py-1 px-2 bg-background rounded" />
      <TaskListItem v-for="task in tasks" v-bind:key="task.id" :task="task" :remove-handler="removeTaskHandler" :save-handler="saveTaskHandler" class="py-1 px-2 bg-background rounded" />
    </div>
  </div>
</template>
