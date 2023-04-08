<template>
  <div class="flex w-screen h-screen overflow-hidden text-slate-700">
    <ChatSideBar />
    <ChatSetting v-if="store.showSetting" />
    <ChatContentBar v-else />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const store = useChatStore();

onMounted(async () => {
  await store.setNotActiveDbMessages();
  await store.getAllChats();
});
</script>

<style></style>
