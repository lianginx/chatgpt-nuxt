import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest,
} from "openai";
import { ApiType } from "./chat";

export type ApiRequestModel = "models" | "chat" | "text" | "img";

export interface ApiRequest {
  apiType: ApiType;
  cipherAPIKey: string;
  apiHost: string;
  azureApiVersion: string;
  azureGpt35DeploymentId: string;
  azureGpt4DeploymentId: string;
  model: ApiRequestModel;
  request:
    | CreateChatCompletionRequest
    | CreateCompletionRequest
    | CreateImageRequest;
}
