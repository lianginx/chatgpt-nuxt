<template>
  <div
    class="sm:flex flex-col w-full sm:w-[300px] overflow-hidden p-3 bg-slate-100 dark:bg-gray-900 dark:text-slate-300 select-none"
  >
    <LogoBar />
    <ChatList />
    <FuncBar />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
:deep(.bar-btn) {
  @apply flex items-center px-6 py-4 space-x-1 cursor-pointer hover:bg-slate-200 rounded;
}
</style>
