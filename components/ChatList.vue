<template>
  <div class="h-2/3 overflow-y-scroll scroll-smooth">
    <div class="m-6 mb-2 text-sm text-slate-500">
      {{ $t("ChatList.conversations") }}
    </div>
    <div
      :class="[
        'group bar-btn flex justify-between dark:hover:text-gray-600',
        { 'bg-slate-200 dark:bg-gray-700': store.chat === item },
      ]"
      v-for="item in store.chats.filter((chat) => {
        return chat.model !== 'dall-e';
      })"
      :key="item.id"
      @click="openChat(item)"
    >
      <div class="max-w-[85%] flex items-center space-x-1">
        <IconMessage />
        <span class="overflow-hidden whitespace-nowrap text-ellipsis">
          {{ item.name }}
        </span>
      </div>
      <CloseOne
        class="invisible group-hover:visible text-rose-400"
        @click.stop.left="closeChat(item)"
      />
    </div>

    <div class="m-6 mb-2 text-sm text-slate-500">
      {{ $t("ChatList.images") }}
    </div>
    <div
      :class="[
        'group bar-btn flex justify-between dark:hover:text-gray-600',
        { 'bg-slate-200 dark:bg-gray-700': store.chat === item },
      ]"
      v-for="item in store.chats.filter((chat) => {
        return chat.model === 'dall-e';
      })"
      :key="item.id"
      @click="openChat(item)"
    >
      <div class="max-w-[85%] flex items-center space-x-1">
        <IconPicture />
        <span class="overflow-hidden whitespace-nowrap text-ellipsis">
          {{ item.name }}
        </span>
      </div>
      <CloseOne
        class="invisible group-hover:visible text-rose-400"
        @click.stop.left="store.removeChat(item.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Message as IconMessage,
  Picture as IconPicture,
  CloseOne,
} from "@icon-park/vue-next";
import { useChatStore } from "@/stores/chat";
import type { ChatItem } from "~/types";

const store = useChatStore();

async function openChat(item: ChatItem) {
  store.$patch({ showSetting: false, chat: item });
  await store.getChatMessages(item.id);
  toggleSideBar();
}

async function closeChat(item: ChatItem) {
  await store.removeChat(item.id);
  await openChat(store.chats[0]);
}
</script>

<style scoped></style>
