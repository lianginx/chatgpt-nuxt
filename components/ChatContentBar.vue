<template>
  <div class="flex-1 relative flex flex-col p-3">
    <ChatTitleBar />
    <ChatMessageList v-if="store.messages.length" />
    <ChatWelcome v-else />
    <div
      class="absolute pb-2 bottom-0 left-0 right-0 bg-gradient-to-t from-white"
    >
      <ChatStop v-show="store.talking" />
      <ChatSendBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const store = useChatStore();
</script>
