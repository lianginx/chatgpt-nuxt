// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {},
  runtimeConfig: {
    apiKey: process.env.OPENAI_API_KEY,
    apiHost: process.env.AZURE_API_HOST,
    azureApiVersion: process.env.AZURE_API_VERSION,
    azureDevelopmentId: process.env.AZURE_DEPLOYMENT_ID,
    public: {
      useEnvironmentVariables: !!process.env.OPENAI_API_TYPE,
      apiType: process.env.OPENAI_API_TYPE,
      defaultTemperature: process.env.DEFAULT_TEMPERATURE,
    },
  },
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-icon"],
  css: ["highlight.js/styles/dark.css"],
  i18n: {
    locales: [
      {
        code: "zh",
        iso: "zh-CN",
        file: "zh.json",
        name: "简体中文",
      },
      {
        code: "en",
        iso: "en-US",
        file: "en.json",
        name: "English (US)",
      },
      {
        code: "ja",
        iso: "ja-JP",
        file: "ja.json",
        name: "日本語",
      },
    ],
    langDir: "locales",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    precompile: {
      strictMessage: false,
    },
  },
  tailwindcss: {
    config: {
      content: [],
      plugins: [require("@tailwindcss/typography")],
    },
  },
  ssr: false,
});
