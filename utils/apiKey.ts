export const saveAPIKey = (apiKey: string) => {
  checkAPIKeyError(apiKey);
  const AESKey = useFetch("/api/crypto", {
    params: {
      message: apiKey,
      type: "en",
    },
  }).data.value;
  if (AESKey) {
    localStorage.setItem("apiKey", AESKey);
  }
  return AESKey;
};

export const getAPIKey = () => localStorage.getItem("apiKey") ?? "";
