<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="forums"
        class="elevation-1"
        item-key="id"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>
            <v-icon small @click="toggleItem(index)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </td>
        </tr>
        <tr v-if="menu[index]" :key="`details-${index}`">
          <td colspan="3">
            <v-card v-model="menu[index]" multiple class="v-card--outlined">
              <v-card-title>
                Edit Forum
              </v-card-title>
              <v-card-text>
                <v-text-field label="Title" v-model="item.title"></v-text-field>
                <v-text-field label="Description" v-model="item.description"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" @click="editItem(item, index)">Save</v-btn>
              </v-card-actions>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>
    <div class="d-flex justify-center align-center pt-4">
      <v-btn :to="'/admin/forum/add'" fab large color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
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
    const menu = ref<boolean[]>([])

    const headers = [
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
      { text: 'Actions', value: 'action', sortable: false },
    ]

    onMounted(async () => {
      await forumStore.getForums()
      forums.value = forumStore.forums
      menu.value = Array(forums.value.length).fill(false) // Initialise le menu avec false
    })

    const toggleItem = (index: number) => {
      menu.value[index] = !menu.value[index] // Toggle le menu
    }

    const editItem = async (item: Forum, index: number) => {
      try {
        await forumStore.updateForum(item)
        toggleItem(index) // Ferme le menu après la mise à jour
      } catch (error) {
        console.error(error)
      }
    }

    const deleteItem = async (item: Forum) => {
      try {
        await forumStore.deleteForum(item.id)
      } catch (error) {
        console.error(error)
      }
    }

    return { forums, headers, editItem, deleteItem, menu, toggleItem }
  }
})
</script>