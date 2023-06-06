import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest,
} from "openai";

export type ApiRequestModel = "models" | "chat" | "text" | "img";

export type ApiRequest =
  | CreateChatCompletionRequest
  | CreateCompletionRequest
  | CreateImageRequest;
