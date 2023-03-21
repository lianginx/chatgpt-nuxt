export type CryptoType = "en" | "de";

export interface CryptoRequest {
  message: string;
  type: CryptoType;
}
