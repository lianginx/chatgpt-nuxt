<template>
  <div class="relative m-4 sm:mb-2 bg-white pointer-events-auto">
    <textarea
      class="w-full h max-h-60 p-1.5 pl-3 pr-10 resize-none border rounded-lg focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
      rows="3" ref="textareaDom" v-model="store.messageContent" :placeholder="placeholder"
      @keydown="(event) => enterInput(event)" @compositionstart="composing = true"
      @compositionend="composing = false"></textarea>
    <Send class="absolute bottom-5 sm:bottom-1.5 right-0" :is-talking="store.talking" @click="sendMessage" />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~~/stores/chat";

const store = useChatStore();
const composing = ref(false);
const textareaDom = ref<HTMLTextAreaElement>();

defineProps({
  placeholder: {
    type: String,
    default: "输入消息，Enter 发送，Shift + Enter 换行",
  },
});

watch(
  () => store.messageContent,
  () => {
    if (!textareaDom.value) return;
    textareaDom.value.style.height = "auto";
    textareaDom.value.style.height = `${textareaDom.value.scrollHeight + 2}px`;
  },
  { flush: "post" }
);

const sendMessage = async () => {
  if (!store.messageContent.trim()) return;

  await store.sendMessage({
    role: "user",
    content: store.messageContent,
    chatId: store.chat?.id,
  });
};

const enterInput = (event: KeyboardEvent) => {
  // 拦截 Enter 实现禁用发送、换行
  if (event.key === "Enter") {
    if (event.shiftKey) return;

    event.preventDefault();

    if (composing.value) return;
    if (store.talking) return;

    // 发送消息
    sendMessage();

    // 当设备为移动端时，发送后关闭键盘
    if (isMobile()) (event.target as HTMLTextAreaElement).blur();
  }

  // Ctrl/command + up/down 查看发送记录
  if (
    (event.metaKey || event.ctrlKey) &&
    ["ArrowUp", "ArrowDown"].includes(event.key)
  ) {
    let userMsg;

    if (event.key === "ArrowUp") {
      // userMsg = previousMessage(msgIndex);
    }

    if (event.key === "ArrowDown") {
      // userMsg = nextMessage(msgIndex);
    }

    // msgIndex = userMsg?.index ?? null;
    // messageContent.value = userMsg?.message ?? "";
  }
};
</script>

<style scoped></style>
