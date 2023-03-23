export const saveAPIKey = async (apiKey: string) => {
  const AESKey = await $fetch("/api/crypto", {
    params: {
      message: apiKey,
      type: "en",
    },
  });
  console.log("AESKey", AESKey);

  if (AESKey) {
    localStorage.setItem("apiKey", AESKey);
  }
  return AESKey;
};

export const getAPIKey = () => localStorage.getItem("apiKey") ?? "";
