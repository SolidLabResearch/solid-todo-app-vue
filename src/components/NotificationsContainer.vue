<script setup lang="ts">
import { notifications } from '../logic/notifications'
</script>

<template>
  <div class="flex flex-col-reverse gap-1 fixed top-2 left-1/4 w-2/4 z-20">
    <p class="py-2 px-3 text-white rounded shadow hover:opacity-50 text-center cursor-pointer" @click="notifications.delete(notification)" :class="notification.type" v-for="notification in notifications" v-bind:key="notification.message">{{ notification.message }}</p>
  </div>
</template>

<style scoped>
  p.info {
    background-color: cornflowerblue;
  }
  p.error {
    background-color: crimson;
  }
  p.confirmation {
    background-color: green;
  }
</style>
