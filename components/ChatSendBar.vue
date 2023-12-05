<template>
  <div class="relative m-4 mt-3 sm:mb-2 pointer-events-auto">
    <!-- only DALL-E -->
    <template v-if="store.chat?.model === 'dall-e'">
      <div class="grid grid-cols-2 p-2 bg-white dark:bg-gray-700">
        <!-- Number of images -->
        <div class="mx-auto">
          <label class="space-x-3">
            <span>{{ $t("ChatSendBar.imageN") }}: </span>
          </label>
          <select v-model="store.imageN">
            <option v-for="n in 10" :value="n">
              {{ n }}
            </option>
          </select>
        </div>

        <!-- Size of image -->
        <div class="mx-auto">
          <label class="space-x-3">
            <span>{{ $t("ChatSendBar.imageSize") }}: </span>
          </label>
          <select v-model="store.imageSize">
            <option v-for="imageSize in imageSizes" :value="imageSize.value">
              {{ imageSize.label }}
            </option>
          </select>
        </div>
      </div>
    </template>

    <!-- Chat -->
    <textarea
      class="w-full max-h-60 p-1.5 pl-3 pr-10 resize-none border rounded-lg outline-blue-500 dark:bg-gray-700 dark:text-slate-300 focus:ring focus:ring-blue-200 focus:ring-opacity-40"
      rows="3"
      ref="textareaDom"
      v-model="store.messageContent"
      :placeholder="placeholder || $t('ChatSendBar.placeholder')"
      @keydown="(event) => enterInput(event)"
      @compositionstart="composing = true"
      @compositionend="composing = false"
    ></textarea>
    <ChatSendButton
      class="absolute bottom-2 sm:bottom-2 right-3"
      :is-talking="store.talking"
      @click="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type { ImageSize } from "~/types";

const store = useChatStore();
const composing = ref(false);
const textareaDom = ref<HTMLTextAreaElement>();

const imageSizes: { label: string; value: ImageSize }[] = [
  { label: "256 x 256 pixel", value: "256x256" },
  { label: "512 x 512 pixel", value: "512x512" },
  { label: "1024 x 1024 pixel", value: "1024x1024" },
];

defineProps({
  placeholder: {
    type: String,
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

async function sendMessage() {
  if (!store.messageContent.trim()) return;

  if (store.chat?.model === "dall-e") {
    await store.sendImageRequestMessage({
      role: "user",
      content: store.messageContent,
      chatId: store.chat?.id,
      imageN: store.imageN,
      imageSize: store.imageSize,
    });
  } else {
    await store.sendMessage({
      role: "user",
      content: store.messageContent,
      chatId: store.chat?.id,
    });
  }
}

function enterInput(event: KeyboardEvent) {
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
  // if (
  //   (event.metaKey || event.ctrlKey) &&
  //   ["ArrowUp", "ArrowDown"].includes(event.key)
  // ) {
  //   let userMsg;

  //   if (event.key === "ArrowUp") {
  //     // userMsg = previousMessage(msgIndex);
  //   }

  //   if (event.key === "ArrowDown") {
  //     // userMsg = nextMessage(msgIndex);
  //   }

  //   // msgIndex = userMsg?.index ?? null;
  //   // messageContent.value = userMsg?.message ?? "";
  // }
}
</script>

<style scoped>
label {
  @apply mb-2 text-sm font-medium text-gray-900 dark:text-slate-300;
}

select {
  @apply border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5;
}
</style>
