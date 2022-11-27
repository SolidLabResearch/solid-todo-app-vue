<script setup lang="ts">
import { ref, type Ref } from 'vue'

import ActionButton from './ActionButton.vue'

const props = defineProps({
  submitHandler: { type: Function, required: true },
  setBusy: { type: Function, required: true },
  placeholder: { type: String, required: true }
})

const name: Ref<string> = ref('')

function createHandlerWrapper(): void {
  props.setBusy(true)
  props.submitHandler(name.value)
  name.value = ''
}
</script>

<template>
  <form class="flex flex-row">
    <input class="flex-grow rounded bg-transparent" v-model="name" type="text" :placeholder="placeholder" minlength="1" />
    <ActionButton icon="add" @click="createHandlerWrapper" />
  </form>
</template>
