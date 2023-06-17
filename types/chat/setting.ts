export type ChatSettingType = "default" | "global" | "chat";

export type ApiType = "openai" | "azure";

export type ColorMode = "system" | "light" | "dark";

export interface ChatSettingItem extends ChatSettingOption {
  id: number;
}

export interface ChatSettingOption extends ChatSetting {
  type: ChatSettingType;
}

export interface ChatSetting {
  apiType: ApiType;
  apiKey?: string;
  apiHost?: string;
  azureApiVersion?: string;
  azureGpt35DeploymentId?: string;
  azureGpt4DeploymentId?: string;
  azureDalleDeploymentId?: string;
  temperature: number;
  locale: string;
  colorMode: ColorMode;
}
