import type { ChatMessageExItem } from "~/types";

export interface ChatPromptCategoryItem extends ChatPromptCategoryOption {
  id: number;
}

export interface ChatPromptCategoryOption {
  name: string;
  order: number;
}

export interface ChatPromptItem extends ChatPromptOption {
  id: number;
}

export interface ChatPromptOption {
  promptCategoryId: ChatPromptCategoryItem["id"];
  name: string;
  order: number;
  message: ChatMessageExItem;
}
