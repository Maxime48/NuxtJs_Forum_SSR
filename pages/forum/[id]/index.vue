<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="subjects"
        class="elevation-1"
        item-key="id"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-btn :to="'/forum/'+useRoute().params.id+'/' + item.id">
              {{ item.title }}
            </v-btn>
          </td>
          <td>{{ item.updatedAt.toLocaleString() }}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSubjectStore } from '~/stores/subjectStore'
import type { Subject } from "@prisma/client";

export default defineComponent({
  setup() {
    const route = useRoute()
    const subjectStore = useSubjectStore()
    const subjects = ref<Subject[]>([] as Subject[])

    const headers = [
      { text: 'Title', value: 'title' },
      { text: 'Date', value: 'date' }
    ]

    onMounted(async () => {
      const id = route.params.id
      await subjectStore.getSubjectsByForumId(Number(id))
      subjects.value = subjectStore.subjects
    })

    return { subjects, headers }
  }
})
</script>