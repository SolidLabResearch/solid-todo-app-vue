<script setup lang="ts">
import { PropType } from 'vue'
import { type ITask, type ITaskList, translations } from '../logic'

defineProps({
  entry: { type: Object as PropType<ITask | ITaskList>, required: true }
})
</script>

<template>
  <div class="grid grid-cols-5">
    <label v-if="entry.id" for="{{ list.id }}#id" class="text-sm">{{ translations.id }}</label>
    <a v-if="entry.id" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#id" :href="entry.id">{{ entry.id }}</a>
    <label v-if="entry.creator" for="{{ list.id }}#creator" class="text-sm">{{ translations.creator }}</label>
    <a v-if="entry.creator" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#creator" :href="entry.creator">{{ entry.creator }}</a>
    <label v-if="entry.created" for="{{ list.id }}#created" class="text-sm">{{ translations.created }}</label>
    <p v-if="entry.created" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#created">{{ entry.created }}</p>
    <label v-if="entry.modified" for="{{ list.id }}#modified" class="text-sm">{{ translations.modified }}</label>
    <p v-if="entry.modified" class="col-span-4 text-muffled text-sm" id="{{ list.id }}#modified">{{ entry.modified }}</p>
  </div>
</template>
