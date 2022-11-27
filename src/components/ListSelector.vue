<script setup lang="ts">
import { type PropType } from 'vue'
import { translations, type ITaskList } from '../logic'

import ActionButton from './ActionButton.vue'
import InputForm from './InputForm.vue'

defineProps({
  setCurrentList: { type: Function, required: true },
  setBusy: { type: Function, required: true },
  createList: { type: Function, required: true },
  removeList: { type: Function, required: true },
  lists: { type: Object as PropType<ITaskList[]>, required: true }
})
</script>

<template>
  <InputForm class="bg-background rounded p-2" :placeholder="translations.newTaskList" :submit-handler="createList" :set-busy="setBusy" />
  <div v-for="list in lists" v-bind:key="list.id" @click="setCurrentList(list)" class="flex flex-row items-center bg-background rounded p-2 gap-2 mt-2 hover:bg-accent hover:text-background hover:cursor-pointer active:bg-foreground transition-colors">
    <p class="flex-grow">{{ list.title }}</p>
    <ActionButton icon="goto" />
  </div>
</template>
