<script setup lang="ts">
import { type PropType, ref, type Ref } from 'vue'
import { type ITask, translations } from '../logic'

import ActionButton from './ActionButton.vue'
import MetadataContainer from './MetadataContainer.vue'

const props = defineProps({
  entry: { type: Object as PropType<ITask>, required: true },
  removeEntry: { type: Function, required: true },
  saveEntry: { type: Function, required: true }
})

const showInfo: Ref<boolean> = ref(false)
const done: Ref<boolean> = ref(props.entry.status === 'true')

function toggleDone(): void {
  props.entry.status = done.value ? 'true' : 'false'
  props.saveEntry(props.entry)
}

function toggleInfo(event: Event): void {
  event.preventDefault()
  showInfo.value = !showInfo.value
}
</script>

<template>
  <div class="flex flex-row" :title="entry.id">
    <input type="checkbox" v-model="done" @change="toggleDone" class="m-3 mb-auto" />
    <div class="flex flex-col flex-grow bg-background rounded p-2 gap-2">
      <form class="flex flex-row">
        <input type="text" v-model="entry.title" class="flex-grow bg-transparent" :class="done ? 'line-through' : ''" :placeholder="translations.name" />
        <ActionButton icon="save" @click="saveEntry(entry)" />
        <ActionButton icon="remove" @click="removeEntry(entry)" />
        <ActionButton icon="toggle" @click="toggleInfo" :toggle="showInfo" />
      </form>
      <MetadataContainer v-if="showInfo" :entry="entry" />
    </div>
  </div>
</template>
