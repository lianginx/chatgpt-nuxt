import { defineStore } from "pinia";
import {
  ApiRequest,
  ChatItem,
  ChatMessageExItem,
  ChatMessageExOption,
  ChatOption,
} from "@/types";

export const useChatStore = defineStore("chat", () => {
  const decoder = new TextDecoder("utf-8");
  const db = new ChatDB();

  const i18n = useI18n();

  let controller: AbortController;

  const showSetting = ref(false);
  const showHelp = ref(false);

  const chats = ref<ChatItem[]>([]);
  const chat = ref<ChatItem>();
  const messages = ref<ChatMessageExItem[]>([]);
  const messageContent = ref("");
  const talkingChats = ref(new Set<number>([]));

  // talking

  const talking = computed(
    () => talkingChats.value.has(chat.value?.id ?? 0) ?? false
  );

  function startTalking(chatId: number) {
    talkingChats.value.add(chatId);
  }

  function endTalking(chatId: number) {
    talkingChats.value.delete(chatId);
  }

  // chat

  async function getAllChats() {
    chats.value = (await db.chat.reverse().toArray()) as ChatItem[];

    // 没有则创建
    if (!chats.value.length) {
      await createChat();
    } else {
      await openChat(chats.value[0]);
    }
  }

  async function createChat(item?: ChatOption) {
    const chatItem: ChatOption = item ?? { name: "New Chat", order: 0 };
    await db.chat.put({ ...chatItem });

    // 加载列表并打开第一个
    await getAllChats();
  }

  async function openChat(item: ChatItem) {
    chat.value = item;
    await getChatMessages(item.id);
  }

  async function removeChat(chatId: number) {
    if (!confirm(i18n.t("removeChatConfirm"))) return;
    await db.transaction("rw", "chat", "message", async () => {
      await db.chat.delete(chatId);
      await clearMessages(chatId);
    });
    await getAllChats();
  }

  async function reChatName(chatId: number, name: string) {
    await db.chat.update(chatId, { name });
    await getAllChats();
    const chat = chats.value.find((item) => item.id === chatId);
    if (chat) openChat(chat);
  }

  // message

  const standardList = computed(() =>
    messages.value
      .filter((item) => item.active && !item.error && item.content)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }))
  );

  const setNotActiveDbMessages = () => {
    return db.message.toCollection().modify({ active: false });
  };

  async function getChatMessages(chatId: number) {
    messages.value = (await db.message
      .where("chatId")
      .equals(chatId)
      .toArray()) as ChatMessageExItem[];
  }

  async function clearMessages(chatId: number) {
    await db.message.where("chatId").equals(chatId).delete();
    await getChatMessages(chatId);
  }

  async function createMessage(message: ChatMessageExOption) {
    if (!chat.value && !message.chatId) await createChat();

    const chatId = message.chatId ?? (chat.value as ChatItem).id;

    message.chatId = chatId;
    message.active = message.active ?? true;
    message.show = message.show ?? true;
    message.error = message.error ?? false;
    message.errorMessage = message.errorMessage ?? undefined;
    message.sendDate = Date.now();

    const id = await db.message.put({ ...message });
    await getChatMessages(chatId);

    return id;
  }

  async function updateMessageContent(id: number, content: string) {
    await db.message.update(id, { content });
    await getChatMessages((chat.value as ChatItem).id);
  }

  async function makeErrorMessage(id: number, errorMessage: string) {
    await db.message.update(id, { error: true, errorMessage });
    await getChatMessages((chat.value as ChatItem).id);
  }

  function stop() {
    controller?.abort();
  }

  function clearSendMessageContent() {
    messageContent.value = "";
  }

  async function sendMessage(message: ChatMessageExOption) {
    if (talking.value) return;
    if (!message?.content.trim()) return;

    const chatId = message.chatId ?? chat.value?.id;
    console.log("store chatId", chat.value?.id);
    console.log("message chatId", message.chatId);

    if (!chatId) return;

    const setting = loadSetting();
    if (!setting) {
      showSetting.value = true;
      return;
    }

    // 开始对话
    clearSendMessageContent();
    startTalking(chatId);

    // 追加到消息队列
    await createMessage(message);
    const assistantMessageId = await createMessage({
      role: "assistant",
      content: "",
      chatId,
    });

    // 用于主动中断请求
    controller = new AbortController();

    try {
      // 打印标准列表
      console.log(standardList.value);

      // 发送请求
      const { status, body } = await fetch("/api/chat", {
        method: "post",
        body: JSON.stringify({
          apiType: setting.apiType,
          cipherAPIKey: setting.apiKey,
          apiHost: setting.apiHost,
          azureApiVersion: setting.azureApiVersion,
          azureDeploymentId: setting.azureDeploymentId,
          model: "chat",
          request: {
            model:
              setting.apiType === "openai"
                ? "gpt-3.5-turbo"
                : setting.azureDeploymentId,
            messages: standardList.value,
            temperature: setting.temperature,
            stream: true,
          },
        } as ApiRequest),
        signal: controller.signal,
      });

      // 读取 Stream
      let content = "";
      const reader = body?.getReader();

      let parsedCount = 0;
      let concatenatedValue = new Uint8Array();

      while (reader) {
        const { value } = await reader.read();

        // concatenate with the previous value
        concatenatedValue = new Uint8Array([...concatenatedValue, ...value!]);

        const text = decoder.decode(concatenatedValue);

        // 处理服务端返回的异常消息并终止读取
        if (status !== 200) {
          const error = JSON.parse(text);
          content += error.error?.message ?? error.message;
          return await makeErrorMessage(assistantMessageId, content);
        }

        // 读取正文
        const line = text
          .split(/\r?\n/)
          .map((line) => line.replace(/(\n)?^data:\s*/, "").trim()) // remove prefix
          .filter((line) => line !== ""); // remove empty lines
        for (let i = parsedCount; i < line.length; i++) {
          if (line[i] === "[DONE]") return;

          try {
            const data = JSON.parse(line[i]);
            content += data.choices[0].delta.content ?? "";
            await updateMessageContent(assistantMessageId, content);
            parsedCount++;
          } catch (e) {
            console.warn("Could not JSON parse stream message", e);
            continue;
          }
        }
      }
    } catch (e: any) {
      // 主动终止时触发
      await makeErrorMessage(
        assistantMessageId,
        `\n\n**${
          e.name === "AbortError" ? i18n.t("ChatStop.message") : e.message
        }**`
      );
    } finally {
      endTalking(chatId);
    }
  }

  // locale

  function getLocale() {
    const setting = loadSetting();
    return (setting && setting.locale) ?? i18n.getBrowserLocale() ?? "en";
  }

  return {
    showSetting,
    showHelp,
    chats,
    chat,
    messages,
    messageContent,
    talking,
    standardList,
    stop,
    openChat,
    reChatName,
    setNotActiveDbMessages,
    getChatMessages,
    getAllChats,
    createChat,
    clearMessages,
    removeChat,
    appendMessage: createMessage,
    sendMessage,
    getLocale,
  };
});
