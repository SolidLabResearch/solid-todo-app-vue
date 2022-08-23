<script setup lang="ts">
import { ref, Ref } from 'vue'
import { findOidcIssuer, findName } from '../logic/query'
import { login, logout, session } from '../logic/session'

const webId: Ref<string> = ref('http://localhost:3000/profile/card#me')
const name: Ref<string> = ref('[no name]')

function toggleLogin(event: Event): void { // eslint
  event.preventDefault()
  if (session.info.isLoggedIn) {
    logout()
  } else {
    findOidcIssuer(new URL(webId.value)).then((issuer: URL) => login(issuer))
  }
}

if (session.info.isLoggedIn) {
  findName(new URL(session.info.webId as string)).then((discoveredName: string) => { name.value = discoveredName })
}
</script>

<template>
  <input v-if="!session.info.isLoggedIn" type="text" placeholder="WebID" v-model="webId"
    class="w-1/3 border-b border-gray-200 py-1 px-3" />
  <p v-else :title="session.info.webId" class="text-gray-600">{{ name }}</p>
  <button v-on:click="toggleLogin"
    class="ml-4 mt-1 pb-1 border-b-2 border-transparent transition-colors duration-300 hover:border-royallavender">{{
        session.info.isLoggedIn ? 'logout' :
          'login'
    }}</button>
</template>
