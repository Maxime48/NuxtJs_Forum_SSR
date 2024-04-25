<template>
  <div class="pt-16">
    <nav-bar />
  </div>
  <div class="my-8 mx-4">

    <v-alert class="mb-4" v-if="useAuthStore().message" type="info" >
      {{ useAuthStore().getMessage }}
    </v-alert>

    <slot />
  </div>
</template>
<script setup lang="ts">
</script>