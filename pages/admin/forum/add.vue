<template>
  <v-form @submit.prevent="addForum">
    <v-text-field v-model="forum.title" label="Title" required></v-text-field>
    <v-text-field v-model="forum.description" label="Description"></v-text-field>
    <v-btn type="submit">Add Forum</v-btn>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useForumStore } from '~/stores/forumStore'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const forumStore = useForumStore()
    const router = useRouter()
    const forum = ref({ title: '', description: '' })

    const addForum = () => {
      forumStore.addForum(forum.value)
      router.push('/admin/forum')
    }

    return { forum, addForum }
  }
})
</script>