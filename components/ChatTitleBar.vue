<template>
  <div class="flex justify-between items-center h-16 px-4 b-slate border-b">
    <div class="flex items-center space-x-2">
      <IconMessage size="24" theme="filled" />
      <input
        ref="titleInputDom"
        class="border px-2 py-1 rounded-md"
        v-if="editTitle"
        v-model="editTitle"
        type="text"
        name="title"
        @focusout="exitEditing"
        @keydown.enter="exitEditing"
      />
      <div class="w-full text-lg" v-else @dblclick="enterEditing">
        {{ title }}
      </div>
    </div>
    <div
      class="p-2.5 rounded-md hover:bg-slate-200 cursor-pointer"
      @click="clearMessages"
    >
      <Clear size="22" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message as IconMessage, Clear } from "@icon-park/vue-next";
import { useChatStore } from "~~/stores/chat";

const store = useChatStore();
const titleInputDom = ref<HTMLInputElement>();
const editTitle = ref("");

const title = computed(() => store.chat?.name ?? "闲聊");

const enterEditing = () => {
  editTitle.value = store.chat?.name ?? title.value;
  nextTick(() => titleInputDom.value?.focus());
};

const exitEditing = async () => {
  if (!editTitle.value.trim()) return;
  if (store.chat?.id) {
    const chatId = await store.db.chat.update(store.chat.id, {
      name: editTitle.value,
    });
    store.chat.name = editTitle.value;
    store.getAllChats();
  }
  editTitle.value = "";
};

const clearMessages = () => {
  if (confirm("是否清空聊天记录？")) {
    store.clearMessages();
  }
};
</script>

<style scoped></style>
