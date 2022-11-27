<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { type IWebID } from '../logic/model'
import { getWebID } from '../logic/queries'
import { logout, session } from '../logic/session'
import { translations } from '../logic/language'
import { error } from '../logic/notifications'

import LanguageSelector from './LanguageSelector.vue'

const webId: Ref<IWebID | undefined> = ref()

getWebID()
  .then((value: IWebID) => { webId.value = value })
  .catch((reason) => error(reason))
</script>

<template>
  <p :title="session.info.webId" class="mr-4">{{ webId?.name || translations.webIdNameFallback }}</p>
  <LanguageSelector class="bg-transparent mr-4" />
  <a @click="logout" class="bg-accent hover:bg-highlight active:bg-foreground text-background rounded py-1 px-2 lowercase transition-colors duration-300 cursor-pointer">{{ translations.logout }}</a>
</template>

<style scoped>
.dropdown:hover > div {
  display: block;
}
</style>
