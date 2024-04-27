<template>
  <div>
    <v-btn v-if="useAuthStore().user!==null" color="primary" dark @click="dialog = true">Add Subject</v-btn>

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
      <template v-slot:item="{ item, index }">
        <tr>
          <td>
            <v-btn :to="'/forum/'+useRoute().params.id+'/view/' + item.id">
              {{ item.title }}
            </v-btn>
          </td>
          <td>{{ item.firstMessage.user.name }}</td>
          <td>{{ timeAgo(item.updatedAt) }}</td>
          <td>
            {{ item.lastMessage.user.name }} -
            {{ timeAgo(item.lastMessage.createdAt) }}
          </td>
          <td v-if="useAuthStore()?.user?.Admin">
            <v-icon small @click="toggleItem(index)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </td>
        </tr>
        <tr v-if="menu[index] && useAuthStore()?.user?.Admin" :key="`details-${index}`">
          <td colspan="4">
            <v-card v-model="menu[index]" multiple class="v-card--outlined">
              <v-card-title>
                Edit Subject
              </v-card-title>
              <v-card-text>
                <v-text-field label="Title" v-model="item.title"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" @click="editItem(item, index)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSubjectStore } from '~/stores/subjectStore'
import { useMessageStore } from '~/stores/messageStore'
import { useAuthStore } from '~/stores/authStore'
import type {SubjectWithFirstAndLastMessage} from "~/server/types";

export default {
  setup() {
    const subjectStore = useSubjectStore()
    const messageStore = useMessageStore()
    const authStore = useAuthStore()
    const subjects = ref<SubjectWithFirstAndLastMessage[]>([] as SubjectWithFirstAndLastMessage[])
    const dialog = ref(false)
    const valid = ref(false)
    const newSubject = ref({ title: '', firstMessage: '' })
    const menu = ref<boolean[]>([])
    const ws = ref<WebSocket>()

    const headers = [
      { title: 'Title', value: 'title' },
      { title: 'Author', value: 'firstMessage.user.name' },
      { title: 'Date', value: 'updatedAt' },
      { title: 'Last Messsage', value: 'lastMessage.createdAt' }
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
        ws.value?.send(JSON.stringify({ type: 'newSubject', forumId: subject.forumId }));
        await fetchSubjects()
      }
    }

    const toggleItem = (index: number) => {
      menu.value[index] = !menu.value[index] // Toggle le menu
    }

    const editItem = async (item: SubjectWithFirstAndLastMessage, index: number) => {
      try {
        await subjectStore.updateSubject(item.id, item.title)
        toggleItem(index) // Ferme le menu après la mise à jour
        ws.value?.send(JSON.stringify({ type: 'newSubject', forumId: item.forumId }));
      } catch (error) {
        console.error(error)
      }
    }

    const deleteItem = async (item: SubjectWithFirstAndLastMessage) => {
      try {
        await subjectStore.deleteSubject(item.id)
        ws.value?.send(JSON.stringify({ type: 'newSubject', forumId: item.forumId }));
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(async () => {
      const isSecure = location.protocol === "https:";
      const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
      ws.value = new WebSocket(url);
      ws.value.onopen = () => {
        ws.value?.send(JSON.stringify({type: 'page', page: 'forum'}));
      };
      ws.value.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if ((data.type === 'newSubject' && Number(data.forumId) === Number(useRoute().params.id)) || data.type === 'newMessage' && subjects.value.find(subject => Number(subject.id) === Number(data.subjectId))) {
          await fetchSubjects();
        }
      };
      await fetchSubjects()
    })

    onBeforeUnmount(() => {
      if (ws.value) {
        ws.value.close();
      }
    });

    const timeAgo = (date: any) => {
      const now = new Date();
      date = new Date(date)
      const secondsPast = (now.getTime() - date.getTime()) / 1000;

      if(secondsPast < 60){
        return parseInt(String(secondsPast)) + ' seconds ago';
      }
      if(secondsPast < 3600){
        return parseInt(String(secondsPast / 60)) + ' minutes ago';
      }
      if(secondsPast <= 86400){
        return parseInt(String(secondsPast / 3600)) + ' hours ago';
      }
      if(secondsPast > 86400){
        const day = date.getDate();
        const month = date.toDateString().match(/ [a-zA-Z]*/)![0].replace(" ","");
        const year = date.getFullYear() == now.getFullYear() ? "" :  " "+date.getFullYear();
        return day + " " + month + year;
      }
    }

    return { timeAgo, subjects, fetchSubjects, headers, dialog, valid, newSubject, addSubject, menu, toggleItem, editItem, deleteItem }
  }
}
</script>