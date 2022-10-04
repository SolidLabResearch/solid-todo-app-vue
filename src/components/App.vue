<script setup lang="ts">
import LoginForm from './LoginForm.vue'
import TaskListBrowser from './TaskListBrowser.vue'
import { session } from '../logic/session'
</script>

<template>
  <Suspense v-if="session.info.isLoggedIn">
    <TaskListBrowser />
  </Suspense>
  <Suspense v-else>
    <LoginForm />
  </Suspense>
</template>
