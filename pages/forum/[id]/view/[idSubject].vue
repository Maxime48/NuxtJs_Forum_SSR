<template>
  <div>
    <h1>Subject {{ $route.params.idSubject }}</h1>
    <v-data-table
        :headers="headers"
        :items="messages"
        :items-per-page="20"
        class="elevation-1"
    >
      <template v-slot:item.content="{ item }">
        <v-card>
          <v-card-title>
            {{ item?.user?.name }} - {{ item.createdAt }}
          </v-card-title>
          <v-card-text>
            {{ item.content }}
          </v-card-text>
        </v-card>
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
import { onMounted, ref } from 'vue'
import { useMessageStore } from '~/stores/messageStore'
import MessageC from '~/components/Message.vue'
import type {MessageWithUser} from "~/server/types";

export default {
  components: {
    MessageC
  },
  setup() {
    const messageStore = useMessageStore()
    const messages = ref([{}] as MessageWithUser[])
    const dialog = ref(false)
    const valid = ref(false)
    const newMessage = ref({ content: '' })

    const headers = [
      { text: 'Content', value: 'content' }
    ]

    const fetchMessages = async () => {
      await messageStore.fetchMessages(Number(useRoute().params.idSubject))
      messages.value = messageStore.messages
    }

    const addMessage = async () => {
      if (valid.value) {
        await messageStore.addMessage({ content: newMessage.value.content, subjectId: Number(useRoute().params.idSubject), userId: useAuthStore().user?.id })
        newMessage.value.content = ''
        dialog.value = false
      }
    }

    onMounted(fetchMessages)

    return {
      messages,
      fetchMessages,
      headers,
      dialog,
      valid,
      newMessage,
      addMessage
    }
  }
}
</script>