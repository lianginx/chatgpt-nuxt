import { H3Event, sendStream } from "h3";
import {
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  CreateImageRequest,
} from "openai";
import { OpenAIApi, Configuration } from "openai";
import { aesCrypto } from "@/server/api/crypto";
import { AxiosRequestConfig } from "axios";
import { ApiRequest } from "@/types";

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as ApiRequest;
    const complete = await hiOpenAPI(body);

    setResStatus(event, complete.status, complete.statusText);
    return sendStream(event, complete.data);
  } catch (e: any) {
    setResStatus(event, e.response.data.statusCode, e.response.data.statusText);
    return sendStream(event, e.response.data);
  }
});

async function hiOpenAPI(body: ApiRequest) {
  const { cipherAPIKey, model, request } = body;

  const apiKey = aesCrypto({ message: cipherAPIKey, type: "de" });
  const openai = new OpenAIApi(new Configuration({ apiKey }));

  const requestConfig: AxiosRequestConfig = {
    responseType: "stream",
    timeout: 1000 * 20,
    timeoutErrorMessage: "**网络连接超时，请重试**",
  };

  switch (model) {
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

const setResStatus = (event: H3Event, code: number, message: string) => {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
};
