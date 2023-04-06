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
import { Plus, Setting } from "@icon-park/vue-next";
import { useChatStore } from "~~/stores/chat";

const store = useChatStore();
const funcs = [
  { name: "新建聊天", type: "chat", icon: Plus },
  { name: "设置", type: "setting", icon: Setting },
];

const clickBtn = async (type: string) => {
  if (type === "chat") {
    store.createChat();
  } else if (type === "setting") {
    store.showSetting = true;
  }
};
</script>

<style scoped></style>
