import { ChatMessage } from "@/types";

export const checkAPIKeyError = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API Key 不能为空");
  }
  if (apiKey.slice(0, 3) !== "sk-" || apiKey.length !== 51) {
    throw new Error("API Key 错误，请检查后重试");
  }
};

export const checkChatMessagesError = (messages: ChatMessage[]) => {
  if (!messages.length) {
    throw new Error("消息队列不能为空");
  }
  if (
    !messages
      .filter((v) => v.role === "user")
      .at(-1)
      ?.content.trim()
  ) {
    throw new Error("消息内容不能为空");
  }
};
