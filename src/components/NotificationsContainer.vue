<script setup lang="ts">
import { notifications } from '../logic'
</script>

<template>
  <div class="flex flex-col-reverse">
    <p class="py-2 px-3 text-white hover:opacity-80 text-center cursor-pointer" v-on:click="notifications.delete(notification)" :class="notification.type" v-for="notification in notifications" v-bind:key="notification.message">{{ notification.message }}</p>
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
