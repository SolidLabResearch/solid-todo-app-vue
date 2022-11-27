<script setup lang="ts">

defineProps({
  text: { type: String, required: true }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-gray-400 m-auto">
    <span class="material-symbols-outlined h-6 w-6 animate-spin">hourglass_empty</span>
    <p>{{ text }}</p>
  </div>
</template>
