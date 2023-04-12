<template>
  <div class="flex w-screen h-screen overflow-hidden text-slate-700">
    <ChatSideBar />
    <ChatSetting class="flex-1" v-if="store.showSetting" />
    <ChatContentBar class="flex-1" v-else />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import { ApiRequest } from "@/types";

const store = useChatStore();

// 页面初始化
onMounted(async () => {
  if (!loadSetting()) store.showSetting = true;
  await store.setNotActiveDbMessages();
  await store.getAllChats();
});

// 自动生成聊天标题
watch(
  () => store.standardList,
  async (newValue, oldValue) => {
    if (newValue.length !== 1 || oldValue.length !== 0) return;
    if (!store.chat?.id) return;

    const title = await generateChatTitle(newValue[0].content);
    store.reChatName(store.chat.id, title);
  }
);

async function generateChatTitle(content: string) {
  const setting = loadSetting();
  if (!setting) return "";

  const complete = await $fetch("/api/chat", {
    method: "post",
    body: JSON.stringify({
      cipherAPIKey: setting.apiKey,
      model: "chat",
      request: {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `"""\n${content}\n"""\n限定10个字以内总结上面的内容作为标题，不要使用符号，开始总结：`,
          },
        ],
      },
    } as ApiRequest),
  });

  return complete.choices[0].message.content.trim().replace(/\。$/, ""); // 移除末尾的句号
}
</script>

<style></style>
