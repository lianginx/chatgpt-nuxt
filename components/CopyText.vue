<template>
  <span @click="copyToClipboard()">
    <div class="icon" v-show="!copyStatus">
      <Copy :size="size" />
      <span>复制全文</span>
    </div>
    <div class="icon" v-show="copyStatus">
      <CheckOne class="text-blue-700" :size="size" />
      <span>复制成功</span>
    </div>
  </span>
</template>

<script setup lang="ts">
import { Copy, CheckOne } from "@icon-park/vue-next";

const porps = defineProps<{ content: string }>();
const copyStatus = ref(false);
const size = 14;

function copyToClipboard(content: string = porps.content) {
  copyToClipboardEx(content)
    .then(() => (copyStatus.value = true))
    .finally(() => setTimeout(() => (copyStatus.value = false), 1500));
}

async function copyToClipboardEx(content: string = porps.content) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(content);
  } else {
    // 非 HTTPS 连接下无法使用 navigator.clipboard
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}
</script>

<style scoped>
.icon {
  @apply flex items-center cursor-pointer text-xs space-x-0.5 text-slate-500;
}
</style>
