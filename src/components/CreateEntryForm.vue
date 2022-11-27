<script setup lang="ts">
import { ref, type Ref } from 'vue'

import SubmitButton from './SubmitButton.vue'

const props = defineProps({
  createHandler: { type: Function, required: true },
  setBusy: { type: Function, required: true },
  placeholder: { type: String, required: true }
})

const name: Ref<string> = ref('')

function createHandlerWrapper(): void {
  props.setBusy(true)
  props.createHandler(name.value)
  name.value = ''
}
</script>

<template>
  <form class="flex flex-row p-2 bg-background rounded">
    <input class="flex-grow rounded" v-model="name" type="text" :placeholder="placeholder" minlength="1" />
    <SubmitButton icon="add" @click="createHandlerWrapper" />
  </form>
</template>
