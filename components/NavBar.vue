<script setup lang="ts">
const name = "ChatGPT";
const slogan = "基于 OpenAI 的 ChatGPT 自然语言模型人工智能对话";

const reloadPage = () => window.location.reload();
</script>

<template>
  <div class="flex items-center fixed w-full px-4 py-3 sm:py-4 bg-white">
    <div class="flex items-baseline">
      <div class="text-2xl font-bold cursor-pointer" @click="reloadPage()">
        {{ name }}
      </div>
      <div class="ml-4 text-sm text-gray-500 hidden sm:block">{{ slogan }}</div>
    </div>
    <div class="ml-auto flex items-center">
      <slot />
    </div>
  </div>
</template>
