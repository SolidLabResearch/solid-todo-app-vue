<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type ITask } from '../logic/model'
import { getTasks } from '../logic/queries'
import { error } from '../logic/notifications'
import { translations } from '../logic/language'

import SubmitButton from './SubmitButton.vue'
import TaskListItem from './TaskListItem.vue'

const tasks: Ref<ITask[]> = ref([])
const showEntries: Ref<boolean> = ref(false)

function toggleItems(event?: Event): void {
  event?.preventDefault()
  showEntries.value = !showEntries.value
  if (showEntries.value && tasks.value.length < 1) {
    getTasks().then((value) => { tasks.value = value }).catch(error)
  } else if (tasks.value.length > 0) {
    tasks.value = []
  }
}
</script>

<template>
  <div class="flex flex-col border-x-2 border-b-2 border-background" :title="translations.defaultTaskList">
    <form class="flex flex-row p-2 bg-background">
      <input type="text" v-model="translations.defaultTaskList" class="flex-grow font-semibold text-gray-400" :placeholder="translations.name" disabled />
      <SubmitButton icon="toggle" @click="toggleItems" :toggle="showEntries" />
    </form>
    <div v-if="showEntries" class="flex flex-row bg-white mt-2 ml-2 mr-2 p-2">
        <p class="text-gray-400">{{ translations.defaultTaskListDescription }}</p>
    </div>
    <div v-if="showEntries" class="flex flex-col gap-2 p-2">
      <TaskListItem v-for="task in tasks" v-bind:key="task.id.href" :task="task" class="py-1 px-2 bg-white" />
    </div>
  </div>
</template>
