<script setup lang="ts">
const props = defineProps<{
  isTalking: boolean;
  isConfig: boolean;
}>();
const btnName = computed(() => (props.isConfig ? "保存" : "发送"));
</script>

<template>
  <div>
    <button class="p-2 rounded-full cursor-pointer" :disabled="isTalking">
      <IconSend
        class="w-6 h-6"
        :class="isTalking ? 'text-slate-300' : 'text-blue-600'"
      />
      <span class="sr-only"> {{ btnName }} </span>
    </button>
  </div>
</template>
