<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type ITaskList, getTaskLists, createTaskList, removeTaskList, saveTaskList, translations, confirmation, error } from '../logic'

import AccountMenu from './AccountMenu.vue'
import ListSelector from './ListSelector.vue'
import ListViewer from './ListViewer.vue'
import AppIcon from './AppIcon.vue'
import ActivityIndicator from './ActivityIndicator.vue'

const lists: Ref<ITaskList[]> = ref([])
const busy: Ref<boolean> = ref(false)
const currentList: Ref<ITaskList | undefined> = ref()
const display: Ref<string> = ref('busy')

function setBusy(state: boolean) {
  busy.value = state
  display.value = state ? 'busy' : currentList.value != null ? 'view' : 'select'
}

function setCurrentList(list?: ITaskList) {
  currentList.value = list
  display.value = busy.value ? 'busy' : list != null ? 'view' : 'select'
}

function loadLists(refresh: boolean = false) {
  setBusy(true)
  getTaskLists(refresh).then((result) => {
    lists.value = result
    setBusy(false)
  }).catch(error)
}

function refresh(): void {
  setCurrentList(undefined)
  loadLists(true)
}

function saveList(list: ITaskList): void {
  setBusy(true)
  saveTaskList(list).then(() => {
    lists.value = lists.value.sort((a, b) => a.title.localeCompare(b.title))
    setBusy(false)
    confirmation(`${translations.value.updateSuccess}: ${list.title}`)
  }).catch(error)
}

function createList(title: string): void {
  setBusy(true)
  createTaskList(title).then((list) => {
    lists.value.push(list)
    lists.value.sort((a, b) => a.title.localeCompare(b.title))
    setBusy(false)
    confirmation(`${translations.value.createSuccess}: ${list.title}`)
  }).catch(error)
}

function removeList(list: ITaskList): void {
  setBusy(true)
  removeTaskList(list).then(() => {
    lists.value = lists.value.filter((t) => t.id !== list.id)
    lists.value.sort((a, b) => a.title.localeCompare(b.title))
    setCurrentList(undefined)
    setBusy(false)
    confirmation(`${translations.value.deleteSuccess}: ${list.title}`)
  }).catch(error)
}

loadLists()
</script>

<template>
  <header class="flex flex-row items-center py-4 px-8 z-10 bg-background border-b">
    <AppIcon class="w-7 h-7 mr-3" />
    <h1 class="text-lg mr-auto">{{ translations.appName }}</h1>
    <AccountMenu :refresh="refresh" />
  </header>
  <main class="flex flex-col flex-grow pt-4 pb-8 px-8">
    <ListViewer v-show="!busy" v-if="currentList != null" :list="currentList" :remove-list="removeList" :save-list="saveList" :set-busy="setBusy" :set-current-list="setCurrentList" />
    <ListSelector v-if="!busy && currentList == null" :create-list="createList" :set-busy="setBusy" :lists="lists" :set-current-list="setCurrentList" :remove-list="removeList" />
    <ActivityIndicator v-show="busy" :text="translations.wait" />
  </main>
  <footer class="flex flex-row bg-foreground">
    <p class="text-muffled text-sm py-12 px-8 m-auto text-center">{{ translations.footerText }}</p>
  </footer>
</template>
