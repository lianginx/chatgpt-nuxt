import CryptoJS from "crypto-js";
import { H3Event } from "h3";
import { CryptoRequest, CryptoResponse } from "~~/types";

export default defineEventHandler((event) => AESCrypto(event));

const AESCrypto = async (event: H3Event): Promise<CryptoResponse> => {
  try {
    const { message, type } = getQuery(event) as unknown as CryptoRequest;

    const key = "lianginx";
    let res: CryptoResponse = { status: "success" };

    if (type === "en") {
      res.data = CryptoJS.AES.encrypt(message, key).toString();
    }
    if (type === "de") {
      res.data = CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
    }

    return res;
  } catch (e: any) {
    return { status: "error", message: e.message };
  }
};
