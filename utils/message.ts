import { ChatMessage } from "../types";

export { getUserMessages, nextMessage, previousMessage };

const nextMessage = (messages: ChatMessage[], currentIndex?: number | null) => {
  if (!messages.length) return null;
  const userMessages = getUserMessages(messages);
  const index = currentIndex ?? -1;
  const nextIndex = index + 1 === userMessages.length ? 0 : index + 1;
  return {
    index: nextIndex,
    message: userMessages.at(nextIndex)?.content ?? null,
  };
};

const previousMessage = (
  messages: ChatMessage[],
  currentIndex?: number | null
) => {
  if (!messages.length) return null;
  const userMessages = getUserMessages(messages);
  const index = currentIndex ?? userMessages.length;
  const nextIndex = index - 1 < 0 ? userMessages.length - 1 : index - 1;
  return {
    index: nextIndex,
    message: userMessages.at(nextIndex)?.content ?? null,
  };
};

const getUserMessages = (messages: ChatMessage[]) => {
  return messages.filter((v) => v.role === "user");
};
