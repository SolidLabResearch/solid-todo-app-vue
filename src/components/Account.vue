<script setup lang="ts">
import { ref, Ref } from 'vue'
import { findOidcIssuer } from '../logic/query'
import { login, logout, session } from '../logic/session'

const webId: Ref<string> = ref('http://localhost:3000/profile/card#me')

function handleLogin(event: Event): void {
  event.preventDefault()
  findOidcIssuer(new URL(webId.value)).then((issuer: URL) => login(issuer))
}

function handleLogout(event: Event): void {
  event.preventDefault()
  logout()
}
</script>

<template>

  <input v-if="!session.info.isLoggedIn" type="text" v-model="webId" />

  <button v-if="!session.info.isLoggedIn" v-on:click="handleLogin">Login</button>
  <button v-else v-on:click="handleLogout">Logout</button>

</template>

<style scoped>
input {
  margin-right: 1rem;
  width: 30%;
}

#identityProviderSelection {
  margin-right: 1rem;
}
</style>
