<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type ITaskList, getTaskLists, createTaskList, removeTaskList, saveTaskList, translations, confirmation, error } from '../logic'
import AccountMenu from './AccountMenu.vue'
import TaskList from './TaskList.vue'
import CreateEntryForm from './CreateEntryForm.vue'

const taskLists: Ref<ITaskList[]> = ref(await getTaskLists())
const busy: Ref<boolean> = ref(false)

async function createTaskListWrapper(name: string): Promise<void> {
  busy.value = true
  await createTaskList(name)
  const lists: ITaskList[] = await getTaskLists()
  taskLists.value = lists
  busy.value = false
}

async function saveListWrapper(list: ITaskList): Promise<void> {
  await saveTaskList(list)
  const lists: ITaskList[] = await getTaskLists()
  taskLists.value = lists
}

function saveHandler(list: ITaskList): void {
  saveListWrapper(list)
    .then(() => confirmation(`${translations.value.updateSuccess}: ${list.name}`))
    .catch((reason: any) => error(reason))
}

function createHandler(name: string): void {
  createTaskListWrapper(name)
    .then(() => confirmation(`${translations.value.createSuccess}: ${name}`))
    .catch(error)
}

async function removeListWrapper(list: ITaskList): Promise<void> {
  await removeTaskList(list)
  const lists: ITaskList[] = await getTaskLists()
  taskLists.value = lists
}

function removeHandler(list: ITaskList): void {
  removeListWrapper(list)
    .then(() => confirmation(`${translations.value.deleteSuccess}: ${list.name}`))
    .catch(error)
}
</script>

<template>
  <header class="flex flex-row items-center py-4 px-8 bg-white shadow-md">
    <img src="/solid.svg" class="h-8 mr-3">
    <h1 class="text-solidblue text-lg uppercase mr-auto">{{ translations.appName }}</h1>
    <AccountMenu />
  </header>
  <main class="flex flex-col flex-grow my-4 mx-8 gap-2">
    <CreateEntryForm :create-handler="createHandler" :busy="busy" class="p-2 bg-white" />
    <TaskList v-for="list in taskLists" v-bind:key="list.id.href" :list="list" :remove-handler="removeHandler" :save-handler="saveHandler" />
  </main>
  <footer class="mt-auto bg-solidblue p-8">
    <p class="m-auto text-geysergrey text-center">{{ translations.footerText }}</p>
  </footer>
</template>
