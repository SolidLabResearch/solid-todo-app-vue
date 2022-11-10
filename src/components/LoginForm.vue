<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { login } from '../logic/session'
import { getWebID } from '../logic/queries'
import { defaultWebId } from '../logic/utils'
import { error } from '../logic/notifications'
import { translations } from '../logic/language'

import SolidIcon from './SolidIcon.vue'

const webIdUrl: Ref<string> = ref(defaultWebId)

function loginHandler(event: Event): void {
  event.preventDefault()
  getWebID(webIdUrl.value)
    .then((webId) => login(webId.oidcIssuer, translations.value.appName))
    .catch((reason: any) => error(reason))
}
</script>

<template>
  <form class="flex flex-col m-auto w-1/4 gap-4 py-10 px-14 bg-background shadow-md">
    <SolidIcon class="w-10 h-10 m-auto" />
    <h2 class="text-lg uppercase text-center">{{ translations.appName }}</h2>
    <input type="text" id="webid" :placeholder="translations.webId" v-model="webIdUrl" class="py-1 px-2 border-b border-foreground text-center" />
    <input type="submit" @click="loginHandler" class="py-1 px-2 text-background lowercase bg-foreground cursor-pointer hover:bg-accent" :value="translations.login" />
  </form>
</template>
