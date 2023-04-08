<template>
  <div class="flex-1 flex flex-col p-6 space-y-6">
    <div>
      <label>API Key</label>
      <input
        type="password"
        placeholder="请输入"
        v-model.trim="setting.apiKey"
      />
    </div>
    <div>
      <label class="space-x-3">
        <span>temperature</span><span>{{ setting.temperature }}</span>
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
      <button @click="saveSetting(setting)">保存</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatSettingOption } from "@/types";

const setting = ref<ChatSettingOption>({
  apiKey: "",
  temperature: 1,
  type: "global",
});

onMounted(() => {
  setting.value = loadSetting() ?? setting.value;
});
</script>

<style scoped>
label {
  @apply block mb-2 text-sm font-medium text-gray-900;
}

input[type="password"],
input[type="text"] {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
}

input[type="range"] {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

button {
  @apply text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center;
}
</style>
