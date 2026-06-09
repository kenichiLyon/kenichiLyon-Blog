# Kenichi Lyon Blog

This repository now uses Astro, a TypeScript-friendly static site framework, for the blog.

- Source posts live in `src/content/blog/`.
- Generated static files are written to `site/`.
- Post URLs use ASCII slugs while each entry keeps its original source path in front matter.
- The migration script removes a duplicated first title from Markdown bodies when it matches the front matter title.
- `/` is a standalone sci-fi intro page; `/directory/` is the blog directory.

Migrate content from the previous static export:

```powershell
npm run migrate:content
```

Build:

```powershell
npm run build
```

Preview:

```powershell
npm run preview
```

Deploy:

- Push `main` to GitHub.
- In the repository settings, set Pages source to GitHub Actions.
- The workflow at `.github/workflows/deploy.yml` builds the Astro site and deploys it to GitHub Pages.
