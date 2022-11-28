<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type IWebID, getWebId, logout, session, translations, error } from '../logic'

import LanguageSelector from './LanguageSelector.vue'
import ActionButton from './ActionButton.vue'
import GitHubIcon from './GitHubIcon.vue'

defineProps({
  refresh: { type: Function, required: true }
})

const webId: Ref<IWebID | undefined> = ref()

getWebId()
  .then((value: IWebID) => { webId.value = value })
  .catch((reason) => error(reason))
</script>

<template>
  <p :title="session.info.webId" class="mr-4">{{ webId?.name || translations.webIdNameFallback }}</p>
  <LanguageSelector class="bg-transparent" />
  <ActionButton icon="refresh" @click="(e) => refresh()" :title="translations.refreshLists" class="mr-4" />
  <a href="https://github.com/SolidLabResearch/solid-todo-app-vue" :title="translations.viewSource"><GitHubIcon class="w-5 h-5 mr-4 hover:text-highlight active:text-foreground transition-colors" /></a>
  <a @click="logout" class="bg-accent hover:bg-highlight active:bg-foreground text-background rounded py-1 px-2 lowercase transition-colors duration-300 cursor-pointer">{{ translations.logout }}</a>
</template>
