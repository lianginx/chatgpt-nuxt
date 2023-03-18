<script setup lang="ts">
import cryptoJS from "crypto-js";
import { ChatMessage } from "~~/types";

let apiKey = "";
let isConfig = ref(false);
let isTalking = ref(false);
const isComposing = ref(false);
let messageContent = ref("");
const chatListDom = ref<HTMLDivElement>();
const chatMod = ref<HTMLTextAreaElement>();
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
    if (!content.trim()) return;
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

const enterInput = (event: KeyboardEvent) => {
  if (event.key !== "Enter") return;
  if (event.shiftKey) return;
  event.preventDefault();
  if (isComposing.value) return;
  if (isTalking.value) return;
  sendOrSave();
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

watch(messageList.value, () =>
  nextTick(() => {
    if (!chatListDom.value) return;
    scrollTo(0, chatListDom.value.scrollHeight);
  })
);

watch(messageContent, () => {
  nextTick(() => {
    if (!chatMod.value) return;
    chatMod.value.style.height = "auto";
    chatMod.value.style.height = `${chatMod.value.scrollHeight + 2}px`;
  });
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <NavBar>
      <div
        class="ml-auto px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 rounded-md"
        @click="clickConfig()"
      >
        设置
      </div>
    </NavBar>

    <div class="flex-1 pt-24 pb-4 bg-slate-200" ref="chatListDom">
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

    <div class="sticky bottom-0 p-4 sm:pb-6 bg-white">
      <div class="relative">
        <div class="mb-1 text-sm text-slate-500" v-if="isConfig">
          输入 API Key:
        </div>
        <textarea
          rows="1"
          class="w-full max-h-60 p-2 pl-3 pr-10 resize-none border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          :placeholder="isConfig ? 'sk-xxxxxxxxxx' : '请输入'"
          ref="chatMod"
          v-model="messageContent"
          @keydown="(event) => enterInput(event)"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        ></textarea>
        <div class="absolute bottom-1.5 right-0.5">
          <button
            class="p-2 text-blue-600 rounded-full cursor-pointer"
            :disabled="isTalking"
            @click="sendOrSave()"
          >
            <svg
              aria-hidden="true"
              class="w-6 h-6 rotate-90"
              :fill="isTalking ? '#e1e1e1' : 'currentColor'"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
            <span class="sr-only"> {{ isConfig ? "保存" : "发送" }} </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
