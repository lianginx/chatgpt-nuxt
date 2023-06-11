<template>
  <div class="pt-2 border-t">
    <div
      class="bar-btn dark:hover:text-gray-600"
      v-for="item in funcs"
      :key="item.type"
      @click="clickBtn(item.type)"
    >
      <component :is="item.icon" />
      <div>{{ $t(`FuncBar.${item.type}`) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Setting, Github, Router, Target } from "@icon-park/vue-next";
import { useChatStore } from "@/stores/chat";

const store = useChatStore();
const funcs = [
  { type: "chat", icon: Plus },
  { type: "setting", icon: Setting },
  { type: "github", icon: Github },
];

async function clickBtn(type: string) {
  if (type === "chat") {
    store.createChat();
    toggleSideBar();
  } else if (type === "setting") {
    store.showSetting = true;
    toggleSideBar();
  } else if (type === "github") {
    open("https://github.com/lianginx/chatgpt-nuxt", "_blank");
  }
}
</script>

<style scoped></style>
