<script setup lang="ts">
import { useAuthStore } from '~/stores/authStore'

const authStore = useAuthStore()
const sidebar = ref(false);

</script>

<template>
  <v-app-bar app>

    <v-app-bar-nav-icon class="hidden-sm-and-up" @click="sidebar = !sidebar" />
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none">
        Mon Forum
      </router-link>
    </v-app-bar-title>
    <v-spacer />

    <div v-if="useRoute().path.startsWith('/admin')">
      <v-btn :to="'/admin/forum'" class="hidden-xs-only">
        <v-icon left>mdi-forum</v-icon>
        Forum
      </v-btn>
      <v-btn :to="'/admin/access'" class="hidden-xs-only">
        <v-icon left>mdi-account-key</v-icon>
        Access
      </v-btn>
    </div>
    <div v-else>
      <v-btn v-if="useAuthStore().user?.Admin" :to="'/admin/'" class="hidden-xs-only">
        <v-icon left>mdi-security</v-icon>
        Admin
      </v-btn>
    </div>

    <v-btn :to="'/'" class="hidden-xs-only">
      <v-icon left>mdi-home</v-icon>
      Accueil
    </v-btn>
    <v-btn v-if="authStore.user" :to="'/profile'" class="hidden-xs-only">
      <v-icon left>mdi-account</v-icon>
      {{ authStore.user.name }}
    </v-btn>
    <v-btn v-if="authStore.user" :to="'/'" class="hidden-xs-only" @click="authStore.logout()">
      <v-icon left>mdi-logout</v-icon>
      Logout
    </v-btn>
    <div v-else >
      <v-btn :to="'/auth/login'" class="hidden-xs-only">
        <v-icon left>mdi-login</v-icon>
        Login
      </v-btn>
      <v-btn :to="'/auth/register'" class="hidden-xs-only">
        <v-icon left>mdi-account-circle</v-icon>
        Register
      </v-btn>
    </div>

  </v-app-bar>
</template>