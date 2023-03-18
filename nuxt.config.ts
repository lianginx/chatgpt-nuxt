// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "ChatGPT",
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["highlight.js/styles/dark.css"],
  tailwindcss: {
    config: {
      plugins: [require("@tailwindcss/typography")],
    },
  },
});
