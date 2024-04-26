<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="forums"
        class="elevation-1"
        item-key="id"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-btn :to="'/forum/' + item.id">
              {{ item.title }}
            </v-btn>
          </td>
          <td>{{ item.description }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useForumStore } from '~/stores/forumStore'
import type { Forum } from "@prisma/client";

export default defineComponent({
  setup() {
    const forumStore = useForumStore()
    const forums = ref<Forum[]>([])

    const headers = [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' }
    ]

    onMounted(async () => {
      await forumStore.getForums()
      forums.value = forumStore.forums
    })

    return { forums, headers }
  }
})
</script>