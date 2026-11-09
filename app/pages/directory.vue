<script setup lang="ts">
import { buildDirectory, groupSeries } from '~/utils/blog';

const { data: posts } = await usePostIndex();
const directory = computed(() => buildDirectory(posts.value));
const seriesGroups = computed(() => groupSeries(posts.value));

useSeoMeta({
  title: '阅读目录',
  description: '沿着来源目录与系列阅读顺序，探索全部故事与篇章。',
});
</script>

<template>
  <div class="wrap directory-page">
    <header class="page-head">
      <p class="eyebrow">Reading atlas · 故事地图</p>
      <h1 class="page-title">阅读目录</h1>
      <p class="muted directory-intro">循着系列依次阅读，或展开来源目录，回到每一篇文字最初的位置。</p>
      <NuxtLink class="text-link" to="/posts/">前往文章索引 →</NuxtLink>
    </header>

    <div v-if="posts.length" class="directory-layout">
      <aside class="directory-sidebar" aria-labelledby="source-directory-title">
        <div class="source-panel panel">
          <p class="eyebrow">Source tree</p>
          <h2 id="source-directory-title">来源目录</h2>
          <p class="muted tree-hint">点击目录展开或收起；键盘可用 Enter 或空格切换。</p>
          <nav aria-label="文章来源目录">
            <DirectoryBranch :node="directory" />
          </nav>
        </div>
        <nav class="series-navigation" aria-label="跳转到系列">
          <h2>系列导览</h2>
          <ol>
            <li v-for="(group, index) in seriesGroups" :key="group.name">
              <a :href="`#series-${index + 1}`"><span>{{ group.name }}</span><span class="muted">{{ group.posts.length }}</span></a>
            </li>
          </ol>
        </nav>
      </aside>

      <div class="series-directory">
        <div class="directory-overview">
          <h2>沿系列阅读</h2>
          <p class="muted">{{ seriesGroups.length }} 个系列 · {{ posts.length }} 篇文章</p>
        </div>
        <section
          v-for="(group, index) in seriesGroups"
          :id="`series-${index + 1}`"
          :key="group.name"
          class="series-section"
          :aria-labelledby="`series-title-${index + 1}`"
        >
          <header class="series-heading">
            <span class="series-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="series-heading-text">
              <p class="eyebrow">{{ group.world }}</p>
              <h2 :id="`series-title-${index + 1}`">{{ group.name }}</h2>
            </div>
            <span class="series-count muted">{{ group.posts.length }} 篇</span>
          </header>
          <div class="post-list">
            <PostRow v-for="post in group.posts" :key="post.slug" :post="post" />
          </div>
        </section>
      </div>
    </div>
    <div v-else class="empty-state">
      <h2>目录尚无篇章</h2>
      <p class="muted">已发布的文章会按来源和系列排列在这里。</p>
      <NuxtLink class="text-link" to="/posts/">浏览文章索引 →</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.directory-page { padding-bottom: 6rem; }
.directory-intro { max-width: 40rem; }
.directory-layout { display: grid; grid-template-columns: minmax(13rem, .8fr) minmax(0, 2fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: start; }
.directory-sidebar, .series-directory { min-width: 0; }
.source-panel { padding: 1.35rem; }
.source-panel > .eyebrow { margin-top: 0; }
.source-panel h2, .series-navigation h2 { margin: .5rem 0 1rem; font: 600 1.2rem var(--serif); }
.tree-hint { margin: 0 0 1.25rem; font-size: .75rem; line-height: 1.8; }
.series-navigation { margin-top: 2rem; padding: 0 .5rem; }
.series-navigation ol { margin: 0; padding-left: 1.2rem; color: var(--muted); }
.series-navigation li { padding-left: .35rem; font-size: .8rem; }
.series-navigation li + li { margin-top: .8rem; }
.series-navigation a { display: flex; justify-content: space-between; gap: .8rem; color: var(--text); line-height: 1.7; text-decoration: none; }
.series-navigation a > span:first-child { min-width: 0; overflow-wrap: anywhere; }
.series-navigation a > span:last-child { flex-shrink: 0; font-family: var(--mono); }
.series-navigation a:hover { color: var(--accent); }
.series-navigation a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
.directory-overview { display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: .5rem 1rem; margin-bottom: 2rem; }
.directory-overview h2 { margin: 0; font: 600 1.3rem var(--serif); }
.directory-overview p { margin: 0; font-size: .75rem; }
.series-section { scroll-margin-top: 6rem; }
.series-section + .series-section { margin-top: 3.5rem; }
.series-heading { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--line); }
.series-number { color: var(--accent); font: .85rem var(--mono); }
.series-heading-text { min-width: 0; flex: 1; }
.series-heading .eyebrow { margin: 0 0 .45rem; }
.series-heading h2 { margin: 0; font: 600 clamp(1.4rem, 2.5vw, 1.9rem)/1.5 var(--serif); overflow-wrap: anywhere; }
.series-count { flex-shrink: 0; font-size: .75rem; }
.empty-state h2 { font-family: var(--serif); }
@media (max-width: 800px) {
  .directory-layout { grid-template-columns: minmax(0, 1fr); }
  .directory-sidebar { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); align-items: start; gap: 1.5rem; }
  .series-navigation { margin-top: 0; }
}
@media (max-width: 540px) {
  .directory-sidebar { grid-template-columns: minmax(0, 1fr); }
  .series-navigation { padding: 0; }
  .series-heading { gap: .7rem; }
}
</style>
