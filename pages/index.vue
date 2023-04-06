<script setup lang="ts">
import { useChatStore } from "~~/stores/chat";

const sotre = useChatStore();
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden text-slate-700">
    <ChatSideBar />
    <ChatSetting v-if="sotre.showSetting" />
    <ChatContentBar v-else />
  </div>
</template>

<style>
:deep(.b-slate) {
  @apply border-slate-200;
}
</style>
