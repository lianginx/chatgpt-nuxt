export const saveAPIKey = async (apiKey: string) => {
  const AESKey = await $fetch("/api/crypto", {
    params: {
      message: apiKey,
      type: "en",
    },
  });

  if (AESKey) {
    localStorage.setItem("apiKey", AESKey);
  }

  return AESKey;
};

export const getAPIKey = () => localStorage.getItem("apiKey") ?? "";
