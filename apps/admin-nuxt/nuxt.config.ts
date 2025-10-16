import { fileURLToPath } from "node:url";

const tailwindConfigAlias = fileURLToPath(new URL("./tailwind-config", import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/ui"],
  alias: {
    "#tailwind-config": tailwindConfigAlias
  },
  ui: {
    primary: "violet",
    gray: "slate"
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:8080/api/admin"
    }
  }
});
