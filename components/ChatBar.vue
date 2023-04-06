<template>
  <div class="h-2/3 overflow-y-scroll scroll-smooth">
    <div class="m-6 mb-2 text-sm text-slate-500">对话</div>
    <div
      :class="[
        'group bar-btn flex justify-between',
        { 'bg-slate-200': store.chat === item },
      ]"
      v-for="item in store.chats"
      :key="item.id"
      @click="openChat(item)"
    >
      <div class="flex items-center space-x-1">
        <IconMessage /><span>{{ item.name }}</span>
      </div>
      <CloseOne
        class="invisible group-hover:visible text-red-400"
        @click.stop.left="removeChat(item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message as IconMessage, CloseOne } from "@icon-park/vue-next";
import { useChatStore } from "~~/stores/chat";
import { Chat } from "~~/types";

const store = useChatStore();

onMounted(async () => {
  store.chats = await store.db.chat.toArray();

  if (!store.chats.length) {
    await store.createChat({ name: "新的聊天" });
  }

  openChat(store.chats[0]);
});

const openChat = async (item: Chat) => {
  store.$patch({ showSetting: false, chat: item });
  if (item?.id) {
    store.messages = await store.db.messages
      .where("chatId")
      .equals(item.id)
      .toArray();
  }
};

const removeChat = (item: Chat) => {
  if (confirm("确认删除当前会话？")) {
    store.removeChat(item);
  }
};
</script>

<style scoped></style>
