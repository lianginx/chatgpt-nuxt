<template>
  <div class="flex justify-between items-center h-16 px-4 border-b">
    <div class="flex items-center space-x-2">
      <IconMessage size="24" theme="filled" />
      <input
        ref="titleInputDom"
        class="border px-2 py-1 rounded-md"
        v-if="editTitle"
        v-model.trim="editTitle"
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
import { useChatStore } from "@/stores/chat";
import { ChatItem } from "@/types";

const store = useChatStore();
const titleInputDom = ref<HTMLInputElement>();
const editTitle = ref("");

const title = computed(() => store.chat?.name ?? "闲聊");

function enterEditing() {
  if (!store.chat?.id) return;
  editTitle.value = store.chat?.name ?? title.value;
  nextTick(() => titleInputDom.value?.focus());
}

async function exitEditing() {
  const chatId = store.chat?.id;
  if (!editTitle.value) return;
  if (!chatId) return;
  await store.reChatName(chatId, editTitle.value);
  editTitle.value = "";
}

function clearMessages() {
  if (confirm("是否清空聊天记录？")) {
    store.clearMessages((store.chat as ChatItem).id);
  }
}
</script>

<style scoped></style>
