<template>
  <div class="pointer-events-none flex justify-center">
    <div
      class="pointer-events-auto flex items-center space-x-1 px-3.5 py-1.5 sm:px-4 bg-blue-600 text-white active:bg-blue-800 hover:bg-blue-700 text-xs sm:text-sm rounded-md shadow-md cursor-pointer"
      @click="store.stop()"
    >
      <Square theme="outline" size="14" />
      <span class="select-none">停止回答</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Square } from "@icon-park/vue-next";
import { useChatStore } from "@/stores/chat";

const store = useChatStore();
</script>
