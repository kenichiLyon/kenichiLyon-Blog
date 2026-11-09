import { env } from 'node:process';

const repositoryName = env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPage = repositoryName.endsWith(".github.io");
const baseURL = env.GITHUB_ACTIONS && repositoryName && !isUserOrOrgPage
  ? `/${repositoryName}/`
  : "/";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/content", "@nuxtjs/color-mode"],
  css: [
    "@fontsource-variable/inter/index.css",
    "@fontsource-variable/fraunces/full.css",
    "@fontsource-variable/fraunces/full-italic.css",
    "~/assets/css/main.css",
  ],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: "zh-Hans" },
      titleTemplate: "%s · Kenichi Lyon",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "kenichiLyon 的个人博客：创作、世界观与角色档案。",
        },
        { name: "theme-color", content: "#0c0c11", media: "(prefers-color-scheme: dark)" },
        { name: "theme-color", content: "#f6f3ec", media: "(prefers-color-scheme: light)" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Kenichi Lyon Blog" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: `${baseURL}favicon.svg` },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
    storageKey: "kl-color-mode",
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: { default: "github-light", dark: "github-dark" },
          langs: ["bash", "js", "ts", "go", "py", "json", "yaml", "css", "html", "md", "sql"],
        },
      },
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/posts/", "/directory/"],
    },
  },
  experimental: {
    payloadExtraction: true,
  },
});
