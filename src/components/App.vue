<script setup lang="ts">
import LoginForm from './LoginForm.vue'
import TaskListBrowser from './TaskListBrowser.vue'
import NotificationsContainer from './NotificationsContainer.vue'
import { session } from '../logic/session'
</script>

<template>
  <NotificationsContainer />
  <TaskListBrowser v-if="session.info.isLoggedIn" />
  <LoginForm v-else />
</template>
