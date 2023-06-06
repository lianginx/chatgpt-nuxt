import { CreateCompletionRequest } from "openai";
import { RequestHeaders } from "h3";
import { errorHandler, setResStatus } from "~/server/utils/h3";
import { getOpenAIApiInstance } from "../utils/openai";

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const body = (await readBody(event)) as CreateCompletionRequest;
    const response = await createCompletion(headers, body);

    setResStatus(event, response.status, response.statusText);
    return response.data;
  } catch (e: any) {
    await errorHandler(event, e);
  }
});

async function createCompletion(
  headers: RequestHeaders,
  body: CreateCompletionRequest
) {
  const openai = getOpenAIApiInstance("text", headers, body);
  return openai.createCompletion(body);
}
