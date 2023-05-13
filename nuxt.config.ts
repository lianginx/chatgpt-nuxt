// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {},
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
