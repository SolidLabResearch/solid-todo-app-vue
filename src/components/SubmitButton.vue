<script setup lang="ts">
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XMarkIcon, PlusIcon } from '@heroicons/vue/20/solid'

defineProps({
  icon: { type: String, required: true },
  toggle: { type: Boolean, required: false }
})

const submitHandler = (event: Event) => event.preventDefault()
</script>

<template>
  <button type="submit" @click="submitHandler" class="flex flex-row items-center ml-4 p-1 bg-white cursor-pointer hover:bg-royallavender hover:text-white transition-colors">
    <CheckIcon v-if="icon === 'save'" class="h-5 w-5" />
    <XMarkIcon v-else-if="icon === 'remove'" class="h-5 w-5" />
    <PlusIcon v-else-if="icon === 'add'" class="h-5 w-5" />
    <ArrowDownIcon v-else-if="icon === 'toggle' && !toggle" class="h-5 w-5" />
    <ArrowUpIcon v-else-if="icon === 'toggle'" class="h-5 w-5" />
  </button>
</template>
