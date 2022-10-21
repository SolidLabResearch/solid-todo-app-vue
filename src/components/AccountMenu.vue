<script setup lang="ts">
import { type IWebID, getWebID, logout, session, translations } from '../logic'
import LanguageSelector from './LanguageSelector.vue'

const webId: IWebID = await getWebID()
</script>

<template>
  <p :title="session.info.webId" class="pr-4 border-r border-gray-400">{{ webId.name || translations.webIdNameFallback }}</p>
  <LanguageSelector class="mx-4 bg-transparent" />
  <a :href="webId.id" class="pl-4 border-l border-gray-400 hover:text-royallavender transition-colors duration-300">{{ translations.webId }}</a>
  <a :href="webId.oidcIssuer" class="ml-4 hover:text-royallavender transition-colors duration-300">{{ translations.oidcIssuer }}</a>
  <a @click="logout" class="ml-4 hover:text-royallavender transition-colors duration-300 cursor-pointer">{{ translations.logout }}</a>
</template>
