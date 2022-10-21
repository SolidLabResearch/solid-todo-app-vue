<script setup lang="ts">
import { availableLanguages, language, setLanguage } from '../logic'

function handleLanguageChange(event: Event): void {
  const languageSelector: HTMLSelectElement = event.target as HTMLSelectElement
  setLanguage(languageSelector.value)
}
</script>

<template>
  <select @change="handleLanguageChange">
    <option v-for="availableLanguage in availableLanguages" :value="availableLanguage" :selected="availableLanguage === language" v-bind:key="availableLanguage">{{ availableLanguage }}</option>
  </select>
</template>
