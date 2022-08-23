<script setup lang="ts">
import LoginMenu from './components/LoginMenu.vue'
import TaskList from './components/TaskList.vue'
</script>

<template>
  <header class="bg-white flex flex-row items-center py-3 px-6 drop-shadow-md">
    <img src="/solid.svg" class="h-8 mr-3">
    <h1 class="text-solidblue text-lg uppercase mr-auto">Solid Tasks</h1>
    <Suspense>
      <LoginMenu />
    </Suspense>
  </header>
  <main class="flex flex-col flex-grow">
    <Suspense>
      <TaskList />
    </Suspense>
  </main>
  <footer class="mt-auto p-6 bg-solidblue">
    <p class="my-6 mx-auto text-white text-center">Yay!</p>
  </footer>
</template>
