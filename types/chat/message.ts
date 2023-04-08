import { ChatItem } from "@/types";

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageExItem extends ChatMessageExOption {
  id: number;
}

export interface ChatMessageExOption extends ChatMessage {
  chatId?: ChatItem["id"];
  active?: boolean;
  show?: boolean;
  error?: boolean;
  errorMessage?: string;
  sendDate?: number;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
