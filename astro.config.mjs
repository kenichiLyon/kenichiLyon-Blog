import { defineConfig } from "astro/config";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPage = repositoryName.endsWith(".github.io");
const base = process.env.GITHUB_ACTIONS && repositoryName && !isUserOrOrgPage ? `/${repositoryName}/` : "/";

export default defineConfig({
  base,
  outDir: "site",
  trailingSlash: "always",
});
