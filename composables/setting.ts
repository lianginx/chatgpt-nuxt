import { ChatSettingItem, ChatSettingOption } from "@/types";

const key = "chatSetting";

export function saveSetting(setting: ChatSettingOption) {
  localStorage.setItem(key, JSON.stringify({ ...setting }));
}

export function loadSetting(): ChatSettingItem {
  return JSON.parse(localStorage.getItem(key) ?? "null");
}
