import { H3Event } from "h3";

export function setResStatus(event: H3Event, code: number, message: string) {
  event.node.res.statusCode = code;
  event.node.res.statusMessage = message;
}

export async function errorHandler(event: H3Event, e: any) {
  // 很奇怪，在我的 mac 开发环境中报错时，response 永远是一个 Stream 对象
  // 但是在 Windows 开发环境和 Docker 中报错时，response 却是 undefined
  if (e.response?.data) {
    setResStatus(event, e.response.status, e.response.data.statusText);

    let isStreamNull = true; // mac 开发环境中上，response 永远不是 undefined

    for await (const data of e.response.data) {
      isStreamNull = false;
      const message = data.toString();
      try {
        const parsed = JSON.parse(message);
        return parsed;
      } catch (error) {
        return message;
      }
    }

    if (isStreamNull) {
      return e;
    }
  } else {
    return e;
  }
}
