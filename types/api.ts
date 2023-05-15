import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest,
} from "openai";
import { ApiType } from "./chat";

export type ApiRequestModel = "chat" | "text" | "img";

export interface ApiRequest {
  apiType: ApiType;
  cipherAPIKey: string;
  apiHost: string;
  azureApiVersion: string;
  azureDeploymentId: string;
  model: ApiRequestModel;
  request:
    | CreateChatCompletionRequest
    | CreateCompletionRequest
    | CreateImageRequest;
}
