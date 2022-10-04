<script setup lang="ts">
import { IWebID } from '../logic/model'
import { getWebID } from '../logic/query'
import { logout, session } from '../logic/session'

const webId: IWebID = await getWebID()
</script>

<template>
  <p :title="session.info.webId" class="pr-4 border-r border-gray-400">{{ webId.givenName }} {{ webId.familyName }}</p>
  <a :href="webId.id" class="ml-4 hover:text-royallavender transition-colors duration-300">WebID</a>
  <a :href="webId.oidcIssuer" class="ml-4 hover:text-royallavender transition-colors duration-300">OIDC issuer</a>
  <a v-on:click="logout" class="ml-4 hover:text-royallavender transition-colors duration-300 cursor-pointer">Logout</a>
</template>
