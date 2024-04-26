<template>
  <v-container>
    <v-card>
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="changePassword">
          <v-text-field v-model="currentPassword" :rules="passwordRules" label="Current Password" type="password" required></v-text-field>
          <v-text-field v-model="newPassword" :rules="passwordRules" label="New Password" type="password" required></v-text-field>
          <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules" label="Confirm New Password" type="password" required></v-text-field>
          <v-btn type="submit" :disabled="!valid">Change Password</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore} from "~/stores/userStore";
import {useAuthStore} from "~/stores/authStore";
import {useRouter} from "vue-router";

const userStore = useUserStore()

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const router = useRouter()
const valid = ref(false)

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
]
const confirmPasswordRules = [
  (v: string) => !!v || 'Confirmation is required',
  (v: string) => v === newPassword.value || 'Passwords must match',
]

const changePassword = async () => {
  if (valid.value) {
    await userStore.changePassword({
      email: useAuthStore().user?.email,
      password: currentPassword.value,
      newPassword: newPassword.value
    })

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    router.push('/')
  }
}
</script>