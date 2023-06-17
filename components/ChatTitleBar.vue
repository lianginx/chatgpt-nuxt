<template>
  <div
    class="flex justify-between items-center bg-white dark:bg-gray-700 dark:text-slate-300 h-14 sm:h-16 pl-2 sm:px-4 border-b"
  >
    <div class="grow inline-flex items-center space-x-2">
      <div
        class="icon-btn flex-none block sm:hidden dark:hover:text-gray-600"
        @click="toggleSideBar()"
      >
        <HamburgerButton size="22" />
      </div>
      <div class="flex-none hidden sm:block">
        <Picture v-if="store.chat?.model === 'dall-e'" size="24" />
        <Message v-else size="24" />
      </div>
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
      <div v-else class="grow flex inline-flex w-1">
        <div
          class="overflow-hidden whitespace-nowrap text-lg text-ellipsis"
          @dblclick="enterEditing"
        >
          {{ title }}
        </div>
        <span
          class="w-fit whitespace-nowrap inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-600 px-2 py-1 mx-2 text-xs font-medium text-gray-600 dark:text-slate-300 ring-1 ring-inset ring-gray-500/10"
        >
          {{ model }}
        </span>
      </div>
    </div>
    <div class="flex-none inline-flex items-center">
      <div
        class="icon-btn hidden sm:block dark:hover:text-gray-600"
        @click="store.showHelp = true"
      >
        <Help size="22" />
      </div>
      <div class="icon-btn dark:hover:text-gray-600" @click="clearMessages">
        <Clear size="22" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HamburgerButton, Message, Clear, Help } from "@icon-park/vue-next";
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

const model = computed(() =>
  store.getChatModelNameById(store.chat?.model ?? "gpt-3.5-turbo")
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
