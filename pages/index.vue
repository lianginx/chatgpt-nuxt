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

    const title = await generateChatTitle(
      `"""\n${newValue[0].content}\n"""\n将以上内容总结为简短的标题：`
    );

    store.reChatName(store.chat.id, title);
  }
);

async function generateChatTitle(
  prompt: string,
  content: string = ""
): Promise<string> {
  const setting = loadSetting();
  if (!setting) return "";

  const complete = await fetch("/api/chat", {
    method: "post",
    body: JSON.stringify({
      cipherAPIKey: setting.apiKey,
      model: "text",
      request: {
        model: "text-davinci-003",
        prompt,
      },
    } as ApiRequest),
  });

  const data = await complete.json();

  prompt += data.choices[0].text;
  content += data.choices[0].text;

  if (data.choices[0].finish_reason === "stop") {
    return content.replace("\n\n", "");
  }

  return await generateChatTitle(prompt, content);
}
</script>

<style></style>
