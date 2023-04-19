import { H3Event } from "h3";
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
  const { cipherAPIKey, model, request } = body;

  const apiKey = aesCrypto({ message: cipherAPIKey, type: "de" });
  const openai = new OpenAIApi(new Configuration({ apiKey }));

  const requestConfig: AxiosRequestConfig = {
    responseType: "stream",
    timeout: 1000 * 20,
    timeoutErrorMessage: "**网络连接超时，请重试**",
    // 使用代理，配置参考 https://axios-http.com/docs/req_config
    // proxy: {
    //   protocol: "http",
    //   host: "127.0.0.1",
    //   port: 7890,
    // },
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

function setResStatus(event: H3Event, code: number, message: string) {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
}
