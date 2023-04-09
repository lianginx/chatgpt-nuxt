import CryptoJS from "crypto-js";
import { CryptoRequest } from "@/types";

const key = "lianginx";

export default defineEventHandler(async (event) => {
  const crypto = (await readBody(event)) as CryptoRequest;
  return aesCrypto(crypto);
});

export function aesCrypto(crypto: CryptoRequest) {
  if (crypto.type === "en") {
    return CryptoJS.AES.encrypt(crypto.message, key).toString();
  } else {
    return CryptoJS.AES.decrypt(crypto.message, key).toString(
      CryptoJS.enc.Utf8
    );
  }
}
