import { RequestHeaders } from "h3";
import { aesCrypto } from "~/server/api/crypto.post";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { ApiRequest, ApiRequestModel, ApiType, ChatModel } from "~/types";
import { createAxiosInstance } from "./axios";
import { AzureOpenAIApi } from "./azure";

const runtimeConfig = useRuntimeConfig();

function createOpenAIConfiguration(
  model: ApiRequestModel,
  headers: RequestHeaders,
  body?: ApiRequest
) {
  const useEnv = runtimeConfig.public.useEnv === "yes";

  const apiType = useEnv
    ? runtimeConfig.public.apiType
    : (headers["x-api-type"] as ApiType);
  const apiKey = useEnv
    ? runtimeConfig.apiKey
    : aesCrypto({ message: headers["x-cipher-api-key"]!, type: "de" });
  const apiHost = useEnv ? runtimeConfig.apiHost : headers["x-api-host"];
  const azureApiVersion = useEnv
    ? runtimeConfig.azureApiVersion
    : headers["x-azure-api-version"];
  const azureGpt35DeploymentId = useEnv
    ? runtimeConfig.azureGpt35DeploymentId
    : headers["x-azure-gpt35-deployment-id"]!;
  const azureGpt4DeploymentId = useEnv
    ? runtimeConfig.azureGpt4DeploymentId
    : headers["x-azure-gpt4-deployment-id"]!;

  // Identify the basePath of the Azure OpenAI Service from the OpenAI model name
  let basePath = `${apiHost}/openai`;
  if (model === "chat") {
    let azureDeploymentId = "";
    switch ((body as CreateChatCompletionRequest).model as ChatModel) {
      case "gpt-3.5-turbo":
        azureDeploymentId = azureGpt35DeploymentId;
        break;
      case "gpt-4":
        azureDeploymentId = azureGpt4DeploymentId;
        break;
    }
    basePath += `/deployments/${azureDeploymentId}`;
  } else if (model === "text") {
    // TODO: Support completion model
  }

  const azureOptions =
    apiType === "azure"
      ? {
          basePath,
          baseOptions: {
            headers: { "api-key": apiKey },
            params: {
              "api-version": azureApiVersion,
            },
          },
        }
      : {};

  return new Configuration({
    apiKey,
    ...azureOptions,
  });
}

export function getOpenAIApiInstance(
  model: ApiRequestModel,
  headers: RequestHeaders,
  body?: ApiRequest
) {
  const configuration = createOpenAIConfiguration(model, headers, body);
  const axiosInstance = createAxiosInstance();

  const useEnv = runtimeConfig.public.useEnv === "yes";
  const apiType = useEnv
    ? runtimeConfig.public.apiType
    : (headers["x-api-type"] as ApiType);

  if (apiType === "azure") {
    return new AzureOpenAIApi(configuration, undefined, axiosInstance);
  } else {
    return new OpenAIApi(configuration, undefined, axiosInstance);
  }
}
