<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon, TrashIcon, PencilSquareIcon, PaperAirplaneIcon } from '@heroicons/vue/24/solid'

defineProps({
  icon: { type: String, required: true },
  toggle: { type: Boolean, required: false }
})

const submitHandler = (event: Event) => event.preventDefault()
const buttonClass = 'h-4 w-4'
</script>

<template>
  <button type="submit" @click="submitHandler" class="flex flex-row items-center ml-4 p-1 bg-transparent text-foreground cursor-pointer hover:bg-accent hover:text-background transition-colors">
    <PencilSquareIcon v-if="icon === 'save'" :class="buttonClass" />
    <TrashIcon v-else-if="icon === 'remove'" :class="buttonClass" />
    <PaperAirplaneIcon v-else-if="icon === 'add'" :class="buttonClass" />
    <ArrowDownIcon v-else-if="icon === 'toggle' && !toggle" :class="buttonClass" />
    <ArrowUpIcon v-else-if="icon === 'toggle'" :class="buttonClass" />
  </button>
</template>
