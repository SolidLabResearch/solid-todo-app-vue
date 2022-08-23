<script setup lang="ts">
import { type PropType, ref, Ref } from 'vue'
import { type ITask } from '../logic/model'

defineProps({ task: { type: Object as PropType<ITask>, required: true } })

const showInfo: Ref<boolean> = ref(false)

function toggleInfo(event: Event): void {
  event.preventDefault()
  showInfo.value = !showInfo.value
}
</script>

<template>
  <div class="flex flex-col bg-white py-3 px-6 mb-3 shadow">
    <div class="flex flex-row">
      <input type="text" v-model="task.title" class="text-royallavender text-lg flex-grow mr-2" />
      <button class="transition-colors duration-300 hover:text-royallavender lowercase ml-auto"
        v-on:click="toggleInfo">Details</button>
      <button class="transition-colors duration-300 hover:text-royallavender lowercase ml-4"
        v-on:click="task.save">Save</button>
      <button class="transition-colors duration-300 hover:text-royallavender lowercase ml-4"
        v-on:click="task.delete">Delete</button>
    </div>
    <div v-if="showInfo" class="grid grid-cols-5 gap-2 border-t border-gray-200 pt-2 mt-2">
      <label for="{{ task.id}}#id" class="text-gray-600">id</label>
      <p class="col-span-4 text-gray-400" id="{{ task.id }}#id">{{ task.id }}</p>
      <label for="{{ task.id}}#description" class="text-gray-600">description</label>
      <textarea class="col-span-4" id="{{ task.id }}#description" v-model="task.description"></textarea>
    </div>
  </div>
</template>
