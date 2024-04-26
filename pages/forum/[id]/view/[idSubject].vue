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
            {{ item?.user?.name }}
          </v-card-title>
          <v-card-text>
            {{ item.content }}
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
    <button @click="fetchMessages">Refresh</button>
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

    const headers = [
      { text: 'Content', value: 'content' }
    ]

    const fetchMessages = async () => {
      await messageStore.fetchMessages(Number(useRoute().params.idSubject))
      messages.value = messageStore.messages
    }

    onMounted(fetchMessages)

    return {
      messages,
      fetchMessages,
      headers
    }
  }
}
</script>