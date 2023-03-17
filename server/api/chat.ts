import { H3Event } from "h3";
import { OpenAIApi, Configuration } from "openai";
import { ChatResponse, ChatRequest } from "~~/types";
import { checkAPIKeyError, checkChatMessagesError } from "~~/utils/check";

export default defineEventHandler((event) => chatComplete(event));

const chatComplete = async (event: H3Event): Promise<ChatResponse> => {
  try {
    const { apiKey, messages } = (await readBody(event)) as ChatRequest;

    checkAPIKeyError(apiKey);
    checkChatMessagesError(messages);

    const complete = await new OpenAIApi(
      new Configuration({ apiKey })
    ).createChatCompletion(
      {
        model: "gpt-3.5-turbo",
        messages,
      },
      {
        timeout: 1000 * 60 * 3,
        timeoutErrorMessage: "服务器响应过慢，请稍后再试",
      }
    );
    return { status: "success", data: complete.data.choices[0].message };
  } catch (e: any) {
    return {
      status: "error",
      message: e.response ? e.response.data.error.message : e.message,
    };
  }
};
