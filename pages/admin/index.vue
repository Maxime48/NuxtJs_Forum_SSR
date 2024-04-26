<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/authStore'
import { useForumStore } from '~/stores/forumStore'
import { useSubjectStore } from '~/stores/subjectStore'
import { useMessageStore } from '~/stores/messageStore'

const userStore = useAuthStore()
const forumStore = useForumStore()
const subjectStore = useSubjectStore()
const messageStore = useMessageStore()

const userCount = ref(0)
const forumCount = ref(0)
const subjectCount = ref(0)
const messageCount = ref(0)

onMounted(async () => {
  userCount.value = await userStore.countUsers()
  forumCount.value = await forumStore.countForums()
  subjectCount.value = await subjectStore.countSubjects()
  messageCount.value = await messageStore.countMessages()
})
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="primary" dark>
          <v-card-title class="headline">Utilisateurs</v-card-title>
          <v-card-text class="display-1">{{ userCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="secondary" dark>
          <v-card-title class="headline">Forums</v-card-title>
          <v-card-text class="display-1">{{ forumCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="accent" dark>
          <v-card-title class="headline">Sujets</v-card-title>
          <v-card-text class="display-1">{{ subjectCount }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="mx-auto" color="info" dark>
          <v-card-title class="headline">Messages</v-card-title>
          <v-card-text class="display-1">{{ messageCount }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>