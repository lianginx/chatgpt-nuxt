<template>
  <div class="pt-2 b-slate border-t">
    <div
      class="bar-btn"
      v-for="item in funcs"
      :key="item.type"
      @click="clickBtn(item.type)"
    >
      <component :is="item.icon" />
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Setting, Github, Router, Target } from "@icon-park/vue-next";
import { useChatStore } from "~~/stores/chat";

const store = useChatStore();
const funcs = [
  { name: "新建聊天", type: "chat", icon: Plus },
  { name: "设置", type: "setting", icon: Setting },
  { name: "查看项目", type: "github", icon: Github },
];

const clickBtn = async (type: string) => {
  if (type === "chat") {
    store.createChat();
  } else if (type === "setting") {
    store.showSetting = true;
  } else if (type === "github") {
    open("https://github.com/lianginx/chatgpt-nuxt", "_blank");
  }
};
</script>

<style scoped></style>
