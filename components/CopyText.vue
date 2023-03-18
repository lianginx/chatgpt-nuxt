<script setup lang="ts">
import { Copy, Loading, CheckOne, CloseOne } from "@icon-park/vue-next";
import type { Icon, Theme } from "@icon-park/vue-next/lib/runtime";

const porps = defineProps<{ content: string }>();
const currentIcon = ref<Icon>(Copy);
const btnTips = {
  "icon-copy": "复制全文",
  "icon-loading": "",
  "icon-check-one": "已复制到剪贴板！",
  "icon-close-one": "复制失败！",
};

const copyToClipboard = (content: string = porps.content) => {
  currentIcon.value = Loading;
  navigator.clipboard
    .writeText(content)
    .then(() => setTimeout(() => (currentIcon.value = CheckOne), 100))
    .catch(() => (currentIcon.value = CloseOne))
    .finally(() => setTimeout(() => (currentIcon.value = Copy), 1500));
};
</script>

<template>
  <div class="flex items-center cursor-pointer" @click="copyToClipboard()">
    <component
      :class="currentIcon.name === 'icon-loading' ? 'animate-spin' : null"
      :is="currentIcon"
      size="15"
      fill="#999"
      theme="outline"
    />
    <div class="text-xs ml-0.5 text-gray-500 leading-none">
      {{ btnTips[currentIcon.name] }}
    </div>
  </div>
</template>
