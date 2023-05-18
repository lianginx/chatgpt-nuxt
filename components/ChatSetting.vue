<template>
  <div class="flex flex-col p-6 space-y-6">
    <template v-if="useRuntimeConfig().public.useEnv === 'no'">
      <!-- API Type -->
      <div>
        <label>{{ $t("ChatSetting.apiType") }}</label>
        <ul class="grid w-full gap-6 grid-cols-4">
          <li v-for="apiType in apiTypes">
            <input
              type="radio"
              v-model="setting.apiType"
              :id="apiType.value"
              name="apiType"
              :value="apiType.value"
              class="hidden peer"
              required
            />
            <label
              :for="apiType.value"
              class="inline-flex items-center text-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-blue-500 peer-checked:text-white hover:text-gray-600 hover:bg-gray-100"
            >
              {{ apiType.label }}
            </label>
          </li>
        </ul>
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

        <!-- Azure Deployment ID -->
        <div>
          <label>{{ $t("ChatSetting.azureDeploymentId.label") }}</label>
          <input
            type="text"
            :placeholder="$t('ChatSetting.azureDeploymentId.placeholder')"
            v-model.trim="setting.azureDeploymentId"
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
import { ApiType, ChatSettingOption } from "@/types";
import { LocaleObject } from "@nuxtjs/i18n/dist/runtime/composables";
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
  azureDeploymentId: useEnv ? undefined : "",
  azureApiVersion: useEnv ? undefined : "2023-05-15",
  temperature: useEnv ? Number(runtimeConfig.public.defaultTemperature) : 1,
  locale: i18n.getBrowserLocale()!,
  type: "global",
});

onMounted(() => {
  setting.value = loadSetting() ?? setting.value;
});

async function save() {
  if (!useEnv && !setting.value.apiKey!.trim()) return;
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
