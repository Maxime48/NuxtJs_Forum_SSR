<template>
  <v-card class="mx-auto" outlined>
    <v-card-title>Create New Admin</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
        <v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password" required></v-text-field>
        <v-btn :disabled="!valid" @click="createAdmin">Create Admin</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore} from "~/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const valid = ref(false)
const nameRules = [
  (v: string) => !!v || 'Name is required',
  (v: string) => (v && v.length <= 10) || 'Name must be less than 10 characters',
]
const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]
const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length >= 8) || 'Password must be at least 8 characters',
]

const createAdmin = async () => {
  if (valid.value) {
    await userStore.createAdmin({ name: name.value, email: email.value, password: password.value })
    name.value = ''
    email.value = ''
    password.value = ''
  }
}
</script>