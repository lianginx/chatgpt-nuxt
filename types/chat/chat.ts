import {
  ChatPromptCategoryItem,
  ChatSettingItem,
  ChatSetting,
  ChatMessage,
} from "@/types";

export interface ChatItem extends ChatOption {
  id: number;
}

export interface ChatOption {
  promptId?: ChatPromptCategoryItem["id"];
  settingId?: ChatSettingItem["id"];
  name: string;
  order: number;
}

export interface ChatRequest extends ChatSetting {
  messages: ChatMessage[];
}
