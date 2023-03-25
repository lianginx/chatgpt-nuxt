<script setup lang="ts">
import { ChatMessage } from "~~/types";

const props = defineProps<{ message: ChatMessage }>();
const mdContent = computed(() => md.render(props.message.content));
</script>

<template>
  <div
    class="flex mx-4 mb-3"
    :class="message.role === 'user' ? 'flex-row-reverse' : ''"
  >
    <Avatar
      :class="message.role === 'user' ? 'ml-3 sm:ml-4' : 'mr-3 sm:mr-4'"
      :role="message.role"
    />
    <div class="group max-w" v-if="message.content">
      <div
        class="prose break-words px-3 py-2 rounded-xl text-sm sm:text-base"
        :class="
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-slate-50 text-slate-700'
        "
        v-html="mdContent"
      />
      <div class="flex mt-1.5 visible sm:invisible group-hover:visible">
        <CopyText :content="message.content" />
      </div>
    </div>
    <Loding v-else />
  </div>
</template>

<style scoped>
.max-w {
  max-width: 95%;
}
</style>
