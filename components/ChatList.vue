<template>
  <div class="h-2/3 overflow-y-scroll scroll-smooth">
    <div class="m-6 mb-2 text-sm text-slate-500">
      {{ $t("ChatList.conversations") }}
    </div>
    <div
      :class="[
        'group bar-btn flex justify-between',
        { 'bg-slate-200': store.chat === item },
      ]"
      v-for="item in store.chats"
      :key="item.id"
      @click="openChat(item)"
    >
      <div class="max-w-[85%] flex items-center space-x-1">
        <IconMessage /><span
          class="overflow-hidden whitespace-nowrap text-ellipsis"
          >{{ item.name }}</span
        >
      </div>
      <CloseOne
        class="invisible group-hover:visible text-rose-400"
        @click.stop.left="store.removeChat(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message as IconMessage, CloseOne } from "@icon-park/vue-next";
import { useChatStore } from "@/stores/chat";
import { ChatItem } from "@/types";

const store = useChatStore();

async function openChat(item: ChatItem) {
  store.$patch({ showSetting: false, chat: item });
  await store.getChatMessages(item.id);
}
</script>

<style scoped></style>
