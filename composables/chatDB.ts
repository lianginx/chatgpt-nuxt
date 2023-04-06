import Dexie from "dexie";
import {
  ChatMessageEx,
  ChatPrompt,
  Chat,
  ChatSetting,
  ChatPromptCategory,
} from "~~/types";

const databaseName = "ChatGPT";
const lastVersion = 1;

const chat = ["++id", "promptId", "settingId", "name", "order"];
const messages = [
  "++id",
  "chatId",
  "role",
  "active",
  "show",
  "current",
  "error",
  "sendData",
];
const setting = ["++id", "type"];
const promptCategory = ["++id", "name", "order"];
const prompt = ["++id", "promptCategoryId", "name", "order"].concat(
  messages.slice(1)
);

export class ChatDB extends Dexie {
  chat!: Dexie.Table<Chat, number | undefined>;
  messages!: Dexie.Table<ChatMessageEx, number | undefined>;
  setting!: Dexie.Table<ChatSetting, number | undefined>;
  promptCategory!: Dexie.Table<ChatPromptCategory, number | undefined>;
  prompt!: Dexie.Table<ChatPrompt, number | undefined>;

  constructor() {
    super(databaseName);
    this.version(lastVersion).stores({
      chat: chat.toString(),
      messages: messages.toString(),
      setting: setting.toString(),
      promptCategory: promptCategory.toString(),
      prompt: prompt.toString(),
    });
  }
}
