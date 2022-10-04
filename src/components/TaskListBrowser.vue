<script setup lang="ts">
import AccountMenu from './AccountMenu.vue'
import { type ITaskList } from '../logic/model'
import { getTaskLists } from '../logic/query'
import TaskList from './TaskList.vue'
import NotificationsContainer from './NotificationsContainer.vue'

const taskLists: ITaskList[] = await getTaskLists()
</script>

<template>
  <header class="flex flex-row items-center py-4 px-8 bg-white shadow-md">
    <img src="/solid.svg" class="h-8 mr-3">
    <h1 class="text-solidblue text-lg uppercase mr-auto">Solid Tasks</h1>
    <AccountMenu />
  </header>
  <main class="flex flex-col flex-grow py-4 px-8">
    <NotificationsContainer />
    <TaskList v-for="list in taskLists" v-bind:key="list.id" :list="list" />
  </main>
  <footer class="mt-auto bg-solidblue p-8">
    <p class="m-auto text-geysergrey text-center">Yay!</p>
  </footer>
</template>
