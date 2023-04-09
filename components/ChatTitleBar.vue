<template>
  <div
    class="flex justify-between items-center bg-white h-14 sm:h-16 pl-2 sm:px-4 border-b"
  >
    <div class="flex items-center space-x-2">
      <Message size="24" theme="filled" />
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
    <div class="flex items-center">
      <div
        class="p-2.5 rounded-md hover:active:bg-slate-200 cursor-pointer"
        @click="clearMessages"
      >
        <Clear size="22" />
      </div>
      <div
        class="p-2.5 rounded-md hover:active:bg-slate-200 cursor-pointer block sm:hidden"
        @click="store.showSetting = true"
      >
        <SettingOne size="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message, Clear, SettingOne } from "@icon-park/vue-next";
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
