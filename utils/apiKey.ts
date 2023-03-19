export const saveAPIKey = async (key: string) => {
  checkAPIKeyError(key);
  const res = await $fetch("/api/crypto", {
    params: {
      message: key,
      type: "en",
    },
  });
  if (res.status === "success" && res.data) {
    localStorage.setItem("apiKey", res.data);
    return res.data;
  }
  return "";
};

export const getAPIKey = async () => {
  const AESMessage = localStorage.getItem("apiKey");
  if (!AESMessage) return "";
  const res = await $fetch("/api/crypto", {
    params: {
      message: AESMessage,
      type: "de",
    },
  });
  return res.status === "success" && res.data ? res.data : "";
};
