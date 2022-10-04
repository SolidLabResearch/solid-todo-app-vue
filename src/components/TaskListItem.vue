<script setup lang="ts">
import { XMarkIcon, CheckIcon, ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
import { type PropType, ref, Ref } from 'vue'
import { type ITask, type ITaskList, taskStatusValues } from '../logic/model'
import { saveTask } from '../logic/query'
import { notify } from '../logic/notifications'

const props = defineProps({
  task: { type: Object as PropType<ITask>, required: false, default: {} as PropType<ITask> },
  list: { type: Object as PropType<ITaskList>, required: true }
})

const showInfo: Ref<boolean> = ref(false)
const defaultId: Ref<string> = ref('')

function updateDefaultId(event?: Event): void {
  defaultId.value = `${props.list.id}#${props.task.name?.toLowerCase().replace(' ', '-')}`
}

function toggleInfo(event: Event): void {
  event.preventDefault()
  showInfo.value = !showInfo.value
}

function save(): void {
  console.log(`Save <${props.task.id}>`)
  saveTask(props.list, props.task)
    .then(() => notify(`Updated <${props.task.id}> successfully`))
    .catch((reason: any) => notify(`Update failed: ${reason}`))
}

function remove(): void {
  console.log(`Delete <${props.task.id}>`)
}

updateDefaultId()
</script>

<template>
  <div class="flex flex-col bg-white" :title="task.id ?? 'new task'">
    <div class="flex flex-row py-2 px-4 shadow-md">
      <input type="text" v-model="task.name" class="flex-grow mr-2" placeholder="name" @change="updateDefaultId" />
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Save" v-on:click="save">
        <CheckIcon class="h-5 w-5" />
      </a>
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Remove" v-on:click="remove">
        <XMarkIcon class="h-5 w-5" />
      </a>
      <a class="flex flex-row items-center ml-4 cursor-pointer hover:text-royallavender transition-colors" title="Show or hide entries" v-on:click="toggleInfo">
        <ArrowDownIcon v-if="!showInfo" class="h-5 w-5" />
        <ArrowUpIcon v-else class="h-5 w-5" />
      </a>
    </div>
    <div v-if="showInfo" class="grid grid-cols-5 gap-2 p-3">
      <label v-if="!task.id" for="{{ task.id }}#id">id</label>
      <input v-if="!task.id" class="col-span-4 text-gray-400" id="{{ task.id }}#id" v-model="task.id" :placeholder="defaultId">
      <label v-if="task.creator" for="{{ task.id }}#creator">creator</label>
      <a v-if="task.creator" class="col-span-4 text-gray-400" id="{{ task.id }}#creator" :href="task.creator">{{ task.creator }}</a>
      <label v-if="task.created" for="{{ task.id }}#created">created</label>
      <p v-if="task.created" class="col-span-4 text-gray-400" id="{{ task.id }}#created">{{ task.created }}</p>
      <label v-if="task.modified" for="{{ task.id }}#modified">modified</label>
      <p v-if="task.modified" class="col-span-4 text-gray-400" id="{{ task.id }}#modified">{{ task.modified }}</p>
      <label for="{{ task.id }}#status">status</label>
      <select class="col-span-4" id="{{ task.id }}#status" v-model="task.status">
        <option v-for="status in taskStatusValues" v-bind:key="status" :value="status">{{ status }}</option>
      </select>
      <label for="{{ task.id }}#description">description</label>
      <textarea class="col-span-4" id="{{ task.id }}#description" v-model="task.description" placeholder="description"></textarea>
    </div>
  </div>
</template>
