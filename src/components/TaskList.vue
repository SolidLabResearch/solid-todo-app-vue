<script setup lang="ts">
import { type Ref, type PropType, ref } from 'vue'
import { type ITask, type ITaskList } from '../logic/model'
import { getTasks, saveTaskList } from '../logic/query'
import { notify } from '../logic/notifications'

import TaskListItem from './TaskListItem.vue'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/20/solid'

const props = defineProps({ list: { type: Object as PropType<ITaskList>, required: true } })
const tasks: ITask[] = await getTasks(props.list)
const showEntries: Ref<boolean> = ref(false)

function toggleItems(event: Event): void {
  event.preventDefault()
  showEntries.value = !showEntries.value
}

function save(): void {
  console.log(`Save <${props.list.id}>`)
  saveTaskList(props.list)
    .then(() => notify(`Updated <${props.list.id}> successfully`))
    .catch((reason: any) => notify(`Update failed: ${reason}`))
}

function remove(): void {
  console.log(`Delete <${props.list.id}>`)
}
</script>

<template>
  <div class="flex flex-col" :title="list.id">
    <div class="flex flex-row bg-white py-3 px-6 shadow-md">
      <input type="text" v-model="list.name" class="flex-grow" />
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Save" v-on:click="save">
        <CheckIcon class="h-5 w-5" />
      </a>
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Remove" v-on:click="remove">
        <XMarkIcon class="h-5 w-5" />
      </a>
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Show or hide entries" v-on:click="toggleItems">
        <ArrowDownIcon v-if="!showEntries" class="h-5 w-5" />
        <ArrowUpIcon v-else class="h-5 w-5" />
      </a>
    </div>
    <div v-if="showEntries" class="flex flex-col py-3 px-6 gap-2">
      <TaskListItem v-for="task in tasks" v-bind:key="task.id" :list="list" :task="task" />
      <TaskListItem :list="list" />
    </div>
  </div>
</template>
