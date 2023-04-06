<template>
  <div class="flex-1 flex flex-col p-3">
    <ChatTitleBar />
    <Message v-if="store.messages.length" />
    <Welcome v-else />
    <StopChat v-show="store.talking" />
    <SendBar />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~~/stores/chat";

const store = useChatStore();
</script>
