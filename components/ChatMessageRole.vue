<template>
  <div class="flex" :class="{ 'flex-row-reverse': item.role === 'user' }">
    <ChatAvatar class="item-gap" :role="item.role" />
    <div class="group item-gap overflow-x-hidden" v-if="getContent(item)">
      <div
        class="prose break-words px-3 py-2 rounded-lg text-sm sm:text-base overflow-x-auto"
        :class="
          item.role === 'user'
            ? 'ml-auto bg-blue-500 dark:bg-blue-700 text-white dark:text-slate-200 prose-invert'
            : 'mr-auto bg-slate-100 dark:bg-slate-500 text-slate-700 dark:text-slate-200'
        "
        v-html="md.render(getContent(item))"
      />
      <div class="flex items-center space-x-2">
        <CopyText
          class="mt-1.5 visible sm:invisible group-hover:visible"
          :content="getContent(item)"
        />
      </div>
    </div>
    <ChatMessageLoding class="item-gap" v-else />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageExItem } from "~/types";

defineProps<{
  item: ChatMessageExItem;
}>();

function getContent(item: ChatMessageExItem) {
  return item.role === "assistant"
    ? item.content + (item.errorMessage ?? "")
    : item.content;
}
</script>

<style>
.item-gap {
  @apply m-1.5;
}
</style>
