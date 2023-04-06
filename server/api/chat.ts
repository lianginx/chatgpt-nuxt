import { H3Event, sendStream } from "h3";
import { ChatRequest } from "~~/types";
import { AxiosRequestConfig } from "axios";
import { OpenAIApi, Configuration, CreateChatCompletionRequest } from "openai";

export default defineEventHandler((event) => chat(event));

const chat = async (event: H3Event) => {
  try {
    const { apiKey, messages, temperature } = (await readBody(
      event
    )) as ChatRequest;

    // AES 解密 API Key
    // const decrypt = await $fetch("/api/crypto", {
    //   method: "post",
    //   params: { message: apiKey, type: "de" },
    // });

    // 调用 API 发送请求
    const config = new Configuration({ apiKey });
    const openai = new OpenAIApi(config);

    const request: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages,
      temperature,
      stream: true,
    };

    const option: AxiosRequestConfig = {
      responseType: "stream",
      timeout: 1000 * 20, // 读取流事件时，到达设定时间会中断连接
      timeoutErrorMessage: "**网络连接超时，请重试**",
    };

    const complete = await openai.createChatCompletion(request, option);

    // 向客户端转发流事件
    setResStatus(event, complete.status, complete.statusText);
    return sendStream(event, complete.data);
  } catch (e: any) {
    if (e.response) {
      setResStatus(
        event,
        e.response.data.statusCode,
        e.response.data.statusText
      );
      return sendStream(event, e.response.data);
    } else {
      return e;
    }
  }
};

const setResStatus = (event: H3Event, code: number, message: string) => {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
};
