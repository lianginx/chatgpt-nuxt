<script setup lang="ts">
import { Copy, CheckOne } from "@icon-park/vue-next";

const porps = defineProps<{ content: string }>();
const copyStatus = ref(false);
const size = 14;

const copyToClipboard = (content: string = porps.content) => {
  navigator.clipboard
    .writeText(content)
    .then(() => (copyStatus.value = true))
    .finally(() => setTimeout(() => (copyStatus.value = false), 1500));
};
</script>

<template>
  <div class="icon" v-show="!copyStatus" @click="copyToClipboard()">
    <Copy :size="size" />
    <span>复制全文</span>
  </div>
  <div class="icon" v-show="copyStatus" @click="copyToClipboard()">
    <CheckOne class="text-blue-700" :size="size" />
    <span>复制成功</span>
  </div>
</template>

<style scoped>
.icon {
  @apply flex items-center cursor-pointer text-xs space-x-0.5 text-slate-500;
}
</style>
