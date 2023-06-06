import { RequestHeaders } from "h3";
import { ApiType } from "@/types";
import { errorHandler, setResStatus } from "~/server/utils/h3";
import { getOpenAIApiInstance } from "../utils/openai";

const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const response = await listModels(headers);

    setResStatus(event, response.status, response.statusText);
    return response.data;
  } catch (e: any) {
    await errorHandler(event, e);
  }
});

async function listModels(headers: RequestHeaders) {
  const openai = getOpenAIApiInstance("models", headers);

  const useEnv = runtimeConfig.public.useEnv === "yes";
  const apiType = useEnv
    ? runtimeConfig.public.apiType
    : (headers["x-api-type"] as ApiType);
  const azureGpt4DeploymentId = useEnv
    ? runtimeConfig.azureGpt4DeploymentId
    : headers["x-azure-gpt4-deployment-id"]!;

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
}
