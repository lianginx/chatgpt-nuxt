import { ChatSetting } from "~/types";

const key = "chatSetting";

export const saveSetting = (setting: ChatSetting) => {
  localStorage.setItem(key, JSON.stringify({ ...setting }));
};

export const loadSetting = (): ChatSetting => {
  return JSON.parse(localStorage.getItem(key) ?? "null");
};
