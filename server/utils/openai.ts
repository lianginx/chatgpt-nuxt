import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { RequestHeaders } from "h3";
import { aesCrypto } from "~/server/api/crypto.post";
import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { ApiRequest, ApiRequestModel, ApiType, ChatModel } from "~/types";

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

  // Identify the model ID of the Azure OpenAI Service from the OpenAI model name
  let azureDeploymentId = "";
  if (model === "chat") {
    switch ((body as CreateChatCompletionRequest).model as ChatModel) {
      case "gpt-3.5-turbo":
        azureDeploymentId = azureGpt35DeploymentId;
        break;
      case "gpt-4":
        azureDeploymentId = azureGpt4DeploymentId;
        break;
    }
  } else if (model === "text") {
    // TODO: Support completion model
  } else if (model === "img") {
    // TODO: Support DALL-E model
  }

  const azureOptions =
    apiType === "azure"
      ? {
          basePath: `${apiHost}/openai/deployments/${azureDeploymentId}`,
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

function createAxiosInstance() {
  const axiosRequestConfig: AxiosRequestConfig = {
    responseType: "stream",
    timeout: 1000 * 20,
    timeoutErrorMessage: "**Network connection timed out. Please try again**",
    // 使用代理，配置参考 https://axios-http.com/docs/req_config
    // proxy: {
    //   protocol: "http",
    //   host: "127.0.0.1",
    //   port: 7890,
    // },
  };

  function onRequest(config: AxiosRequestConfig) {
    logger("onRequest", `[${config.method?.toUpperCase()}]`, config.url);
    return config;
  }

  function onResponse(response: AxiosResponse) {
    logger(
      "onResponse",
      `[${response.config.method?.toUpperCase()}]`,
      response.config.url,
      response.status,
      response.statusText
    );
    return response;
  }

  function onRequestError(error: any) {
    logger("onRequestError", error);
    return error;
  }

  function onResponseError(error: any) {
    logger("onResponseError", error);
    return error;
  }

  const axiosInstance = axios.create(axiosRequestConfig);
  axiosInstance.interceptors.request.use(
    (config) => onRequest(config) || config
  );
  axiosInstance.interceptors.response.use(
    (response) => onResponse(response) || response
  );
  axiosInstance.interceptors.request.use(
    undefined,
    (error) => onRequestError(error) || Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    undefined,
    (error) => onResponseError(error) || Promise.reject(error)
  );

  return axiosInstance;
}

export function getOpenAIApiInstance(
  model: ApiRequestModel,
  headers: RequestHeaders,
  body?: ApiRequest
) {
  const configuration = createOpenAIConfiguration(model, headers, body);
  const axiosInstance = createAxiosInstance();
  return new OpenAIApi(configuration, undefined, axiosInstance);
}
