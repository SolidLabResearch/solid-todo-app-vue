<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

defineProps({
  icon: { type: String, required: true },
  text: { type: String, required: true }
})
</script>

<template>
  <div class="flex flex-row items-center gap-4 text-gray-400">
    <ArrowPathIcon v-if="icon === 'arrow'" class="h-5 w-5 animate-spin" />
    <p>{{ text }}</p>
  </div>
</template>
