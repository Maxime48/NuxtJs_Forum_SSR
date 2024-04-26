<template>
  <div class="pt-16">
    <nav-bar />
  </div>
  <div class="my-8 mx-4">

    <v-alert class="mb-4" v-if="useAuthStore().message" type="info" >
      {{ useAuthStore().getMessage }}
    </v-alert>
    <v-alert class="mb-4" v-if="useForumStore().message" type="info" >
      {{ useForumStore().getMessage }}
    </v-alert>
    <v-alert class="mb-4" v-if="useSubjectStore().message" type="info" >
      {{ useSubjectStore().getMessage }}
    </v-alert>
    <v-alert class="mb-4" v-if="useMessageStore().message" type="info" >
      {{ useMessageStore().getMessage }}
    </v-alert>
    <v-alert class="mb-4" v-if="useUserStore().message" type="info" >
      {{ useUserStore().getMessage }}
    </v-alert>

    <slot />
  </div>
</template>
<script setup lang="ts">
</script>