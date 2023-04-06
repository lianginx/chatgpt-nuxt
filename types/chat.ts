export type ChatRole = "user" | "assistant" | "system";

export type ChatSettingType = "default" | "global" | "chat";

export interface ChatSetting {
  id?: number;
  type: ChatSettingType;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatPromptCategory {
  id?: number;
  name: string;
  order?: number;
}

export interface ChatPrompt extends ChatMessageEx {
  id: number;
  promptCategoryId: number;
  name: string;
  order: number;
}

export interface Chat {
  id?: number;
  promptId?: number;
  settingId?: number;
  name: string;
  order?: number;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatMessageEx extends ChatMessage {
  id?: number;
  chatId?: number;
  active?: boolean;
  show?: boolean;
  error?: boolean;
  errorMessage?: string;
  sendDate?: number;
}

export interface sendDataOption {
  start?: number;
  end?: number;
}

export interface ChatMessageExOption {
  role?: ChatRole;
  content?: string | boolean;
  active?: boolean;
  show?: boolean;
  error?: boolean;
  errorMessage?: string;
  sendDate?: sendDataOption;
}

export interface ChatRequest {
  apiKey: string;
  messages: ChatMessage[];
  temperature: number;
}
