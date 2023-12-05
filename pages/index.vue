<template>
  <div
    class="flex w-screen h-screen overflow-hidden dark:bg-gray-700 text-slate-700 text-sm sm:text-base"
  >
    <HotKeyHelp
      class="absolute"
      :class="store.showHelp ? 'visible' : 'invisible'"
    />
    <ChatSideBar id="sidebar" class="sm:visible" />
    <template id="main" class="hidden sm:visible flex w-screen h-screen">
      <ChatSetting class="flex-1" v-if="store.showSetting" />
      <ChatContentBar class="flex-1" v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import type { CreateChatCompletionRequest } from "openai";
import hotkeys from "hotkeys-js";

const store = useChatStore();

const i18n = useI18n();
const locale = computed(() => store.getLocale());

// head

useHead({
  title: i18n.t("app.title"),
  meta: [
    {
      name: "description",
      content: i18n.t("app.description"),
    },
  ],
});

const colorMode = useColorMode();

// 页面初始化

onMounted(() => initPage());

async function initPage() {
  i18n.setLocale(locale.value);
  colorMode.preference = store.getColorMode();

  const clientWidth = document.body.clientWidth;
  if (clientWidth >= 640) {
    const mainContent = document.getElementById("main");
    mainContent?.classList.remove("hidden");
  }

  if (!loadSetting()) store.showSetting = true;
  await store.setNotActiveDbMessages();
  await store.getAllChats();
}

// 自动生成聊天标题
watch(
  () => store.standardList,
  async (newValue, oldValue) => {
    if (newValue.length !== 1 || oldValue.length !== 0) return;
    if (!store.chat?.id) return;

    const chatId = store.chat.id;
    const title = await generateChatTitle(newValue[0].content);

    if (title) store.reChatName(chatId, title);
  }
);

async function generateChatTitle(content: string) {
  const setting = loadSetting();
  if (!setting) return "";

  try {
    const complete = await $fetch("/api/chat/completions", {
      method: "post",
      headers: store.getHeaders(setting),
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `"""\n${content}\n"""\n${i18n.t("titlePrompt")}`,
          },
        ],
      } as CreateChatCompletionRequest),
    });
    return complete.choices[0].message!.content.trim().replace(/\。$/, ""); // 移除末尾的句号
  } catch (error) {
    console.error(error);
  }
}

// 注册全局快捷键
// 中文文档：https://github.com/jaywcjlove/hotkeys/blob/master/README-zh.md

hotkeys.filter = () => true; // input、textarea、select 组件默认不响应快捷键，true 表示启用快捷键

// Option + R 开始新话题
hotkeys("option+r", (e) => {
  e.preventDefault();

  if (!store.messages.length) return;
  if (!store.chat) return;

  store.setNotActiveDbMessages();
  store.getChatMessages(store.chat.id);

  alert(i18n.t("newTopicAlert"));
});

// Option + Shift + R 清空聊天记录
hotkeys("option+shift+r", (e) => {
  e.preventDefault();

  if (!store.messages.length) return;
  if (!store.chat) return;

  store.clearMessages(store.chat.id);
});

// Option + Shift + N 新建聊天
hotkeys("option+shift+n", (e) => {
  e.preventDefault();
  store.createChat();
});

// Option + W 删除聊天
hotkeys("option+w", (e) => {
  e.preventDefault();

  if (!store.chat) return;

  store.removeChat(store.chat.id);
});
</script>

<style>
/* for Mobile height issue */
.h-screen {
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: 100dvh;
}
</style>
