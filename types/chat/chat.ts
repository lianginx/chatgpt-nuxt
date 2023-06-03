import { ChatPromptCategoryItem, ChatSettingItem } from "@/types";

export type ChatModel = "gpt-3.5-turbo" | "gpt-4" | "dall-e";

export interface ChatItem extends ChatOption {
  id: number;
}

export interface ChatOption {
  promptId?: ChatPromptCategoryItem["id"];
  settingId?: ChatSettingItem["id"];
  name: string;
  model?: ChatModel;
  order: number;
}
