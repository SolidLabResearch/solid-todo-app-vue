<script setup lang="ts">
import { tasks } from '../logic/data'
import TaskEntry from './TaskEntry.vue'
</script>

<template>
  <div class="tasklist">
    <TaskEntry v-bind:key="task.id" v-for="task in tasks" :task="task" />
  </div>
</template>

<style scoped>
.tasklist {
  display: flex;
  flex-direction: column;
}
</style>
