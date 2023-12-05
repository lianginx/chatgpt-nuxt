import type { ChatSettingItem, ChatSettingOption } from "~/types";

const key = "chatSetting";

export async function saveSetting(setting: ChatSettingOption) {
  const oldSetting = loadSetting();

  if (
    (!oldSetting && setting.apiKey) ||
    (oldSetting?.apiKey && oldSetting?.apiKey !== setting.apiKey) // 处理之前明文储存 API Key 的过度方法
  ) {
    const encrypt = await $fetch("/api/crypto", {
      method: "post",
      body: { message: setting.apiKey, type: "en" },
    });
    setting.apiKey = encrypt;
  }

  localStorage.setItem(key, JSON.stringify({ ...setting }));
}

export function loadSetting(): ChatSettingItem | undefined {
  const settingString = localStorage.getItem(key);
  if (settingString) {
    return JSON.parse(settingString);
  }
}
