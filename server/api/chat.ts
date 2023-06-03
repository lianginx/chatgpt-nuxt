import { H3Event } from "h3";
import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest,
} from "openai";
import { OpenAIApi, Configuration } from "openai";
import { aesCrypto } from "@/server/api/crypto";
import { AxiosRequestConfig } from "axios";
import { ApiRequest, ChatModel } from "@/types";

const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as ApiRequest;
    const complete = await hiOpenAPI(body);

    setResStatus(event, complete.status, complete.statusText);
    return complete.data;
  } catch (e: any) {
    // 很奇怪，在我的 mac 开发环境中报错时，response 永远是一个 Stream 对象
    // 但是在 Windows 开发环境和 Docker 中报错时，response 却是 undefined
    if (e.response?.data) {
      setResStatus(event, e.response.status, e.response.data.statusText);

      let isStreamNull = true; // mac 开发环境中上，response 永远不是 undefined

      for await (const data of e.response.data) {
        isStreamNull = false;
        const message = data.toString();
        try {
          const parsed = JSON.parse(message);
          return parsed;
        } catch (error) {
          return message;
        }
      }

      if (isStreamNull) {
        return e;
      }
    } else {
      return e;
    }
  }
});

async function hiOpenAPI(body: ApiRequest) {
  const useEnv = runtimeConfig.public.useEnv === "yes";

  const apiType = useEnv ? runtimeConfig.public.apiType : body.apiType;
  const apiKey = useEnv
    ? runtimeConfig.apiKey
    : aesCrypto({ message: body.cipherAPIKey, type: "de" });
  const apiHost = useEnv ? runtimeConfig.apiHost : body.apiHost;
  const azureApiVersion = useEnv
    ? runtimeConfig.azureApiVersion
    : body.azureApiVersion;
  const azureGpt35DeploymentId = useEnv
    ? runtimeConfig.azureGpt35DeploymentId
    : body.azureGpt35DeploymentId;
  const azureGpt4DeploymentId = useEnv
    ? runtimeConfig.azureGpt4DeploymentId
    : body.azureGpt4DeploymentId;

  const { model, request } = body;

  // Identify the model ID of the Azure OpenAI Service from the OpenAI model name
  let azureDeploymentId = "";
  if (model === "chat") {
    switch ((request as CreateChatCompletionRequest).model as ChatModel) {
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
  const openai = new OpenAIApi(
    new Configuration({
      apiKey,
      ...azureOptions,
    })
  );

  const requestConfig: AxiosRequestConfig = {
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

  switch (model) {
    case "models":
      switch (apiType) {
        // Fetch available models from OpenAI API
        case "openai":
          return openai.listModels();

        // Generate response compatible with the list of models response from the OpenAI API.
        case "azure":
          const gpt35ModelData = {
            id: "gpt-3.5-turbo",
            object: "model",
            owned_by: "",
            permission: [],
          };
          const gpt4ModelData = {
            id: "gpt-4",
            object: "model",
            owned_by: "",
            permission: [],
          };
          const availableModels = [gpt35ModelData];
          if (azureGpt4DeploymentId) {
            availableModels.push(gpt4ModelData);
          }

          // Generate response compatible with openai.ListModelsResponse
          const responseData = {
            data: availableModels,
            object: "list",
          };

          // Generate response compatible with AxiosResponse
          return {
            data: responseData,
            status: 200,
            statusText: "OK",
            config: {},
            request: {},
          };

        // Unknown API Type
        default:
          // Generate error response compatible with AxiosResponse
          return {
            data: {},
            status: 400,
            statusText: "Bad Request",
            config: {},
            request: {},
          };
      }
    case "chat":
      return openai.createChatCompletion(
        request as CreateChatCompletionRequest,
        requestConfig
      );
    case "text":
      return openai.createCompletion(
        request as CreateCompletionRequest,
        requestConfig
      );
    case "img":
      return openai.createImage(request as CreateImageRequest, requestConfig);
  }
}

function setResStatus(event: H3Event, code: number, message: string) {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
}
