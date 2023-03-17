import { ChatCompletionResponseMessage } from "openai";

export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  role: Role;
  content: string;
}
export interface ChatRequest {
  apiKey: string;
  messages: ChatMessage[];
}

export type ChatResponseStatus = "success" | "error";

export interface ChatResponse {
  status: ChatResponseStatus;
  data?: ChatCompletionResponseMessage;
  message?: string;
}
