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
  <p :title="session.info.webId" class="pr-4 border-r border-gray-400">{{ webId?.name || translations.webIdNameFallback }}</p>
  <LanguageSelector class="mx-4 bg-transparent" />
  <a :href="webId?.id.href" class="pl-4 border-l border-gray-400 hover:text-accent transition-colors duration-300">{{ translations.webId }}</a>
  <a :href="webId?.oidcIssuer" class="ml-4 hover:text-accent transition-colors duration-300">{{ translations.oidcIssuer }}</a>
  <a @click="logout" class="ml-4 hover:text-accent transition-colors duration-300 cursor-pointer">{{ translations.logout }}</a>
</template>
