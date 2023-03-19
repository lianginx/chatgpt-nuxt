<script setup lang="ts">
import { ChatMessage } from "~~/types";

const props = defineProps<{ message: ChatMessage }>();
const mdContent = computed(() => md.render(props.message.content));
</script>

<template>
  <div class="flex mx-4 mb-4 ">
    <Avatar
      class="mr-3 sm:mr-4"
      :role="message.role"
      v-show="message.role !== 'user'"
    />
    <div
      class="prose break-words px-3 py-2 rounded-lg text-sm sm:text-base"
      :class="
        message.role === 'user'
          ? 'ml-auto bg-blue-500 text-white prose-invert'
          : 'mr-auto bg-slate-50 text-slate-700 '
      "
      v-if="message.content"
      v-html="mdContent"
    ></div>
    <Loding v-else />
    <Avatar
      class="ml-3 sm:ml-4"
      :role="message.role"
      v-show="message.role === 'user'"
    />
  </div>
</template>

<style scoped>
.prose{
  max-width: 85%;
}
</style>
