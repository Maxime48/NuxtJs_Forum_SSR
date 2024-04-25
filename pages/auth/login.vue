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
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const credentials = ref({ email: '', password: '' })

    const login = () => {
      authStore.login(credentials.value)
      router.push('/')
    }

    return { credentials, login }
  }
})
</script>