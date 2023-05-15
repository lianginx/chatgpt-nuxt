export type ChatSettingType = "default" | "global" | "chat";

export type ApiType = "openai" | "azure";

export interface ChatSettingItem extends ChatSettingOption {
  id: number;
}

export interface ChatSettingOption extends ChatSetting {
  type: ChatSettingType;
}

export interface ChatSetting {
  apiType: ApiType;
  apiKey: string;
  apiHost: string;
  azureApiVersion: string;
  azureDeploymentId: string;
  temperature: number;
  locale: string;
}
