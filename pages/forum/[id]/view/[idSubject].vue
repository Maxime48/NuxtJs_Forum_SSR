<template>
  <div>
    <h1>Subject " {{ subject?.title }} "</h1>
    <v-data-table
        :headers="headers"
        :items="messages"
        class="elevation-1"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>
            <v-card>
              <v-card-title>
                {{ item?.user?.name }} - {{ timeAgo(item.createdAt) }}
              </v-card-title>
              <v-card-text>
                {{ item.content }}
              </v-card-text>
              <v-card-actions v-if="useAuthStore().user?.Admin || useAuthStore().user?.id === item.userId">
                <v-icon small @click="toggleItem(index)" :disabled="isOlderThanFiveMinutes(item.createdAt)">
                  mdi-pencil
                </v-icon>
                <v-icon small v-if="useAuthStore().user?.Admin" @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
                <small>{{ getRemainingTime(item.createdAt) }}</small>
              </v-card-actions>
            </v-card>
          </td>
        </tr>
        <tr v-if="menu[index] && (useAuthStore().user?.Admin || useAuthStore().user?.id === item.userId)" :key="`details-${index}`">
          <td colspan="4">
            <v-card v-model="menu[index]" multiple class="v-card--outlined">
              <v-card-title>
                Edit Message
              </v-card-title>
              <v-card-text>
                <v-text-field label="Content" v-model="item.content"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" @click="editItem(item, index)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-btn color="primary" dark @click="dialog = true">Add Message</v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">New Message</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-textarea
                v-model="newMessage.content"
                label="Message content"
                required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" @click="addMessage">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useMessageStore } from '~/stores/messageStore'
import { useSubjectStore } from '~/stores/subjectStore'
import { useAuthStore } from '~/stores/authStore'
import type { MessageWithUser } from "~/server/types";
import type {Subject} from "@prisma/client";

export default {
  setup() {
    const subjectStore = useSubjectStore()
    const messageStore = useMessageStore()
    const messages = ref<MessageWithUser[]>([] as MessageWithUser[])
    const dialog = ref(false)
    const valid = ref(false)
    const newMessage = ref({ content: '' })
    const menu = ref<boolean[]>([])
    const subject = ref<Subject | null>(null)
    const ws = ref<WebSocket>()

    const headers = [
      { title: '', value: 'content' }
    ]

    const fetchMessages = async () => {
      await messageStore.fetchMessages(Number(useRoute().params.idSubject))
      messages.value = messageStore.messages.map(message => ({
        ...message,
        remainingTime: getRemainingTime(message.createdAt)
      }))
      setInterval(updateRemainingTime, 1000)
    }

    const fetchSubject = async () => {
      const id = useRoute().params.idSubject
      subject.value = await subjectStore.getSubjectById(Number(id))
    }

    const addMessage = async () => {
      if (valid.value) {
        await messageStore.addMessage({ content: newMessage.value.content, subjectId: Number(useRoute().params.idSubject), userId: useAuthStore().user?.id })
        newMessage.value.content = ''
        dialog.value = false
        ws.value?.send(JSON.stringify({ type: 'newMessage', subjectId: Number(useRoute().params.idSubject) }));
        await fetchMessages()
      }
    }

    const toggleItem = (index: number) => {
      menu.value[index] = !menu.value[index] // Toggle le menu
    }

    const editItem = async (item: MessageWithUser, index: number) => {
      try {
        await messageStore.updateMessage(item.id, item.content)
        toggleItem(index) // Ferme le menu après la mise à jour
        ws.value?.send(JSON.stringify({ type: 'newMessage', subjectId: Number(useRoute().params.idSubject) }));
      } catch (error) {
        console.error(error)
      }
    }

    const deleteItem = async (item: MessageWithUser) => {
      try {
        await messageStore.deleteMessage(item.id)
        ws.value?.send(JSON.stringify({ type: 'newMessage', subjectId: Number(useRoute().params.idSubject) }));
      } catch (error) {
        console.error(error)
      }
    }

    const isOlderThanFiveMinutes = (date: Date) => {
      if (useAuthStore().user?.Admin) {
        return false;
      }
      const diff = new Date().getTime() - new Date(date).getTime();
      return diff > 5 * 60 * 1000; // 5 minutes in milliseconds
    }

    const updateRemainingTime = () => {
      messages.value = messages.value.map(message => ({
        ...message,
        remainingTime: getRemainingTime(message.createdAt)
      }))
    }

    const getRemainingTime = (date: Date) => {
      const diff = new Date().getTime() - new Date(date).getTime();
      const remainingSeconds = Math.max(0, Math.ceil((5 * 60 * 1000 - diff) / 1000));
      return remainingSeconds > 0 ? remainingSeconds : "Edit Timed Out";
    }


    const getRemainingTimePercentage = (date: Date) => {
      const diff = new Date().getTime() - new Date(date).getTime();
      const remainingPercentage = Math.max(0, 100 - (diff / (5 * 60 * 1000)) * 100);
      return remainingPercentage;
    }

    onMounted(async () => {
      const isSecure = location.protocol === "https:";
      const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
      ws.value = new WebSocket(url);
      ws.value.onopen = () => {
        ws.value?.send(JSON.stringify({ type: 'page', page: 'subject' }));
      };
      ws.value.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'newMessage' && Number(data.subjectId) === Number(useRoute().params.idSubject)) {
          await fetchMessages();
        }
      };
      await fetchSubject()
      await fetchMessages()
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

    return { timeAgo, subject, messages, fetchMessages, headers, dialog, valid, newMessage, addMessage, menu, toggleItem, editItem, deleteItem, isOlderThanFiveMinutes, getRemainingTime, getRemainingTimePercentage }
  }
}
</script>