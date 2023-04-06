import { defineStore } from "pinia";
import { Chat, ChatMessage, ChatMessageEx } from "~~/types";

const decoder = new TextDecoder("utf-8");

export const useChatStore = defineStore("chat", () => {
  let controller: AbortController;

  const db = new ChatDB();
  const showSetting = ref(false);
  const chats = ref<Chat[]>([]);
  const chat = ref<Chat | null>(null);
  const messages = ref<ChatMessageEx[]>([]);
  const messageContent = ref("");
  const talking = ref(false);

  const lastMessage = computed(() => messages.value[messages.value.length - 1]);

  const stop = () => controller?.abort();

  const getAllChats = async () => {
    chats.value = await db.chat.toArray();
  };

  const createChat = async (item?: Chat) => {
    if (!item) {
      item = { name: "新的聊天", order: 0 };
    }

    const id = await db.chat.put({ ...item });
    const newChat = { id, ...item };

    // 追加到消息队列
    chats.value.unshift(newChat);
    chat.value = chats.value[0];

    // 加载历史消息
    await getChatMessages(chat.value?.id);

    return newChat;
  };

  const removeChat = async (item: Chat) => {
    if (item.id) {
      await db.chat.delete(item.id);
      await clearMessages(item.id);
      await getAllChats();
      if (!chats.value.length) createChat();
    }
  };

  const clearMessages = async (chatId?: number) => {
    const id = chatId ?? chat.value?.id;
    if (id) {
      await db.messages.where("chatId").equals(id).delete();
      await getChatMessages();
    }
  };

  const getChatMessages = async (chatId?: number) => {
    const id = chatId ?? chat.value?.id;
    if (id) {
      messages.value = await db.messages.where("chatId").equals(id).toArray();
    }
  };

  const appendMessage = async (message: ChatMessageEx) => {
    message.chatId = chat.value?.id;
    message.active = message.active ?? true;
    message.show = message.show ?? true;
    message.error = message.error ?? false;
    message.errorMessage = message.errorMessage ?? undefined;

    // 保存到数据库
    const id = await db.messages.put({ ...message });

    // 追加到消息队列
    const newMessage = { id, ...message };

    let hasItem = messages.value.find((item) => item.id === id);
    if (hasItem) {
      hasItem = newMessage;
    } else {
      messages.value.push(newMessage);
    }

    return newMessage;
  };

  const formatStandardList = (): ChatMessage[] => {
    return messages.value
      .filter((item) => item.active && !item.error && item.content)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));
  };

  const appendMessageContent = (content: string) => {
    return (lastMessage.value.content += content ?? "");
  };

  const makeErrorMessage = (errorMessage: string) => {
    lastMessage.value.error = false;
    lastMessage.value.errorMessage = errorMessage;
    return lastMessage.value;
  };

  const sendMessage = async (message: ChatMessageEx) => {
    if (talking.value) return;
    if (!message?.content.trim()) return;

    messageContent.value = "";
    talking.value = true;

    try {
      // 追加到消息队列
      await appendMessage(message);
      await appendMessage({ role: "assistant", content: "" });

      // 格式化标准消息队列
      const standardList = formatStandardList();
      console.log("standardList", standardList);

      // 用于主动中断请求
      controller = new AbortController();

      // 发送请求
      const { status, body } = await fetch("/api/chat", {
        method: "post",
        body: JSON.stringify({
          apiKey:
            "U2FsdGVkX1/O4I+YJKICmo6VNzoDmbltcZVNRkwwggjjS1yPnP3JXOz08H+dlKaNTFZ3xDG8fro7+5zUIrJJ/MuSis9WLdX+HYfHFQMaIXI=",
          messages: standardList,
        }),
        signal: controller.signal,
      });

      // 读取流
      const reader = body?.getReader();
      while (reader) {
        const { done, value } = await reader.read();

        if (done) break;

        const text = decoder.decode(value);
        const dataList = status === 200 ? text.match(/({.*?]})/g) : [text];

        dataList?.forEach((textData) => {
          const data = JSON.parse(textData);

          if (status === 200) {
            appendMessageContent(data.choices[0].delta.content);
          } else if (status === 500) {
            makeErrorMessage(data.message);
          } else {
            makeErrorMessage(data.error.message);
          }
        });
      }
    } catch (e: any) {
      let eMessage = e.name === "AbortError" ? "已停止回答" : e.message;
      makeErrorMessage(`\n\n**${eMessage}**`);
    } finally {
      talking.value = false;

      // 更新消息到数据库
      await appendMessage(lastMessage.value);
    }
  };

  return {
    db,
    showSetting,
    chats,
    chat,
    messages,
    messageContent,
    talking,
    stop,
    getAllChats,
    createChat,
    clearMessages,
    removeChat,
    appendMessage,
    sendMessage,
  };
});
