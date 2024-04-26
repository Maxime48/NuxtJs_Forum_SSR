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
          <td>{{ item._count.subjects }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useForumStore } from '~/stores/forumStore'
import type {ForumWithSubjectCount} from "~/server/types";

export default defineComponent({
  setup() {
    const forumStore = useForumStore()
    const forums = ref<ForumWithSubjectCount[]>([])

    const headers = [
      { title: 'Title', value: 'title' },
      { title: 'Description', value: 'description' },
      { title: 'Subjects', value: '_count.subjects' }
    ]

    onMounted(async () => {
      await forumStore.getForums()
      forums.value = forumStore.forums
    })

    return { forums, headers }
  }
})
</script>