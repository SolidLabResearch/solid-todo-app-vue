<script setup lang="ts">
import { ref, Ref } from 'vue'
import { login, getWebID, defaultWebId, error, translations } from '../logic'
import LanguageSelector from './LanguageSelector.vue'

const webIdUrl: Ref<string> = ref(defaultWebId)

function loginHandler(): void {
  getWebID(webIdUrl.value)
    .then((webId) => login(webId.oidcIssuer, translations.value.appName))
    .catch((reason: any) => error(reason))
}
</script>

<template>
  <header class="flex flex-row fixed right-0 top-0">
    <LanguageSelector />
  </header>
  <main class="bg-white flex flex-col m-auto w-1/5 p-8 gap-y-4">
    <img src="/solid.svg" class="w-14 h-auto mx-auto" />
    <h2 class="uppercase text-lg text-center">{{ translations.appName }}</h2>
    <input type="text" :placeholder="translations.webId" v-model="webIdUrl" class="py-1 px-2 border border-gray-400" />
    <button @click="loginHandler" class="py-1 px-2 text-white bg-royallavender hover:bg-black">{{ translations.login }}</button>
  </main>
</template>
