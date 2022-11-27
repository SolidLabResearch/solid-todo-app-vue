<script setup lang="ts">
import { session } from '../logic'

import LoginForm from './LoginForm.vue'
import ListBrowser from './ListBrowser.vue'
import NotificationsContainer from './NotificationsContainer.vue'
</script>

<template>
  <NotificationsContainer />
  <ListBrowser v-if="session.info.isLoggedIn" />
  <LoginForm v-else />
</template>
