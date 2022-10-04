<script setup lang="ts">
import { ref, Ref } from 'vue'
import { getWebID } from '../logic/query'
import { login } from '../logic/session'

const webId: Ref<string> = ref('http://localhost:3000/profile/card#me')

function loginHandler(event: Event): void {
  event.preventDefault()
  getWebID(webId.value).then((webIdObject) => login(webIdObject.oidcIssuer))
}
</script>

<template>
  <main class="rounded-md bg-white p-8 flex flex-col w-1/5 m-auto space-y-4">
    <img src="/solid.svg" class="w-14 h-auto mx-auto" />
    <h2 class="uppercase text-lg text-center">Solid Tasks</h2>
    <input type="text" placeholder="WebID" v-model="webId" class="py-1 px-2 border border-gray-400" />
    <button v-on:click="loginHandler" class="py-1 px-2 text-white bg-royallavender hover:bg-black">Login</button>
  </main>
</template>
