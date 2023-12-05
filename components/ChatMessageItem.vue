<template>
  <div :class="{ 'opacity-70': !item.active }">
    <ChatMessageSystem
      v-if="item.role === 'system' && item.show"
      :item="item"
    />
    <ChatMessageRole v-else :item="item" />
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageExItem } from "~/types";

defineProps<{
  item: ChatMessageExItem;
}>();
</script>

<style scoped></style>
