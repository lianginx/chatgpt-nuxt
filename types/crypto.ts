import { APIResponse } from "./index";

export type CryptoType = "en" | "de";

export interface CryptoRequest {
  message: string;
  type: CryptoType;
}

export interface CryptoResponse extends APIResponse {
  data?: string;
}
