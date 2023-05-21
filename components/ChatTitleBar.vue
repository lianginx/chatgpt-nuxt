<template>
  <div
    class="flex justify-between items-center bg-white dark:bg-gray-700 dark:text-slate-300 h-14 sm:h-16 pl-2 sm:px-4 border-b"
  >
    <div class="flex items-center space-x-2">
      <Message size="24" />
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
        class="icon-btn dark:hover:text-gray-600"
        @click="store.showHelp = true"
      >
        <Help size="22" />
      </div>
      <div class="icon-btn dark:hover:text-gray-600" @click="clearMessages">
        <Clear size="22" />
      </div>
      <div
        class="icon-btn block sm:hidden dark:hover:text-gray-600"
        @click="store.showSetting = true"
      >
        <SettingOne size="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message, Clear, SettingOne, Help } from "@icon-park/vue-next";
import { useChatStore } from "@/stores/chat";
import { ChatItem } from "@/types";

const store = useChatStore();
const i18n = useI18n();

const titleInputDom = ref<HTMLInputElement>();
const editTitle = ref("");
const clearConfirmMessage = i18n.t("ChatTitleBar.clearMessages.confirm");

const title = computed(
  () => store.chat?.name ?? i18n.t("ChatTitleBar.initialTitle")
);

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
  if (confirm(clearConfirmMessage)) {
    store.clearMessages((store.chat as ChatItem).id);
  }
}
</script>

<style scoped>
.icon-btn {
  @apply p-2.5 rounded-md sm:hover:bg-slate-200 active:bg-slate-200 cursor-pointer;
}
</style>
