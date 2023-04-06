<script setup lang="ts">
import ChatList from "./ChatList.vue";
</script>

<template>
  <div
    class="sm:flex flex-col hidden sm:visible min-w-fit sm:w-1/5 overflow-hidden p-3 bg-slate-100 select-none"
  >
    <LogoBar />
    <ChatList />
    <FuncBar />
  </div>
</template>

<style scoped>
:deep(.bar-btn) {
  @apply flex items-center px-6 py-4 space-x-1 cursor-pointer hover:bg-slate-200 rounded;
}
</style>
