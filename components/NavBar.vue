<script setup lang="ts">
  const sidebar = ref(false);
  const menuItems = ref([
    { title: 'Accueil', icon: 'mdi-home', path: '/' },
    { title: 'Catégories', icon: 'mdi-format-list-bulleted', path: '/categories' },
    { title: 'Nouveaux sujets', icon: 'mdi-plus-box', path: '/new-topics' },
    { title: 'Mon profil', icon: 'mdi-account', path: '/profile' },
  ]);
</script>

<template>
  <v-app-bar app>
    <v-app-bar-nav-icon class="hidden-sm-and-up" @click="sidebar = !sidebar" />
    <v-app-bar-title>
      <router-link to="/" class="text-decoration-none">
        Mon Forum
      </router-link>
    </v-app-bar-title>
    <v-spacer />
    <v-btn
        v-for="item in menuItems"
        :key="item.title"
        :to="item.path"
        class="hidden-xs-only"
    >
      <v-icon left>{{ item.icon }}</v-icon>
      {{ item.title }}
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="sidebar" app>
    <v-list>
      <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>