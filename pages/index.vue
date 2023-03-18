<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from "vue";
import cryptoJS from "crypto-js";
import { ChatMessage } from "~~/types";

import Message from "~~/components/Message.vue";
import Reload from "~~/components/Reload.vue";

let apiKey = "";
let isConfig = ref(false);
let isTalking = ref(false);
let messageContent = ref("");
const chatListDom = ref<HTMLDivElement>();
const messageList = ref<ChatMessage[]>([]);

onMounted(() => {
  if (!getAPIKey()) {
    switchConfigStatus();
  }
});

const sendChatMessage = async (
  content: string = messageContent.value
): Promise<void> => {
  try {
    isTalking.value = true;
    messageList.value.push(
      { role: "user", content },
      { role: "assistant", content: "" }
    );
    clearMessageContent();

    const complete = await $fetch("/api/chat", {
      method: "post",
      body: JSON.stringify({ apiKey, messages: messageList.value }),
    });
    appendLastMessageContent(
      complete.status === "success"
        ? complete.data?.content ?? ""
        : complete.message ?? ""
    );
  } catch (e: any) {
    appendLastMessageContent(e.message);
  } finally {
    isTalking.value = false;
  }
};

const appendLastMessageContent = (content: string) =>
  (messageList.value[messageList.value.length - 1].content += content);

const sendOrSave = () => {
  if (!messageContent.value.length) return;
  if (isConfig.value) {
    if (saveAPIKey(messageContent.value.trim())) {
      switchConfigStatus();
    }
    clearMessageContent();
  } else {
    sendChatMessage();
  }
};

const clickConfig = () => {
  if (!isConfig.value) {
    messageContent.value = getAPIKey();
  } else {
    clearMessageContent();
  }
  switchConfigStatus();
};

const getSecretKey = () => "lianginx";

const saveAPIKey = (key: string) => {
  checkAPIKeyError(key);
  apiKey = key;
  const aesAPIKey = cryptoJS.AES.encrypt(key, getSecretKey()).toString();
  localStorage.setItem("apiKey", aesAPIKey);
  return true;
};

const getAPIKey = () => {
  if (apiKey) return apiKey;
  const aesAPIKey = localStorage.getItem("apiKey") ?? "";
  apiKey = cryptoJS.AES.decrypt(aesAPIKey, getSecretKey()).toString(
    cryptoJS.enc.Utf8
  );
  return apiKey;
};

const switchConfigStatus = () => (isConfig.value = !isConfig.value);

const clearMessageContent = () => (messageContent.value = "");

const scrollToBottom = () => {
  if (!chatListDom.value) return;
  scrollTo(0, chatListDom.value.scrollHeight);
};

watch(messageList.value, () => nextTick(() => scrollToBottom()));
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="flex items-center fixed w-full px-4 py-3 sm:py-4 bg-white">
      <div class="flex items-baseline">
        <div class="text-2xl font-bold">ChatGPT</div>
        <div class="ml-4 text-sm text-gray-500 hidden sm:block">
          基于 OpenAI 的 ChatGPT 自然语言模型人工智能对话
        </div>
      </div>
      <div
        class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-slate-50 rounded-md"
        @click="clickConfig()"
      >
        设置
      </div>
    </div>

    <div class="flex-1 pt-20 pb-2 bg-slate-200" ref="chatListDom">
      <Welcome
        v-if="!messageList.length"
        @click-examples="(exa:string) => {
          messageContent = exa;
          sendChatMessage();
        }"
      />
      <Message
        v-for="item of messageList.filter((v) => v.role !== 'system')"
        :message="item"
      />
    </div>

    <div class="sticky bottom-0 p-4 sm:p-6 sm:pb-8 bg-white">
      <div class="-mt-2 mb-2 text-sm text-gray-500" v-if="isConfig">
        请输入 API Key：
      </div>
      <div class="flex items-center">
        <!-- <Reload /> -->
        <input
          class="mr-4 px-4 py-1.5 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 flex-grow"
          :type="isConfig ? 'password' : 'text'"
          :placeholder="isConfig ? 'sk-xxxxxxxxxx' : '请输入'"
          v-model="messageContent"
          @keydown.enter="isTalking || sendOrSave()"
        />
        <button
          class="px-4 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 whitespace-nowrap disabled:bg-blue-300"
          :disabled="isTalking"
          @click="sendOrSave()"
        >
          {{ isConfig ? "保存" : "发送" }}
        </button>
      </div>
    </div>
  </div>
</template>
