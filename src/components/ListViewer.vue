<script setup lang="ts">
import { type Ref, type PropType, ref } from 'vue'
import { type ITask, type ITaskList, getTasks, createTask, removeTask, saveTask, confirmation, error, translations } from '../logic'

import ActionButton from './ActionButton.vue'
import InputForm from './InputForm.vue'
import ListEntry from './ListEntry.vue'
import MetadataContainer from './MetadataContainer.vue'

const props = defineProps({
  list: { type: Object as PropType<ITaskList>, required: true },
  setBusy: { type: Function, required: true },
  setCurrentList: { type: Function, required: true },
  removeList: { type: Function, required: true },
  saveList: { type: Function, required: true }
})

const entries: Ref<ITask[]> = ref([])

function loadEntries(): void {
  props.setBusy(true)
  getTasks(props.list).then((result) => {
    entries.value = result
    props.setBusy(false)
  }).catch(error)
}

function saveEntry(task: ITask): void {
  props.setBusy(true)
  saveTask(props.list, task).then(() => {
    props.setBusy(false)
    confirmation(`${translations.value.updateSuccess}: ${task.title}`)
  }).catch(error)
}

function createEntry(title: string): void {
  props.setBusy(true)
  createTask(props.list, title).then((task) => {
    entries.value.push(task)
    entries.value.sort((a, b) => a.title.localeCompare(b.title))
    props.setBusy(false)
    confirmation(`${translations.value.createSuccess}: ${task.title}`)
  }).catch(error)
}

function removeEntry(task: ITask): void {
  props.setBusy(true)
  removeTask(task).then(() => {
    entries.value = entries.value.filter((t) => t.id !== task.id)
    props.setBusy(false)
    confirmation(`${translations.value.deleteSuccess}: ${task.title}`)
  }).catch(error)
}

loadEntries()
</script>

<template>
  <div class="flex flex-row" :title="list.id">
    <ActionButton icon="back" @click="setCurrentList(undefined)" class="mb-auto p-2 ml-0" />
    <div class="flex flex-col flex-grow gap-2">
      <form class="flex flex-row flex-grow p-2">
        <input type="text" v-model="list.title" class="flex-grow text-lg bg-transparent" :placeholder="translations.name" />
        <ActionButton icon="save" @click="saveList(list)" />
        <ActionButton icon="remove" @click="removeList(list)" />
      </form>
      <MetadataContainer :entry="list" class="bg-background rounded p-2 gap-2" />
      <InputForm :submit-handler="createEntry" :set-busy="setBusy" :placeholder="translations.newTask" class="p-2 bg-background rounded" />
      <ListEntry v-for="entry in entries" :entry="entry" v-bind:key="entry.id" :remove-entry="removeEntry" :save-entry="saveEntry" />
    </div>
</div>
</template>
