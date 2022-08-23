<script setup lang="ts">
import { ITask } from '../logic/model'
defineProps<{ task: ITask }>()
</script>

<template>
  <div class="task">
    <input type="text" v-model="task.title" />
    <textarea v-model="task.description"></textarea>
    <i>{{ task?.id }}</i>
    <button v-on:click="task.save">Save</button>
    <button v-on:click="task.delete">Delete</button>
  </div>
</template>

<style scoped>
.task {
  display: grid;
  grid-template-columns: 80% 9% 9%;
  gap: 0.4rem;
  padding: 1rem;
  box-shadow: 0 0 0.4rem lightgray;
  margin-bottom: 1rem;
  background-color: white;
  transition: box-shadow 0.3s ease;
  border-radius: 0.2rem;
}

.task:hover {
  box-shadow: 0 0 0.2rem grey;
}

.task i {
  font-size: 0.8rem;
  color: gray;
}

.task input,
.task textarea {
  grid-column: 1 / 4;
  border: none;
  padding: 0;
}

input {
  font-weight: bold;
}
</style>
