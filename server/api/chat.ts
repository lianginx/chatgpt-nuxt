import { H3Event, sendStream } from "h3";
import { ChatRequest } from "@/types";
import { OpenAIApi, Configuration } from "openai";

export default defineEventHandler((event) => chat(event));

async function chat(event: H3Event) {
  try {
    const { apiKey, messages, temperature } = (await readBody(
      event
    )) as ChatRequest;

    // AES 解密 API Key
    const decrypt = await $fetch("/api/crypto", {
      method: "post",
      params: { message: apiKey },
    });

    // 初始化 API
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: decrypt ?? "",
      })
    );

    // 发送请求
    const complete = await openai.createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages,
        temperature,
        stream: true,
      },
      {
        responseType: "stream",
        timeout: 1000 * 20,
        timeoutErrorMessage: "**网络连接超时，请重试**",
      }
    );

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
}

const setResStatus = (event: H3Event, code: number, message: string) => {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
};
