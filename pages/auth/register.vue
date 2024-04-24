<template>
  <v-form @submit.prevent="register">
    <v-text-field v-model="credentials.name" label="Name" required></v-text-field>
    <v-text-field v-model="credentials.email" label="Email" required></v-text-field>
    <v-text-field v-model="credentials.password" label="Password" type="password" required></v-text-field>
    <v-btn type="submit">Register</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '~/stores/authStore'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const credentials = ref({ name: '', email: '', password: '' })

    const register = () => {
      authStore.register(credentials.value)
    }

    return { credentials, register }
  }
})
</script>