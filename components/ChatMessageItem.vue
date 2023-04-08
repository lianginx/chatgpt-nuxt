<template>
  <div :class="{ 'opacity-70': !item.active }">
    <div
      class="flex justify-center mb-6"
      v-if="item.role === 'system' && item.show"
    >
      <div
        class="w-4/5 p-2 bg-slate-100 text-xs text-slate-500 border rounded-lg"
      >
        {{ item.content }}
      </div>
    </div>
    <div
      class="flex"
      :class="{ 'flex-row-reverse': item.role === 'user' }"
      v-else
    >
      <ChatAvatar class="item-gap" :role="item.role" />
      <div class="custom-max-w item-gap group" v-if="getContent(item)">
        <div
          class="prose break-words px-3 py-2 rounded-lg text-sm sm:text-base"
          :class="
            item.role === 'user'
              ? 'bg-blue-500 text-white prose-invert'
              : 'bg-slate-100 text-slate-700'
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
  </div>
</template>

<script setup lang="ts">
import { ChatMessageExItem } from "@/types";

defineProps<{
  item: ChatMessageExItem;
}>();

function getContent(item: ChatMessageExItem) {
  return item.role === "assistant"
    ? item.content + (item.errorMessage ?? "")
    : item.content;
}
</script>

<style scoped>
.custom-max-w {
  max-width: 100%;
}

.item-gap {
  @apply m-1.5;
}
</style>
