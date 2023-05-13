<template>
  <div class="flex flex-col p-6 space-y-6">
    <div>
      <label>{{ $t("ChatSetting.apiKey.label") }}</label>
      <input
        type="password"
        :placeholder="$t('ChatSetting.apiKey.placeholder')"
        v-model.trim="setting.apiKey"
      />
    </div>
    <div>
      <label class="space-x-3">
        <span>{{ $t("ChatSetting.temperature") }}</span>
        <span>{{ setting.temperature }}</span>
      </label>
      <input
        type="range"
        v-model.number="setting.temperature"
        min="0"
        max="2"
        step="0.1"
      />
    </div>
    <div>
      <label class="space-x-3">
        <span>{{ $t("ChatSetting.language") }}</span>
      </label>
      <select v-model="setting.locale">
        <option v-for="locale in availableLocales" :value="locale.code">
          {{ locale.name }}
        </option>
      </select>
    </div>
    <div class="space-x-3">
      <button class="main-button" @click="save">
        {{ $t("ChatSetting.save") }}
      </button>
      <button class="second-button" @click="store.showSetting = false">
        {{ $t("ChatSetting.back") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatSettingOption } from "@/types";
import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
import { useChatStore } from "~/stores/chat";

const store = useChatStore();
const i18n = useI18n();
const availableLocales = i18n.locales.value as LocaleObject[];

const setting = ref<ChatSettingOption>({
  apiKey: "",
  temperature: 1,
  locale: i18n.getBrowserLocale()!,
  type: "global",
});

onMounted(() => {
  setting.value = loadSetting() ?? setting.value;
});

async function save() {
  if (!setting.value.apiKey.trim()) return;
  store.showSetting = false;
  await saveSetting(setting.value);
  i18n.setLocale(store.getLocale());
  await store.openChat(store.chats[0]);
  await store.sendMessage({
    role: "user",
    content: i18n.t("ChatSetting.initialMessage"),
  });
}
</script>

<style scoped>
label {
  @apply block mb-2 text-sm font-medium text-gray-900;
}

input[type="password"],
input[type="text"],
select {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

input[type="range"] {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

button {
  @apply font-medium rounded-lg text-sm px-5 py-2.5 text-center;
}

.main-button {
  @apply text-white bg-blue-700 hover:bg-blue-800;
}

.second-button {
  @apply bg-white text-gray-900 hover:bg-gray-50 border shadow-sm;
}
</style>
