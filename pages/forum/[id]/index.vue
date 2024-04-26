<template>
  <div>
    <v-btn color="primary" dark @click="dialog = true">Add Subject</v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">New Subject</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
                v-model="newSubject.title"
                label="Subject title"
                required
            ></v-text-field>
            <v-textarea
                v-model="newSubject.firstMessage"
                label="First message content"
                required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" @click="addSubject">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
        :headers="headers"
        :items="subjects"
        class="elevation-1"
        item-key="id"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td>
            <v-btn :to="'/forum/'+useRoute().params.id+'/view/' + item.id">
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
import { onMounted, ref } from 'vue'
import { useSubjectStore } from '~/stores/subjectStore'
import { useMessageStore } from '~/stores/messageStore'
import { useAuthStore } from '~/stores/authStore'
import type { Subject } from "@prisma/client";

export default {
  setup() {
    const subjectStore = useSubjectStore()
    const messageStore = useMessageStore()
    const authStore = useAuthStore()
    const subjects = ref<Subject[]>([] as Subject[])
    const dialog = ref(false)
    const valid = ref(false)
    const newSubject = ref({ title: '', firstMessage: '' })

    const headers = [
      { text: 'Title', value: 'title' },
      { text: 'Date', value: 'date' }
    ]

    const fetchSubjects = async () => {
      const id = useRoute().params.id
      await subjectStore.getSubjectsByForumId(Number(id))
      subjects.value = subjectStore.subjects
    }

    const addSubject = async () => {
      if (valid.value) {
        const subject = await subjectStore.addSubject({ title: newSubject.value.title, forumId: Number(useRoute().params.id) })
        await messageStore.addMessage({ content: newSubject.value.firstMessage, subjectId: subject.id, userId: authStore.user?.id })
        newSubject.value.title = ''
        newSubject.value.firstMessage = ''
        dialog.value = false
      }
    }

    onMounted(fetchSubjects)

    return { subjects, fetchSubjects, headers, dialog, valid, newSubject, addSubject }
  }
}
</script>