# Kenichi Lyon Blog

基于 **Nuxt 4、Vue 3、TypeScript 和 Nuxt Content 3** 的个人创作博客，静态生成后部署到 GitHub Pages，不需要生产服务器或数据库服务。

## 本地开发

使用 Node.js 24.15+（24 LTS）或 Node.js 26+。

```sh
npm ci
npm run dev
```

检查类型与生成静态站点：

```sh
npm run typecheck
npm run generate
```

静态文件输出到 `.output/public/`。`npm run build` 生成 Nuxt 的 Node 服务版本，随后可用 `npm run preview` 预览；GitHub Pages 使用 `generate`，不是服务端构建。

## 页面与组件

- `app/pages/index.vue`：个人介绍、创作系列、最近更新。
- `app/pages/posts/index.vue`：可搜索、按系列筛选的文章索引；查询参数 `q`、`series` 可分享。
- `app/pages/directory.vue`：保留原始来源层级的折叠目录。
- `app/pages/posts/[...slug].vue`：文章、阅读时间、同系列导航、上一篇/下一篇。
- `app/components/`：Vue 组件；`content/ProseImg.vue` 为 Markdown 图片添加部署基础路径。
- `app/assets/css/main.css`：纸张 / 深色主题、排版与响应式样式。
- `app/utils/blog.ts`、`app/composables/`：共享内容数据与格式化逻辑。

## 写文章

Markdown 位于 `content/posts/`，原有 10 篇文章和 ASCII slug 保留不变。文章地址仍为 `/posts/<slug>/`，不依赖内容文件的 `path` 字段。`source` 保留原来的中文路径，用于目录树。

前言字段沿用 `content.config.ts` 的 schema：`title`、ISO 格式的 `date`、`author`、`last_modified_by`、`source`、数字 `order`、唯一的 `slug`；可选 `updated`、`series`、`source_file`、`source_format`。`categories` 和 `tags` 是字符串数组，`draft: true` 的文章不生成页面或出现在导航中。`order` 决定目录和上一篇/下一篇的阅读顺序。

图片放到 `public/media/<slug>/`，在 Markdown 中使用站点根路径：

```md
![图片说明](/media/my-story/illustration.webp)
```

不要把图片放在 `content/` 下并使用 `./image.jpg`：Nuxt Content 不会发布这些文件。组件会自动为根路径图片添加 GitHub Pages 项目目录。迁移后的插图使用 WebP，首页也使用压缩后的 WebP 图像。

## 部署

1. 在仓库 Settings → Pages 中选择 **GitHub Actions**。
2. 推送到 `main`，或手动运行 `.github/workflows/deploy.yml`。
3. 工作流执行 `npm ci` 和 `npm run generate`，上传 `.output/public/`。

`nuxt.config.ts` 在 GitHub Actions 中从 `GITHUB_REPOSITORY` 计算项目基础路径；`*.github.io` 用户 / 组织仓库使用 `/`，其他仓库使用 `/<repository>/`。本地开发默认使用 `/`。

## 本次迁移

- Astro 页面切换为 Vue 单文件组件与 Nuxt Content，移除旧 Astro 配置及一次性导入脚本。
- 保留原有文章内容、阅读顺序、来源路径与公开文章 URL。
- 新增明暗主题切换、可分享的搜索 / 系列筛选、系列阅读导航与移动端布局。
