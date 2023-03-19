export type APIResponseStatus = "success" | "error";

export interface APIResponse {
  status: APIResponseStatus;
  data?: any;
  message?: string;
}
