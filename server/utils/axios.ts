import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export function createAxiosInstance() {
  const axiosRequestConfig: AxiosRequestConfig = {
    responseType: "stream",
    timeout: 1000 * 20,
    timeoutErrorMessage: "**Network connection timed out. Please try again**",
    // 使用代理，配置参考 https://axios-http.com/docs/req_config
    // proxy: {
    //   protocol: "http",
    //   host: "127.0.0.1",
    //   port: 7890,
    // },
  };

  function onRequest(config: AxiosRequestConfig) {
    logger("onRequest", `[${config.method?.toUpperCase()}]`, config.url);
    return config;
  }

  function onResponse(response: AxiosResponse) {
    logger(
      "onResponse",
      `[${response.config.method?.toUpperCase()}]`,
      response.config.url,
      response.status,
      response.statusText
    );
    return response;
  }

  function onRequestError(error: any) {
    logger("onRequestError", error);
    return error;
  }

  function onResponseError(error: any) {
    logger("onResponseError", error);
    return error.response;
  }

  const axiosInstance = axios.create(axiosRequestConfig);
  axiosInstance.interceptors.request.use(
    (config) => onRequest(config) || config
  );
  axiosInstance.interceptors.response.use(
    (response) => onResponse(response) || response
  );
  axiosInstance.interceptors.request.use(
    undefined,
    (error) => onRequestError(error) || Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    undefined,
    (error) => onResponseError(error) || Promise.reject(error)
  );

  return axiosInstance;
}
