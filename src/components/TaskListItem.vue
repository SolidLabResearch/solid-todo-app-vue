<script setup lang="ts">
import { type PropType, ref, type Ref } from 'vue'
import { type ITask } from '../logic/model'
import { taskStatusValues } from '../logic/utils'
import { translations } from '../logic/language'

import SubmitButton from './SubmitButton.vue'

defineProps({
  task: { type: Object as PropType<ITask>, required: true },
  removeHandler: { type: Function, required: true },
  saveHandler: { type: Function, required: true }
})

const showInfo: Ref<boolean> = ref(false)

function toggleInfo(event: Event): void {
  event.preventDefault()
  showInfo.value = !showInfo.value
}
</script>

<template>
  <div class="flex flex-col" :title="task.id">
    <form class="flex flex-row">
      <input type="text" v-model="task.title" class="flex-grow font-bold" :placeholder="translations.name" />
      <SubmitButton icon="save" @click="saveHandler(task)" v-if="saveHandler != null" />
      <SubmitButton icon="remove" @click="removeHandler(task)" v-if="saveHandler != null" />
      <SubmitButton icon="toggle" @click="toggleInfo" :toggle="showInfo" />
    </form>
    <div v-if="showInfo" class="grid grid-cols-5 gap-1 my-1">
      <label for="{{ task.id }}#id" class="text-sm">id</label>
      <a v-if="task.id" class="col-span-4 text-muffled text-sm" id="{{ task.id }}#id" :href="task.id">{{ task.id }}</a>
      <label v-if="task.creator" for="{{ task.id }}#creator" class="text-sm">{{ translations.creator }}</label>
      <a v-if="task.creator" class="col-span-4 text-muffled text-sm" id="{{ task.id }}#creator" :href="task.creator">{{ task.creator }}</a>
      <label v-if="task.created" for="{{ task.id }}#created" class="text-sm">{{ translations.created }}</label>
      <p v-if="task.created" class="col-span-4 text-muffled text-sm" id="{{ task.id }}#created">{{ task.created }}</p>
      <label v-if="task.modified" for="{{ task.id }}#modified" class="text-sm">{{ translations.modified }}</label>
      <p v-if="task.modified" class="col-span-4 text-muffled text-sm" id="{{ task.id }}#modified">{{ task.modified }}</p>
      <label for="{{ task.id }}#status" class="text-sm">{{ translations.status }}</label>
      <select class="col-span-4 text-sm" id="{{ task.id }}#status" v-model="task.status">
        <option v-for="status in taskStatusValues" v-bind:key="status" :value="status" :selected="status === task.status">{{ translations[status] }}</option>
      </select>
      <label for="{{ task.id }}#description" class="text-sm">{{ translations.description }}</label>
      <textarea class="col-span-4 text-sm" id="{{ task.id }}#description" v-model="task.description" :placeholder="translations.description"></textarea>
    </div>
  </div>
</template>
