<script setup lang="ts">
import { Send, Telegram } from "@icon-park/vue-next";

defineProps<{
  isTalking: boolean;
}>();
</script>

<template>
  <div>
    <button class="rounded-md cursor-pointer" :disabled="isTalking">
      <Telegram
        :class="isTalking ? 'text-slate-300' : 'text-blue-600'"
        size="24"
      />
      <span class="sr-only">发送</span>
    </button>
  </div>
</template>
