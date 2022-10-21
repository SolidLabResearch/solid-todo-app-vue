<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { translations } from '../logic'
import SubmitButton from './SubmitButton.vue'
import ProgressIndicator from './ProgressIndicator.vue'

const props = defineProps({
  createHandler: { type: Function, required: true },
  busy: { type: Boolean, required: true }
})

const name: Ref<string> = ref('')

function createHandlerWrapper(): void {
  props.createHandler(name.value)
  name.value = ''
}
</script>

<template>
  <ProgressIndicator icon="arrow" :text="translations.wait" v-if="busy" />
  <form v-else class="flex flex-row">
    <input class="flex-grow" v-model="name" type="text" :placeholder="translations.name" minlength="1" />
    <SubmitButton icon="add" @click="createHandlerWrapper" />
  </form>
</template>
