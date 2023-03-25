<script setup lang="ts">
import { ChatMessage } from "~~/types";
import { Github, SettingTwo } from "@icon-park/vue-next";

let msgIndex: number | null;
let controller: AbortController;
const isConfig = ref(false);
const isTalking = ref(false);
const isComposing = ref(false);
const messageContent = ref("");
const chatListDom = ref<HTMLDivElement>();
const chatMod = ref<HTMLTextAreaElement>();
const messageList = ref<ChatMessage[]>([]);
const decoder = new TextDecoder("utf-8");

onMounted(() => {
  if (!getAPIKey()) switchConfigStatus();
});

watch(messageList.value, () =>
  nextTick(() => {
    scrollToBottom();
    resetMsgIndex();
  })
);

watch(messageContent, () => {
  nextTick(() => resetMsgInputHeight());
});

const stopChat = () => {
  controller?.abort();
};

const sendChatMessage = async (content: string = messageContent.value) => {
  try {
    if (!content.trim()) return;
    isTalking.value = true;

    messageList.value.push(
      { role: "user", content },
      { role: "assistant", content: "" }
    );
    clearMessageContent();

    // 用于主动中断请求
    controller = new AbortController();

    // 发送请求
    const { status, body } = await fetch("/api/chat", {
      method: "post",
      body: JSON.stringify({
        apiKey: getAPIKey(),
        messages: messageList.value.slice(0, -1),
      }),
      signal: controller.signal,
    });

    // 读取流
    const reader = body?.getReader();
    while (reader) {
      const { done, value } = await reader.read();

      if (done) break;

      const text = decoder.decode(value);
      const dataList = status === 200 ? text.match(/({.*?]})/g) : [text];

      dataList?.forEach((textData) => {
        const data = JSON.parse(textData);
        let content = "";
        switch (status) {
          case 200:
            content = data.choices[0].delta.content ?? "";
            break;
          case 500:
            content = data.message;
            break;
          default:
            content = data.error.message;
            break;
        }
        appendLastMessageContent(content);
      });
    }
  } catch (e: any) {
    let eMessage = e.name === "AbortError" ? "已停止回答" : e.message;
    appendLastMessageContent(`\n\n**${eMessage}**`);
  } finally {
    isTalking.value = false;
  }
};

const sendOrSave = async () => {
  const content = messageContent.value.trim();

  if (!content) return;
  if (!isConfig.value) {
    sendChatMessage();
  } else if (await saveAPIKey(content)) {
    switchConfigStatus();
    sendChatMessage("Hello, Happy World!"); // 发送测试消息
  }
};

const enterInput = (event: KeyboardEvent) => {
  // 拦截 Enter 实现禁用发送、换行
  if (event.key === "Enter") {
    if (event.shiftKey) return;
    event.preventDefault();
    if (isComposing.value) return;
    if (isTalking.value) return;
    sendOrSave();
  }

  // Ctrl/command + up/down 查看发送记录
  if (
    (event.metaKey || event.ctrlKey) &&
    ["ArrowUp", "ArrowDown"].includes(event.key)
  ) {
    let userMsg;

    if (event.key === "ArrowUp") {
      userMsg = previousMessage(messageList.value, msgIndex);
    }

    if (event.key === "ArrowDown") {
      userMsg = nextMessage(messageList.value, msgIndex);
    }

    msgIndex = userMsg?.index ?? null;
    messageContent.value = userMsg?.message ?? "";
  }
};

const clickConfig = async () => {
  if (!isConfig.value) {
    messageContent.value = getAPIKey();
  } else {
    clearMessageContent();
  }
  switchConfigStatus();
};

const appendLastMessageContent = (content: string) =>
  (messageList.value[messageList.value.length - 1].content += content);

const switchConfigStatus = () => (isConfig.value = !isConfig.value);

const clearMessageContent = () => (messageContent.value = "");

const resetMsgIndex = () => (msgIndex = null);

const scrollToBottom = () => {
  if (!chatListDom.value) return;
  scrollTo(0, chatListDom.value.scrollHeight);
};

const resetMsgInputHeight = () => {
  if (!chatMod.value) return;
  chatMod.value.style.height = "auto";
  chatMod.value.style.height = `${chatMod.value.scrollHeight + 2}px`;
};
</script>

<template>
  <div class="flex flex-col bg-slate-200 min-h-screen">
    <NavBar>
      <NuxtLink
        class="bar-btn"
        to="https://github.com/lianginx/chatgpt-nuxt"
        target="_blank"
      >
        <Github class="text-slate-700" theme="outline" size="22" />
      </NuxtLink>
      <div class="bar-btn" @click="clickConfig()">
        <SettingTwo class="text-slate-700" theme="outline" size="22" />
      </div>
    </NavBar>

    <div class="flex-1 pt-24 pb-4" ref="chatListDom">
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

    <div class="sticky bottom-0 pointer-events-none">
      <div class="flex justify-center" :class="{ 'pb-3': isTalking }">
        <StopChat
          class="pointer-events-auto"
          v-show="isTalking"
          @click="() => stopChat()"
        />
      </div>
      <div class="relative p-4 sm:pb-6 bg-white pointer-events-auto">
        <div class="mb-1 text-sm text-slate-500" v-if="isConfig">
          输入 API Key:
        </div>
        <textarea
          rows="1"
          class="w-full h max-h-60 p-1.5 pl-3 pr-10 resize-none border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
          :placeholder="
            isConfig ? 'sk-xxxxxxxxxx' : '输入内容和 AI 开始聊天吧 …'
          "
          ref="chatMod"
          v-model="messageContent"
          @keydown="(event) => enterInput(event)"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        ></textarea>
        <Send
          class="absolute bottom-5 sm:bottom-7 right-4"
          :is-talking="isTalking"
          :is-config="isConfig"
          :event-send="sendOrSave"
        />
      </div>
    </div>
  </div>
</template>

<style>
.bar-btn {
  @apply ml-2 p-2 text-sm cursor-pointer hover:bg-slate-100 rounded-md;
}
</style>
