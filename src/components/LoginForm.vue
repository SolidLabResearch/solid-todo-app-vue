<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { login, getWebId, defaultWebId, error, translations } from '../logic'

import AppIcon from './AppIcon.vue'
import LanguageSelector from './LanguageSelector.vue'

const webIdUrl: Ref<string> = ref(defaultWebId)

function loginHandler(event: Event): void {
  event.preventDefault()
  getWebId(webIdUrl.value)
    .then((webId) => login(webId.oidcIssuer, translations.value.appName))
    .catch((reason: any) => error(reason))
}
</script>

<template>
  <div class="flex flex-col m-auto w-1/4">
    <form class="flex flex-col gap-4 py-12 px-10 bg-background shadow rounded">
      <AppIcon class="w-10 h-10 m-auto" />
      <h1 class="text-xl text-center">{{ translations.appName }}</h1>
      <input type="text" id="webid" :placeholder="translations.webId" v-model="webIdUrl" class="py-1 px-2 rounded border text-center" />
      <input type="submit" @click="loginHandler" class="py-1 px-2 rounded text-background lowercase bg-accent cursor-pointer hover:bg-highlight active:bg-foreground" :value="translations.login" />
    </form>
    <LanguageSelector class="ml-auto mt-1 bg-transparent" />
  </div>
</template>
