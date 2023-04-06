<script setup lang="ts">
import { useChatStore } from "~~/stores/chat";
import { ChatMessageEx } from "~~/types";

const store = useChatStore();
const messagesDom = ref<HTMLDivElement>();

store.$subscribe(
  () =>
    nextTick(() => {
      if (!messagesDom.value) return;
      messagesDom.value.scrollTop = messagesDom.value.scrollHeight;
    }),
  { flush: "post", immediate: true }
);

const mdContent = (item: ChatMessageEx) => {
  return item.role === "assistant"
    ? item.content + (item.errorMessage ?? "")
    : item.content;
};
</script>

<template>
  <div
    ref="messagesDom"
    class="flex-1 flex flex-col mt-3 overflow-y-scroll scroll-smooth"
  >
    <div class="mx-4 my-2" v-for="item in store.messages">
      <div
        class="flex justify-center mb-6"
        v-if="item.role === 'system' && item.show"
      >
        <div
          class="w-4/5 p-2 bg-slate-100 text-xs text-slate-500 border rounded-lg"
        >
          {{ item.content }}
        </div>
      </div>
      <div
        class="flex justify-start"
        :class="item.role === 'user' ? 'flex-row-reverse' : ''"
        v-else
      >
        <Avatar
          :class="item.role === 'user' ? 'ml-3 sm:ml-4' : 'mr-3 sm:mr-4'"
          :role="item.role"
        />
        <div class="group max-w" v-if="mdContent(item)">
          <div
            class="prose break-words px-3 py-2 rounded-lg text-sm sm:text-base"
            :class="
              item.role === 'user'
                ? 'bg-blue-500 text-white prose-invert'
                : 'bg-slate-50 text-slate-700'
            "
            v-html="md.render(mdContent(item))"
          />
          <div class="flex mt-1.5 visible sm:invisible group-hover:visible">
            <CopyText :content="mdContent(item)" />
          </div>
        </div>
        <Loding v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.max-w {
  max-width: 85%;
}
</style>
