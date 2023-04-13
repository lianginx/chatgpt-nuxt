<template>
  <div
    class="flex justify-center items-center z-10 w-full h-full bg-black bg-opacity-30"
  >
    <div class="w-5/6 sm:w-3/6 bg-white rounded-lg">
      <div class="flex justify-between p-3 sm:p-4 border-b border-slate-100">
        <div>全局快捷键</div>
        <div class="cursor-pointer" @click="store.showHelp = false">X</div>
      </div>
      <div class="flex flex-col px-2 sm:px-6 py-6">
        <div class="space-y-4">
          <div class="flex items-baseline" v-for="item of hotkeys">
            <div class="w-24 text-right mr-2">{{ item.name }}</div>
            <div class="flex flex-col space-y-2">
              <div class="flex" v-for="keys of item.keys">
                <div v-for="(key, index) of keys">
                  <span v-if="index">+</span>
                  <code>{{ key }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-6 sm:mt-8">
          <button
            class="self-center text-xs sm:text-sm px-4 py-1.5 rounded-md bg-blue-700 text-white active:bg-blue-800"
            @click="store.showHelp = false"
          >
            我知道了!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/chat";

const store = useChatStore();

const hotkeys: {
  name: string;
  keys: ("Option" | "Shift" | "Alt" | "N" | "W" | "R")[][];
}[] = [
  {
    name: "新建聊天",
    keys: [
      ["Option", "Shift", "N"],
      ["Alt", "Shift", "N"],
    ],
  },
  {
    name: "删除聊天",
    keys: [
      ["Option", "W"],
      ["Alt", "W"],
    ],
  },
  {
    name: "开始新话题",
    keys: [
      ["Option", "R"],
      ["Alt", "R"],
    ],
  },
  {
    name: "清空聊天记录",
    keys: [
      ["Option", "Shift", "R"],
      ["Alt", "Shift", "R"],
    ],
  },
];
</script>

<style scoped>
code {
  @apply text-[10px] sm:text-xs text-slate-700 bg-slate-100 border px-1.5 py-0.5 mx-2 rounded;
}
</style>
