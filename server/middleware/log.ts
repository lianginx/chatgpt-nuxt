import { logger } from "@/server/utils/logger";

export default defineEventHandler((event) => {
  logger(`[${getMethod(event)}]`, getRequestURL(event).href);
});
