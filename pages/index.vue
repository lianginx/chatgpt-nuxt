<script setup lang="ts">
import { useChatStore } from "~~/stores/chat";

const sotre = useChatStore();
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden text-slate-700">
    <SideBar />
    <Setting v-if="sotre.showSetting" />
    <Content v-else />
  </div>
</template>

<style>
:deep(.b-slate) {
  @apply border-slate-200;
}
</style>
