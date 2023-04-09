<template>
  <div class="flex w-screen h-screen overflow-hidden text-slate-700">
    <ChatSideBar />
    <ChatSetting class="flex-1" v-if="store.showSetting" />
    <ChatContentBar class="flex-1" v-else />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";

const store = useChatStore();

onMounted(async () => {
  if (!loadSetting()) store.showSetting = true;
  await store.setNotActiveDbMessages();
  await store.getAllChats();
});
</script>

<style></style>
