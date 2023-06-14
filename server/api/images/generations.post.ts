import { CreateImageRequest } from "openai";
import { RequestHeaders } from "h3";
import { errorHandler, setResStatus } from "~/server/utils/h3";
import { getOpenAIApiInstance } from "../../utils/openai";

export default defineEventHandler(async (event) => {
  try {
    const headers = getHeaders(event);
    const body = (await readBody(event)) as CreateImageRequest;
    const response = await createImage(headers, body);

    setResStatus(event, response.status, response.statusText);
    return response.data;
  } catch (e: any) {
    await errorHandler(event, e);
  }
});

async function createImage(headers: RequestHeaders, body: CreateImageRequest) {
  const openai = getOpenAIApiInstance("img", headers, body);
  return openai.createImage(body);
}
