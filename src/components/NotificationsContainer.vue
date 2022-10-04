<script setup lang="ts">
import { notifications } from '../logic/notifications'
</script>

<template>
  <div class="flex flex-col-reverse absolute right-0 bottom-1/2">
    <p class="bg-emerald-700 py-2 px-3 text-white shadow-md" v-for="notification in notifications" v-bind:key="notification">{{ notification}}</p>
  </div>
</template>
