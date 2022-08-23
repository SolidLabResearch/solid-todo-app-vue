<script setup lang="ts">
import { tasks } from '../logic/data'
import { session } from '../logic/session'
import TaskListItem from './TaskListItem.vue'
</script>

<template>
  <div v-if="session.info.isLoggedIn" class="flex flex-col m-6">
    <TaskListItem v-for="task in tasks" v-bind:key="task.id" :task="task" />
  </div>
  <p v-else class="m-auto text-center">Please log in via your WebID provider to begin!</p>
</template>
