<template>
  <v-form @submit.prevent="login">
    <v-text-field v-model="credentials.email" label="Email" required></v-text-field>
    <v-text-field v-model="credentials.password" label="Password" type="password" required></v-text-field>
    <v-btn type="submit">Login</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const credentials = ref({ email: '', password: '' })

    const login = () => {
      authStore.login(credentials.value)
    }

    return { credentials, login }
  }
})
</script>