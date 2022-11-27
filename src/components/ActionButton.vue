<script setup lang="ts">
defineProps({
  icon: { type: String, required: true },
  toggle: { type: Boolean, required: false }
})

const buttonClass = 'material-symbols-outlined'
const submitHandler = (event: Event) => event.preventDefault()
</script>

<template>
  <button type="submit" @click="submitHandler" class="flex flex-row items-center ml-4 cursor-pointer hover:text-highlight transition-colors">
    <span v-if="icon === 'save'" :class="buttonClass">save</span>
    <span v-else-if="icon === 'remove'" :class="buttonClass">delete</span>
    <span v-else-if="icon === 'add'" :class="buttonClass">add</span>
    <span v-else-if="icon === 'goto'" :class="buttonClass">arrow_forward</span>
    <span v-else-if="icon === 'back'" :class="buttonClass">arrow_back</span>
    <span v-else-if="icon === 'toggle' && !toggle" :class="buttonClass">expand_more</span>
    <span v-else-if="icon === 'toggle'" :class="buttonClass">expand_less</span>
  </button>
</template>
