<script setup lang="ts">
import type { BlogPost } from '~/utils/blog';
import { contentText, formatDate, postPath, readingMinutes } from '~/utils/blog';

const route = useRoute();
const slug = computed(() => {
  const value = route.params.slug;
  return (Array.isArray(value) ? value.join('/') : value || '').replace(/^\/+|\/+$/g, '');
});
const postKey = computed(() => `blog-post:${slug.value}`);
const indexRequest = usePostIndex();
const { data, error, status } = await useAsyncData<BlogPost>(postKey, async () => {
  const requestedSlug = slug.value;
  const result = await queryCollection('blog')
    .where('slug', '=', requestedSlug)
    .where('draft', '=', false)
    .first();

  if (!result) {
    throw createError({ statusCode: 404, statusMessage: 'Post Not Found' });
  }

  return result;
});

if (error.value) throw createError(error.value);
watch(error, (value) => {
  if (value) showError(value);
});

const { data: posts } = await indexRequest;
// A keyed request can still be pending during a reused-page navigation.
const post = computed(() => data.value?.slug === slug.value ? data.value : null);
const currentIndex = computed(() => posts.value.findIndex(item => item.slug === slug.value));
const previousPost = computed(() => currentIndex.value > 0 ? posts.value[currentIndex.value - 1] : undefined);
const nextPost = computed(() => currentIndex.value >= 0 ? posts.value[currentIndex.value + 1] : undefined);
const sameSeries = computed(() => post.value?.series
  ? posts.value.filter(item => item.series === post.value!.series)
  : []);
const sourceDirectories = computed(() => post.value?.source.split('/').slice(0, -1) || []);
const minutes = computed(() => post.value ? readingMinutes(post.value.body) : 0);
const description = computed(() => post.value
  ? contentText(post.value.body).replace(/\s+/g, ' ').trim().slice(0, 160) || post.value.title
  : '阅读文章');

useSeoMeta({
  title: () => post.value?.title || '文章',
  description: () => description.value,
  ogTitle: () => post.value?.title || '文章',
  ogDescription: () => description.value,
  ogType: 'article',
  articlePublishedTime: () => post.value?.date,
  articleModifiedTime: () => post.value?.updated || post.value?.date,
  articleAuthor: () => post.value ? [post.value.author] : undefined,
});
</script>

<template>
  <div v-if="post" class="wrap reader">
    <nav class="breadcrumbs reader__breadcrumbs" aria-label="面包屑导航">
      <ol>
        <li><NuxtLink to="/">首页</NuxtLink></li>
        <li><NuxtLink to="/directory/">文章目录</NuxtLink></li>
        <li v-for="(directory, index) in sourceDirectories" :key="`${index}:${directory}`">
          <span>{{ directory }}</span>
        </li>
      </ol>
    </nav>

    <div class="reader__layout" :class="{ 'reader__layout--with-series': sameSeries.length }">
      <article class="reader__article" aria-labelledby="article-title">
        <header class="reader__header">
          <p class="eyebrow">{{ post.series || '独立篇章' }}</p>
          <h1 id="article-title" class="reader__title">{{ post.title }}</h1>
          <div class="reader__metadata muted">
            <span class="reader__author">{{ post.author }}</span>
            <span>发布于 <time :datetime="post.date">{{ formatDate(post.date) }}</time></span>
            <span v-if="post.updated && post.updated.slice(0, 10) !== post.date.slice(0, 10)">
              更新于 <time :datetime="post.updated">{{ formatDate(post.updated) }}</time>
            </span>
            <span>约 {{ minutes }} 分钟阅读</span>
          </div>
          <ul v-if="post.tags.length" class="reader__tags" aria-label="文章标签">
            <li v-for="tag in post.tags" :key="tag"><span class="tag">{{ tag }}</span></li>
          </ul>
        </header>

        <ContentRenderer :key="post.slug" :value="post" class="prose" />

        <footer class="reader__footer">
          <nav v-if="previousPost || nextPost" class="reader__pagination" aria-label="前后篇章">
            <NuxtLink v-if="previousPost" :to="postPath(previousPost)" class="reader__neighbor reader__neighbor--previous" rel="prev">
              <span class="reader__neighbor-label">← 上一篇</span>
              <span class="reader__neighbor-title">{{ previousPost.title }}</span>
            </NuxtLink>
            <NuxtLink v-if="nextPost" :to="postPath(nextPost)" class="reader__neighbor reader__neighbor--next" rel="next">
              <span class="reader__neighbor-label">下一篇 →</span>
              <span class="reader__neighbor-title">{{ nextPost.title }}</span>
            </NuxtLink>
          </nav>
          <NuxtLink to="/directory/" class="text-link reader__back">← 返回文章目录</NuxtLink>
        </footer>
      </article>

      <aside v-if="sameSeries.length" class="reader__sidebar" aria-labelledby="series-heading">
        <nav class="reader__series" aria-label="同系列篇章">
          <p class="eyebrow">同系列 · {{ sameSeries.length }} 篇</p>
          <h2 id="series-heading">{{ post.series }}</h2>
          <ol>
            <li v-for="(item, index) in sameSeries" :key="item.slug">
              <NuxtLink :to="postPath(item)" :aria-current="item.slug === post.slug ? 'page' : undefined">
                <span class="reader__series-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
                <span>{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ol>
          <NuxtLink to="/directory/" class="text-link reader__series-back">完整目录 ↗</NuxtLink>
        </nav>
      </aside>
    </div>
  </div>
  <div v-else-if="status === 'pending'" class="wrap reader__loading muted" role="status" aria-live="polite">正在载入篇章…</div>
</template>

<style scoped>
.reader { padding-block: 2rem 5rem; }
.reader__breadcrumbs { margin-bottom: 2.75rem; }
.reader__breadcrumbs ol { display: flex; flex-wrap: wrap; gap: .5rem .65rem; margin: 0; padding: 0; list-style: none; font-size: .75rem; }
.reader__breadcrumbs li { min-width: 0; overflow-wrap: anywhere; }
.reader__breadcrumbs li + li::before { content: '/'; margin-right: .65rem; color: var(--muted); }
.reader__layout { min-width: 0; }
.reader__article { min-width: 0; max-width: 49rem; margin-inline: auto; }
.reader__header { padding-bottom: 2.25rem; margin-bottom: 2.75rem; border-bottom: 1px solid var(--line); }
.reader__title { margin: .85rem 0 1.5rem; font-family: var(--serif); font-size: clamp(2rem, 4.8vw, 3.7rem); font-weight: 500; line-height: 1.3; letter-spacing: -.035em; overflow-wrap: anywhere; }
.reader__metadata { display: flex; flex-wrap: wrap; gap: .5rem 1.1rem; font-family: var(--sans); font-size: .75rem; line-height: 1.8; }
.reader__author { color: var(--text); }
.reader__tags { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.2rem 0 0; padding: 0; list-style: none; }
.reader__footer { margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid var(--line); }
.reader__pagination { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.75rem; margin-bottom: 2rem; }
.reader__neighbor { display: flex; min-width: 0; flex-direction: column; gap: .65rem; text-decoration: none; }
.reader__neighbor--next { grid-column: 2; text-align: right; }
.reader__neighbor-label { color: var(--muted); font-family: var(--sans); font-size: .75rem; }
.reader__neighbor-title { font-family: var(--serif); font-size: 1.1rem; line-height: 1.6; overflow-wrap: anywhere; }
.reader__neighbor:hover .reader__neighbor-title { color: var(--accent); }
.reader__back { display: inline-block; font-size: .85rem; }
.reader__sidebar { min-width: 0; }
.reader__series { padding-top: 1.5rem; border-top: 1px solid var(--line); }
.reader__series h2 { margin: .65rem 0 1.25rem; font-family: var(--serif); font-size: 1.2rem; font-weight: 500; line-height: 1.6; overflow-wrap: anywhere; }
.reader__series ol { display: grid; gap: .2rem; margin: 0; padding: 0; list-style: none; }
.reader__series li { min-width: 0; }
.reader__series li a { display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); gap: .5rem; padding: .65rem .6rem; border-radius: .2rem; color: var(--muted); font-size: .8rem; line-height: 1.65; text-decoration: none; overflow-wrap: anywhere; }
.reader__series li a:hover { color: var(--accent); }
.reader__series li a[aria-current='page'] { background: var(--surface); color: var(--accent); }
.reader__series-number { padding-top: .1rem; font-family: var(--mono); font-size: .65rem; }
.reader__series-back { display: inline-block; margin-top: 1.25rem; font-size: .75rem; }
.reader__loading { padding-block: 5rem; }
@media (min-width: 64rem) {
  .reader__layout--with-series { display: grid; grid-template-columns: minmax(0, 1fr) 15rem; align-items: start; gap: clamp(2.5rem, 5vw, 5.5rem); }
  .reader__layout--with-series .reader__article { width: 100%; margin-inline: 0; }
  .reader__sidebar { position: sticky; top: 6rem; max-height: calc(100dvh - 8rem); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; }
}
@media (max-width: 63.99rem) {
  .reader__sidebar { max-width: 49rem; margin: 3rem auto 0; }
}
@media (max-width: 35rem) {
  .reader { padding-top: 1.5rem; }
  .reader__breadcrumbs { margin-bottom: 2rem; }
  .reader__header { margin-bottom: 2rem; }
  .reader__metadata { flex-direction: column; gap: .25rem; }
  .reader__pagination { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
  .reader__neighbor--next { grid-column: 1; }
}
</style>
