<script setup lang="ts">
import { type PropType, ref, Ref } from 'vue'
import { type ITask, type ITaskList, taskStatusValues, saveTask, confirmation, error, translations } from '../logic'
import SubmitButton from './SubmitButton.vue'

const props = defineProps({
  task: { type: Object as PropType<ITask>, required: true },
  list: { type: Object as PropType<ITaskList>, required: true },
  removeHandler: { type: Function, required: true }
})

const showInfo: Ref<boolean> = ref(false)

function toggleInfo(event: Event): void {
  event.preventDefault()
  showInfo.value = !showInfo.value
}

function save(): void {
  saveTask(props.list, props.task)
    .then(() => confirmation(`${translations.value.updateSuccess}: <${props.task.id}>`))
    .catch(error)
}
</script>

<template>
  <div class="flex flex-col" :title="task.id">
    <form class="flex flex-row">
      <input type="text" v-model="task.name" class="flex-grow" :placeholder="translations.name" />
      <SubmitButton icon="save" @click="save" />
      <SubmitButton icon="remove" @click="removeHandler(task)" />
      <SubmitButton icon="toggle" @click="toggleInfo" :toggle="showInfo" />
    </form>
    <div v-if="showInfo" class="grid grid-cols-5 gap-1">
      <label for="{{ task.id }}#id">id</label>
      <p v-if="task.id" class="col-span-4 text-gray-400" id="{{ task.id }}#id">{{ task.id }}</p>
      <label v-if="task.creator" for="{{ task.id }}#creator">{{ translations.creator }}</label>
      <a v-if="task.creator" class="col-span-4 text-gray-400" id="{{ task.id }}#creator" :href="task.creator">{{ task.creator }}</a>
      <label v-if="task.created" for="{{ task.id }}#created">{{ translations.created }}</label>
      <p v-if="task.created" class="col-span-4 text-gray-400" id="{{ task.id }}#created">{{ task.created }}</p>
      <label v-if="task.modified" for="{{ task.id }}#modified">{{ translations.modified }}</label>
      <p v-if="task.modified" class="col-span-4 text-gray-400" id="{{ task.id }}#modified">{{ task.modified }}</p>
      <label for="{{ task.id }}#status">{{ translations.status }}</label>
      <select class="col-span-4" id="{{ task.id }}#status" v-model="task.status">
        <option v-for="status in taskStatusValues" v-bind:key="status" :value="status" :selected="status === task.status">{{ translations[status.replace('ActionStatus', '').split('/').at(-1)!.toLowerCase()] }}</option>
      </select>
      <label for="{{ task.id }}#description">{{ translations.description }}</label>
      <textarea class="col-span-4" id="{{ task.id }}#description" v-model="task.description" :placeholder="translations.description"></textarea>
    </div>
  </div>
</template>
