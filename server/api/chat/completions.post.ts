import { CreateChatCompletionRequest } from "openai";
import { RequestHeaders } from "h3";
import { errorHandler, setResStatus } from "~/server/utils/h3";
import { getOpenAIApiInstance } from "../../utils/openai";

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const body = (await readBody(event)) as CreateChatCompletionRequest;
    const response = await createChatCompletion(headers, body);

    setResStatus(event, response.status, response.statusText);
    return response.data;
  } catch (e: any) {
    return await errorHandler(event, e);
  }
});

async function createChatCompletion(
  headers: RequestHeaders,
  body: CreateChatCompletionRequest
) {
  const openai = getOpenAIApiInstance("chat", headers, body);
  return openai.createChatCompletion(body);
}
