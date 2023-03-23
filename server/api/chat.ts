import { H3Event, sendStream } from "h3";
import { ChatRequest } from "~~/types";
import { AxiosRequestConfig } from "axios";
import { OpenAIApi, Configuration, CreateChatCompletionRequest } from "openai";

export default defineEventHandler((event) => chat(event));

const chat = async (event: H3Event) => {
  const { apiKey, messages } = (await readBody(event)) as ChatRequest;

  // AES 解密 API Key
  const decrypt = await $fetch("/api/crypto", {
    method: "post",
    params: { message: apiKey, type: "de" },
  });

  // 调用 API 发送请求
  const config = new Configuration({ apiKey: decrypt ?? "" });
  const openai = new OpenAIApi(config);

  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  };

  const option: AxiosRequestConfig = {
    responseType: "stream",
    timeout: 20000, // 读取流事件时，到达设定时间会中断连接
    timeoutErrorMessage: "Network connection timeout with status code 408",
  };

  const complete = await openai.createChatCompletion(request, option);

  // 向客户端转发流事件
  return sendStream(event, complete.data);
};
