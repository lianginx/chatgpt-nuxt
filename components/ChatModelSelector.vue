<template>
  <div
    class="inline-flex m-4 mx-auto p-1 pr-0 max-w-fit bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden"
  >
    <label
      v-for="chatModel in chatModels"
      :for="chatModel"
      class="block px-4 py-1 w-24 rounded-lg cursor-pointer text-center dark:text-slate-300 hover:bg-gray-400 hover:text-white dark:hover:bg-gray-700 dark:hover:text-slate-300 mr-1"
      :class="
        model === chatModel
          ? 'bg-gray-500 dark:bg-gray-800 text-white dark:text-slate-300'
          : ''
      "
    >
      <input
        type="radio"
        class="hidden"
        v-model="model"
        :id="chatModel"
        :value="chatModel"
        @change="changeModel"
      />
      {{ store.getChatModelNameById(chatModel) }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type { ChatModel } from "~/types";

const store = useChatStore();

const model = ref<ChatModel>(store.chat?.model ?? "gpt-3.5-turbo");

const chatModels: ChatModel[] = ["gpt-3.5-turbo", "gpt-4"];

watch(
  () => store.chat,
  () => {
    model.value = store.chat?.model ?? "gpt-3.5-turbo";
  },
  { deep: true }
);

async function changeModel() {
  const chatId = store.chat?.id;
  if (!chatId) return;
  await store.changeChatModel(chatId, model.value);
}
</script>
