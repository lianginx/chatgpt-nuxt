import { H3Event, sendStream } from "h3";
import { ChatRequest } from "~~/types";
import axios from "axios";

export default defineEventHandler((event) => chat(event));

const chat = async (event: H3Event) => {
  try {
    const { apiKey, messages } = (await readBody(event)) as ChatRequest;

    // AES 解密 API Key
    const decrypt = await $fetch("/api/crypto", {
      method: "post",
      params: { message: apiKey, type: "de" },
    });
    if (!decrypt) {
      throw new Error("API Key decrypt fail");
    }

    // 调用 API 发送请求
    const complete = await axios({
      url: "https://api.openai.com/v1/chat/completions",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decrypt}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        messages,
        stream: true,
      },
      responseType: "stream",
    });

    return sendStream(event, complete.data);
  } catch (e: any) {
    setResponseStatus(e.status);
    return e;
  }
};
