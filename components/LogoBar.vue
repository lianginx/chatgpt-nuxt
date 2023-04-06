<template>
  <div
    class="flex items-center h-16 px-6 space-x-2 b-slate border-b cursor-pointer"
  >
    <Robot size="30" /><span class="text-2xl font-bold">ChatGPT</span>
  </div>
</template>

<script setup lang="ts">
import { Robot } from "@icon-park/vue-next";
import { useChatStore } from "~~/stores/chat";

// const sotre = useChatStore();

// const init = () => sotre.$patch({ showSetting: false, chat: null });
</script>
