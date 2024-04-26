<template>
  <div>
    <p>{{ message.content }}</p>
    <p>Posted by: {{ message.userId }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Message } from '@prisma/client'

export default defineComponent({
  props: {
    message: {
      type: Object as () => Message,
      required: true
    }
  }
})
</script>