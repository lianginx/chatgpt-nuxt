<template>
  <div ref="messagesDom" class="sm:mx-2.5 pt-4 space-y-4 overflow-auto">
    <ChatMessageItem
      v-for="item in store.messages"
      :key="item.id"
      :item="item"
    />
    <div :class="store.chat?.model === 'dall-e' ? 'h-40' : 'h-32'" />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const store = useChatStore();
const messagesDom = ref<HTMLDivElement>();

watch(
  () => store.messages,
  () =>
    nextTick(() => {
      if (!messagesDom.value) return;
      messagesDom.value.scrollTop = messagesDom.value.scrollHeight;
    }),
  { flush: "post", immediate: true }
);
</script>

<style scoped></style>
