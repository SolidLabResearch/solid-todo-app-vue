<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type ITaskList } from '../logic/model'
import { getTaskLists, createTaskList, removeTaskList, saveTaskList } from '../logic/queries'
import { translations } from '../logic/language'
import { confirmation, error } from '../logic/notifications'

import AccountMenu from './AccountMenu.vue'
import TaskList from './TaskList.vue'
import CreateEntryForm from './CreateEntryForm.vue'
import ApplicationIcon from './ApplicationIcon.vue'
import ActivityIndicator from './ActivityIndicator.vue'

const taskLists: Ref<ITaskList[]> = ref([])
const busy: Ref<boolean> = ref(false)

function saveHandler(list: ITaskList): void {
  busy.value = true
  saveTaskList(list)
    .then(() => {
      taskLists.value = taskLists.value.sort((a, b) => a.title.localeCompare(b.title))
      busy.value = false
      confirmation(`${translations.value.updateSuccess}: ${list.title}`)
    })
    .catch((reason: any) => error(reason))
}

function createHandler(title: string): void {
  busy.value = true
  createTaskList(title)
    .then((list) => {
      taskLists.value.push(list)
      taskLists.value.sort((a, b) => a.title.localeCompare(b.title))
      busy.value = false
      confirmation(`${translations.value.createSuccess}: ${list.title}`)
    })
    .catch(error)
}

function removeHandler(list: ITaskList): void {
  busy.value = true
  removeTaskList(list)
    .then(() => {
      taskLists.value = taskLists.value.filter((t) => t.id !== list.id)
      taskLists.value.sort((a, b) => a.title.localeCompare(b.title))
      busy.value = false
      confirmation(`${translations.value.deleteSuccess}: ${list.title}`)
    })
    .catch(error)
}

function setBusy(state: boolean): void {
  busy.value = state
}

getTaskLists()
  .then((lists: ITaskList[]) => { taskLists.value = lists })
  .catch((reason) => error(reason))
</script>

<template>
  <header class="flex flex-row items-center py-4 px-8 z-10 bg-background border-b">
    <ApplicationIcon class="w-7 h-7 mr-3" />
    <h1 class="text-lg mr-auto">{{ translations.appName }}</h1>
    <AccountMenu />
  </header>
  <main class="flex flex-col flex-grow pt-4 pb-8 px-8">
    <ActivityIndicator v-if="busy" :text="translations.wait" />
    <div class="flex flex-col flex-grow gap-2" v-else>
      <CreateEntryForm :create-handler="createHandler" :set-busy="setBusy" :placeholder="translations.newTaskList" />
      <TaskList v-for="list in taskLists" v-bind:key="list.id" :list="list" :set-busy="setBusy" :remove-handler="removeHandler" :save-handler="saveHandler" />
    </div>
  </main>
  <footer class="flex flex-row bg-foreground">
    <p class="text-muffled text-sm py-12 px-8 m-auto text-center">{{ translations.footerText }}</p>
  </footer>
</template>
