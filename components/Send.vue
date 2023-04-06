<script setup lang="ts">
defineProps<{
  isTalking: boolean;
}>();
</script>

<template>
  <div>
    <button class="p-2 rounded-full cursor-pointer" :disabled="isTalking">
      <IconSend
        :class="['w-6 h-6', isTalking ? 'text-slate-300' : 'text-blue-600']"
      />
      <span class="sr-only">发送</span>
    </button>
  </div>
</template>
