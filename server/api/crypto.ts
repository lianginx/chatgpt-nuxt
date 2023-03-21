import CryptoJS from "crypto-js";
import { H3Event } from "h3";
import { CryptoRequest } from "~~/types";

export default defineEventHandler((event) => AESCrypto(event));

const AESCrypto = async (event: H3Event) => {
  const { message, type } = getQuery(event) as unknown as CryptoRequest;

  const key = "lianginx";

  if (type === "en") {
    return CryptoJS.AES.encrypt(message, key).toString();
  }
  if (type === "de") {
    return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
  }

  return null;
};
