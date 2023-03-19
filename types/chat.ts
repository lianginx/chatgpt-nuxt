import { ChatCompletionResponseMessage } from "openai";
import { APIResponse } from "./index";

export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  role: Role;
  content: string;
}
export interface ChatRequest {
  apiKey: string;
  messages: ChatMessage[];
}

export interface ChatResponse extends APIResponse {
  data?: ChatCompletionResponseMessage;
}
