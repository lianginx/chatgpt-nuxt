import Dexie from "dexie";
import {
  ChatSettingOption,
  ChatItem,
  ChatMessageExItem,
  ChatSettingItem,
  ChatPromptCategoryItem,
  ChatPromptItem,
  ChatMessageExOption,
  ChatOption,
  ChatPromptOption,
  ChatPromptCategoryOption,
} from "@/types";

const databaseName = "ChatGPT";
const lastVersion = 2;

const chat = [
  "++id",
  "promptId",
  "settingId",
  "name",
  "model",
  "order",
].toString();
const message = [
  "++id",
  "chatId",
  "role",
  "active",
  "show",
  "current",
  "error",
  "sendData",
].toString();
const setting = ["++id", "type"].toString();
const promptCategory = ["++id", "name", "order"].toString();
const prompt = [
  "++id",
  "promptCategoryId",
  "name",
  "order",
  "message",
].toString();

export class ChatDB extends Dexie {
  chat!: Dexie.Table<ChatOption, number>;
  message!: Dexie.Table<ChatMessageExOption, number>;
  setting!: Dexie.Table<ChatSettingOption, number>;
  promptCategory!: Dexie.Table<ChatPromptCategoryOption, number>;
  prompt!: Dexie.Table<ChatPromptOption, number>;

  constructor() {
    super(databaseName);
    this.version(lastVersion).stores({
      chat,
      message,
      setting,
      promptCategory,
      prompt,
    });
  }
}
