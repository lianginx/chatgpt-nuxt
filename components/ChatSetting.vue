<template>
  <div class="flex flex-col p-6 space-y-6 overflow-y-scroll">
    <template v-if="useRuntimeConfig().public.useEnv === 'no'">
      <!-- API Type -->
      <div>
        <label>{{ $t("ChatSetting.apiType") }}</label>
        <div
          class="inline-flex p-1 pr-0 max-w-fit h-fit bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden"
        >
          <label
            v-for="apiType in apiTypes"
            :for="apiType.value"
            class="radio-switch block mb-0 px-4 py-1 w-24 rounded-lg cursor-pointer text-center dark:text-slate-300 hover:bg-gray-400 hover:text-white dark:hover:bg-gray-700 dark:hover:text-slate-300 mr-1"
            :class="
              setting.apiType === apiType.value
                ? 'bg-gray-500 dark:bg-gray-800 text-white dark:text-slate-300'
                : ''
            "
          >
            <input
              type="radio"
              class="hidden"
              v-model="setting.apiType"
              :id="apiType.value"
              :value="apiType.value"
            />
            {{ apiType.label }}
          </label>
        </div>
      </div>

      <!-- API Key -->
      <div>
        <label>{{ $t("ChatSetting.apiKey.label") }}</label>
        <input
          type="password"
          :placeholder="$t('ChatSetting.apiKey.placeholder')"
          v-model.trim="setting.apiKey"
        />
      </div>

      <template v-if="setting.apiType === 'azure'">
        <!-- API Host -->
        <div>
          <label>{{ $t("ChatSetting.apiHost.label") }}</label>
          <input
            type="text"
            :placeholder="$t('ChatSetting.apiHost.placeholder')"
            v-model.trim="setting.apiHost"
          />
        </div>

        <!-- Azure API Version -->
        <div>
          <label>{{ $t("ChatSetting.azureApiVersion.label") }}</label>
          <input
            type="text"
            :placeholder="$t('ChatSetting.azureApiVersion.placeholder')"
            v-model.trim="setting.azureApiVersion"
          />
        </div>

        <!-- Azure Deployment ID (GPT-3.5) -->
        <div>
          <label>{{ $t("ChatSetting.azureGpt35DeploymentId.label") }}</label>
          <input
            type="text"
            :placeholder="$t('ChatSetting.azureGpt35DeploymentId.placeholder')"
            v-model.trim="setting.azureGpt35DeploymentId"
          />
        </div>

        <!-- Azure Deployment ID (GPT-4) -->
        <div>
          <label>{{ $t("ChatSetting.azureGpt4DeploymentId.label") }}</label>
          <input
            type="text"
            :placeholder="$t('ChatSetting.azureGpt4DeploymentId.placeholder')"
            v-model.trim="setting.azureGpt4DeploymentId"
          />
        </div>
      </template>
    </template>

    <!-- temperature -->
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

    <!-- language -->
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

    <!-- action buttons -->
    <div>
      <label class="space-x-3">
        <span>{{ $t("ChatSetting.colorMode.label") }}</span>
      </label>
      <select v-model="setting.colorMode">
        <option value="system">{{ $t("ChatSetting.colorMode.system") }}</option>
        <option value="light">{{ $t("ChatSetting.colorMode.light") }}</option>
        <option value="dark">{{ $t("ChatSetting.colorMode.dark") }}</option>
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
import type { ApiType, ChatSettingOption } from "~/types";
import type { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
import { useChatStore } from "~/stores/chat";

const runtimeConfig = useRuntimeConfig();
const store = useChatStore();
const i18n = useI18n();
const availableLocales = i18n.locales.value as LocaleObject[];

const apiTypes = [
  { label: "OpenAI", value: "openai" },
  { label: "Azure", value: "azure" },
];

const useEnv = runtimeConfig.public.useEnv === "yes";
const setting = ref<ChatSettingOption>({
  apiType: useEnv ? (runtimeConfig.public.apiType as ApiType) : "openai",
  apiKey: useEnv ? undefined : "",
  apiHost: useEnv ? undefined : "",
  azureGpt35DeploymentId: useEnv ? undefined : "",
  azureGpt4DeploymentId: useEnv ? undefined : "",
  azureApiVersion: useEnv ? undefined : "2023-06-01-preview",
  temperature: useEnv ? Number(runtimeConfig.public.defaultTemperature) : 1,
  locale: i18n.getBrowserLocale()!,
  colorMode: "system",
  type: "global",
});

const colorMode = useColorMode();

onMounted(() => {
  setting.value = loadSetting() ?? setting.value;
});

async function save() {
  if (!useEnv && !setting.value.apiKey!.trim()) return;
  await saveSetting(setting.value);
  i18n.setLocale(store.getLocale());
  colorMode.preference = store.getColorMode();
  await store.getAvailableModels();

  // Open chat (not DALL-E chat)
  await store.openChat(
    store.chats.filter((chat) => {
      return chat.model !== "dall-e";
    })[0]
  );

  store.showSetting = false;
  await store.sendMessage({
    role: "user",
    content: i18n.t("ChatSetting.initialMessage"),
  });
}
</script>

<style scoped>
label:not(.radio-switch) {
  @apply block mb-2 text-sm font-medium text-gray-900 dark:text-slate-300;
}

input[type="password"],
input[type="text"],
select {
  @apply bg-gray-50 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-slate-300 dark:bg-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

input[type="range"] {
  @apply w-full h-2 bg-gray-200 dark:bg-gray-500 rounded-lg appearance-none cursor-pointer;
}

button {
  @apply font-medium rounded-lg text-sm px-5 py-2.5 text-center;
}

.main-button {
  @apply text-white dark:text-slate-300 bg-blue-700 hover:bg-blue-800;
}

.second-button {
  @apply bg-white dark:bg-slate-400 text-gray-900 hover:bg-gray-50 dark:hover:bg-slate-300 border shadow-sm;
}
</style>
