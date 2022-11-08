<script setup lang="ts">
import { notifications, removeNotification } from '../logic/notifications'
</script>

<template>
  <div class="flex flex-col-reverse fixed w-full z-20 shadow-sm">
    <p class="py-2 px-3 text-white hover:opacity-80 text-center cursor-pointer" @click="removeNotification(notification)" :class="notification.type" v-for="notification in notifications" v-bind:key="notification.message">{{ notification.message }}</p>
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
