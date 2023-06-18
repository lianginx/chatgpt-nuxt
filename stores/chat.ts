import { defineStore } from "pinia";
import {
  ApiRequest,
  ChatItem,
  ChatMessageExItem,
  ChatMessageExOption,
  ChatModel,
  ChatOption,
  ChatSettingItem,
  ImageSize,
} from "@/types";
import {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  CreateImageRequest,
  ImagesResponse,
  ListModelsResponse,
  Model,
} from "openai";

export const useChatStore = defineStore("chat", () => {
  const decoder = new TextDecoder("utf-8");
  const db = new ChatDB();

  const i18n = useI18n();

  let controller: AbortController;

  const showSetting = ref(false);
  const showHelp = ref(false);

  const models = ref<Model[]>([]);

  const chats = ref<ChatItem[]>([]);
  const chat = ref<ChatItem>();
  const messages = ref<ChatMessageExItem[]>([]);
  const messageContent = ref("");
  const talkingChats = ref(new Set<number>([]));

  const imageN = ref(1);
  const imageSize = ref<ImageSize>("256x256");

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
      await createImageChat();
      await createChat();
    } else if (!chat.value) {
      await openChat(chats.value[0]);
    }
  }

  async function createChat(item?: ChatOption) {
    chat.value = undefined;
    const chatItem: ChatOption = item ?? { name: "New Chat", order: 0 };
    await db.chat.put({ ...chatItem });

    // 加载列表并打开第一个
    await getAllChats();
  }

  async function createImageChat(item?: ChatOption) {
    chat.value = undefined;
    const chatItem: ChatOption = item ?? {
      name: "New Image",
      model: "dall-e",
      order: 0,
    };
    await db.chat.put({ ...chatItem });
    await getAllChats();
  }

  async function openChat(item: ChatItem) {
    console.log(item);
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

  // model

  async function getAvailableModels() {
    const setting = loadSetting();
    if (!setting) {
      showSetting.value = true;
      return;
    }

    controller = new AbortController();
    try {
      const response = await fetch("/api/models", {
        method: "get",
        headers: getHeaders(setting),
        signal: controller.signal,
      });
      const listModelsResponse: ListModelsResponse = await response.json();
      models.value = listModelsResponse.data;
    } catch (e: any) {
      console.error(e);
    }
  }

  async function isGpt4Supported() {
    if (!models.value.length) {
      await getAvailableModels();
    }
    return models.value.findIndex((model) => model.id === "gpt-4") > -1;
  }

  function getChatModelNameById(id: ChatModel) {
    switch (id) {
      case "gpt-3.5-turbo":
        return "GPT-3.5";
      case "gpt-4":
        return "GPT-4";
      case "dall-e":
        return "DALL·E";
    }
  }

  async function changeChatModel(chatId: number, model: ChatModel) {
    await db.chat.update(chatId, { model });
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
      const { status, statusText, body } = await fetch(
        "/api/chat/completions",
        {
          method: "post",
          headers: getHeaders(setting),
          body: JSON.stringify({
            model: chat.value?.model ?? "gpt-3.5-turbo",
            messages: standardList.value,
            temperature: setting.temperature,
            stream: true,
          } as ApiRequest),
          signal: controller.signal,
        }
      );

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
          content += `${status}: ${statusText}\n`;
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

  async function sendImageRequestMessage(message: ChatMessageExOption) {
    if (talking.value) return;
    if (!message?.content.trim()) return;

    const chatId = message.chatId ?? chat.value?.id;

    if (!chatId) return;

    const setting = loadSetting();
    if (!setting) {
      showSetting.value = true;
      return;
    }

    clearSendMessageContent();
    startTalking(chatId);

    await createMessage(message);
    const assistantMessageId = await createMessage({
      role: "assistant",
      content: "",
      chatId,
    });

    controller = new AbortController();

    let prompt = message.content;

    // Prompt translation request
    try {
      const translationPrompt = `
        You are a translation program.
        Below, define process to be executed, and the output constraints.

        # Process
        1. Identify the language of {input}.
        2. If the language is English, assign {input} as it is to {output}.
        3. If the language is not English, translate {input} to English and assign the result to {output}.

        # Output Constraints
        - Output only {output}.
        - Do not add any explanatory text.
        `;
      const response = await fetch("/api/chat/completions", {
        method: "post",
        headers: getHeaders(setting),
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: trimPrompt(translationPrompt),
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        } as CreateChatCompletionRequest),
      });
      const translateResponse: CreateChatCompletionResponse =
        await response.json();
      prompt = translateResponse.choices[0].message!.content;
    } catch (error) {
      console.error(error);
    }

    // Image generation request
    try {
      console.log(standardList.value);
      const response = await fetch("/api/images/generations", {
        method: "post",
        headers: getHeaders(setting),
        body: JSON.stringify({
          prompt,
          n: message.imageN,
          size: message.imageSize,
        } as CreateImageRequest),
        signal: controller.signal,
      });

      if (response.status !== 200) {
        const error = response.statusText;
        return await makeErrorMessage(assistantMessageId, error);
      }

      const imagesResponse: ImagesResponse = await response.json();
      const imagesResponseDataInner = imagesResponse.data;

      let content = "";
      imagesResponseDataInner.forEach((img) => {
        content += `![image](${img.url}) `;
      });
      await updateMessageContent(assistantMessageId, content);
    } catch (e: any) {
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

  // color mode

  function getColorMode() {
    const setting = loadSetting();
    return (setting && setting.colorMode) ?? "system";
  }

  // headers

  function getHeaders(setting: ChatSettingItem) {
    return {
      "x-api-type": setting.apiType,
      "x-cipher-api-key": setting.apiKey ?? "",
      "x-api-host": setting.apiHost ?? "",
      "x-azure-api-version": setting.azureApiVersion ?? "",
      "x-azure-gpt35-deployment-id": setting.azureGpt35DeploymentId ?? "",
      "x-azure-gpt4-deployment-id": setting.azureGpt4DeploymentId ?? "",
      "x-azure-dalle-deployment-id": setting.azureDalleDeploymentId ?? "",
    };
  }

  return {
    showSetting,
    showHelp,
    chats,
    chat,
    messages,
    messageContent,
    imageN,
    imageSize,
    talking,
    standardList,
    stop,
    openChat,
    reChatName,
    getAvailableModels,
    isGpt4Supported,
    getChatModelNameById,
    changeChatModel,
    setNotActiveDbMessages,
    getChatMessages,
    getAllChats,
    createChat,
    createImageChat,
    clearMessages,
    removeChat,
    appendMessage: createMessage,
    sendMessage,
    sendImageRequestMessage,
    getLocale,
    getColorMode,
    getHeaders,
  };
});
