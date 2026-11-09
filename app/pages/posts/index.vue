<script setup lang="ts">
import { groupSeries } from '~/utils/blog';

const route = useRoute();
const router = useRouter();
const { data: posts } = await usePostIndex();

useSeoMeta({
  title: '文章索引',
  description: '按阅读顺序浏览全部文章，或通过标题、系列、标签与来源查找篇章。',
});

function queryText(value: unknown): string {
  const first = Array.isArray(value) ? value[0] : value;
  return typeof first === 'string' ? first : '';
}

const selectedSeries = computed(() => queryText(route.query.series));
const searchQuery = computed({
  get: () => queryText(route.query.q),
  set: (value: string) => updateFilters(value, selectedSeries.value),
});
const seriesGroups = computed(() => groupSeries(posts.value));
const filteredPosts = computed(() => {
  const search = searchQuery.value.trim().toLocaleLowerCase();
  return posts.value.filter((post) => {
    if (selectedSeries.value && (post.series || '独立篇章') !== selectedSeries.value) return false;
    if (!search) return true;
    return [post.title, post.series || '', ...post.tags, post.source]
      .some((value) => value.toLocaleLowerCase().includes(search));
  });
});
const hasFilters = computed(() => Boolean(searchQuery.value || selectedSeries.value));

function updateFilters(search: string, series: string) {
  void router.replace({
    query: { ...route.query, q: search || undefined, series: series || undefined },
    hash: route.hash,
  });
}

function resetFilters() {
  updateFilters('', '');
}
</script>

<template>
  <div class="wrap archive-page">
    <header class="page-head">
      <p class="eyebrow">The archive · 全部篇章</p>
      <h1 class="page-title">文章索引</h1>
      <p class="muted archive-intro">故事有各自的来处，也有相遇的顺序。在这里，从一篇文字开始。</p>
      <NuxtLink class="text-link" to="/directory/">沿着目录寻找 →</NuxtLink>
    </header>

    <section class="archive-filters panel" aria-labelledby="archive-filter-title">
      <h2 id="archive-filter-title" class="filter-title">寻找一篇文章</h2>
      <form class="archive-search" role="search" @submit.prevent>
        <label for="archive-search">搜索标题、系列、标签或来源</label>
        <div class="search-field">
          <input
            id="archive-search"
            v-model="searchQuery"
            type="search"
            name="q"
            placeholder="输入关键词……"
            autocomplete="off"
            aria-controls="archive-results"
          >
          <button v-if="searchQuery" class="text-link clear-search" type="button" @click="updateFilters('', selectedSeries)">清除搜索</button>
        </div>
      </form>
      <fieldset class="series-filter">
        <legend>按系列浏览</legend>
        <div class="series-chips">
          <button
            class="chip"
            :class="{ 'is-active': !selectedSeries }"
            type="button"
            :aria-pressed="!selectedSeries"
            @click="updateFilters(searchQuery, '')"
          >全部系列 <span>{{ posts.length }}</span></button>
          <button
            v-for="group in seriesGroups"
            :key="group.name"
            class="chip"
            :class="{ 'is-active': selectedSeries === group.name }"
            type="button"
            :aria-pressed="selectedSeries === group.name"
            @click="updateFilters(searchQuery, group.name)"
          >{{ group.name }} <span>{{ group.posts.length }}</span></button>
        </div>
      </fieldset>
    </section>

    <section id="archive-results" class="archive-results" aria-labelledby="archive-results-title">
      <div class="results-heading">
        <div>
          <h2 id="archive-results-title">{{ hasFilters ? '检索结果' : '全部文章' }}</h2>
          <p class="muted" role="status" aria-live="polite">共 {{ filteredPosts.length }} 篇<span v-if="hasFilters"> / 全部 {{ posts.length }} 篇</span> · 按阅读顺序排列</p>
        </div>
        <button v-if="hasFilters" class="text-link" type="button" @click="resetFilters">重置筛选</button>
      </div>
      <div v-if="filteredPosts.length" class="post-list">
        <PostRow v-for="post in filteredPosts" :key="post.slug" :post="post" />
      </div>
      <div v-else class="empty-state">
        <h3>暂未找到相符的篇章</h3>
        <p class="muted">试试其他关键词，或清除筛选，重新浏览全部文章。</p>
        <button class="button" type="button" @click="resetFilters">查看全部文章</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.archive-page { padding-bottom: 6rem; }
.archive-intro { max-width: 39rem; }
.archive-filters { padding: clamp(1.25rem, 3vw, 2rem); }
.filter-title { margin: 0 0 1.5rem; font: 600 1.35rem var(--serif); }
.archive-search label, .series-filter legend { display: block; margin-bottom: .65rem; color: var(--muted); font-size: .8rem; }
.search-field { display: flex; align-items: center; gap: 1rem; }
.search-field input { width: 100%; min-width: 0; border: 1px solid var(--line); border-radius: .25rem; padding: .85rem 1rem; background: var(--bg); color: var(--text); font: inherit; }
.search-field input::placeholder { color: var(--muted); }
.search-field input:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.clear-search { flex-shrink: 0; }
.series-filter { min-width: 0; margin: 1.5rem 0 0; padding: 0; border: 0; }
.series-chips { display: flex; flex-wrap: wrap; gap: .55rem; }
.series-chips .chip { max-width: 100%; overflow-wrap: anywhere; text-align: left; }
.series-chips .chip span { margin-left: .4rem; font-family: var(--mono); font-size: .75em; }
.archive-results { margin-top: 3rem; }
.results-heading { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.results-heading h2 { margin: 0; font: 600 1.45rem var(--serif); }
.results-heading p { margin: .5rem 0 0; font-size: .8rem; }
.results-heading > button { flex-shrink: 0; }
.empty-state h3 { font-family: var(--serif); }
.empty-state .button { margin-top: .75rem; }
@media (max-width: 540px) {
  .search-field { align-items: stretch; flex-direction: column; gap: .65rem; }
  .clear-search { align-self: flex-start; }
  .results-heading { align-items: flex-start; }
}
</style>
