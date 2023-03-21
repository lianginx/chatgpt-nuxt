<script setup lang="ts">
import { ChatMessage } from "~~/types";

const isConfig = ref(false);
const isTalking = ref(false);
const isComposing = ref(false);
const messageContent = ref("");
const chatListDom = ref<HTMLDivElement>();
const chatMod = ref<HTMLTextAreaElement>();
const messageList = ref<ChatMessage[]>([]);
const decoder = new TextDecoder("utf-8");

onMounted(async () => {
  if (!getAPIKey()) {
    switchConfigStatus();
  }
});

const sendChatMessage = async (content: string = messageContent.value) => {
  try {
    if (!content.trim()) return;
    isTalking.value = true;

    messageList.value.push(
      { role: "user", content },
      { role: "assistant", content: "" }
    );
    clearMessageContent();

    // 发送消息
    const { status, body } = await fetch("/api/chat", {
      method: "post",
      body: JSON.stringify({
        apiKey: getAPIKey(),
        messages: messageList.value.slice(0, -1),
      }),
    });

    // console.log("status", status);
    // console.log("body", body);

    // 流式读取
    const reader = body?.getReader();
    while (reader) {
      const { done, value } = await reader.read();

      if (done) {
        // console.log("done", done);
        reader.closed;
        break;
      }

      const text = decoder.decode(value);
      // console.log(`======\n${text}===`);

      const dataList = status === 200 ? text.match(/({.*?]})/g) : [text];
      // console.log("dataList", dataList);

      dataList?.forEach((textData) => {
        const data = JSON.parse(textData);
        // console.log("data", data);

        const content =
          status === 200 ? data.choices[0].delta.content ?? "" : data.message;
        // console.log("content", content);

        appendLastMessageContent(content);
      });
    }
  } catch (e: any) {
    appendLastMessageContent(e.message);
  } finally {
    isTalking.value = false;
  }
};

const appendLastMessageContent = (content: string) =>
  (messageList.value[messageList.value.length - 1].content += content);

const sendOrSave = async () => {
  if (!messageContent.value.length) return;
  if (isConfig.value) {
    if (saveAPIKey(messageContent.value.trim())) {
      sendChatMessage("Hello, Happy World!");
      switchConfigStatus();
    }
    clearMessageContent();
  } else {
    sendChatMessage();
  }
};

let msgIndex: number | undefined;
const enterInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    if (event.shiftKey) return;
    event.preventDefault();
    if (isComposing.value) return;
    if (isTalking.value) return;
    sendOrSave();
  } else if (event.metaKey || event.ctrlKey) {
    if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
    let userMsg;
    console.log(event.key);

    if (event.key === "ArrowUp") {
      userMsg = previousMessage(messageList.value, msgIndex);
    }
    if (event.key === "ArrowDown") {
      userMsg = nextMessage(messageList.value, msgIndex);
    }
    msgIndex = userMsg?.index;
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
        <Send
          class="absolute bottom-1.5 right-0.5"
          :is-talking="isTalking"
          :is-config="isConfig"
          @click="sendOrSave()"
        />
      </div>
    </div>
  </div>
</template>
