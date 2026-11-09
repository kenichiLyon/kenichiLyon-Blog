<script setup lang="ts">
const route = useRoute();
const mode = useColorMode();
const links = [{ path: '/', label: '首页', en: 'Index' }, { path: '/posts/', label: '文章', en: 'Writing' }, { path: '/directory/', label: '目录', en: 'Archive' }];
function active(path: string) { return path === '/' ? route.path === '/' : route.path.startsWith(path.replace(/\/$/, '')); }
function toggleTheme() { mode.preference = mode.value === 'dark' ? 'light' : 'dark'; }
</script>
<template>
  <header class="site-header"><div class="wrap header-inner">
    <NuxtLink to="/" class="brand" aria-label="kenichiLyon 首页"><span class="brand-mark" aria-hidden="true">k.</span><span>kenichiLyon<span class="brand-sub">A PERSONAL JOURNAL</span></span></NuxtLink>
    <div class="header-right"><nav aria-label="主导航"><NuxtLink v-for="link in links" :key="link.path" :to="link.path" :class="{ 'is-active': active(link.path) }" :aria-current="active(link.path) ? 'page' : undefined"><span>{{ link.label }}</span><small>{{ link.en }}</small></NuxtLink></nav>
    <button class="theme-toggle" type="button" aria-label="切换明暗主题" @click="toggleTheme"><svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg><svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.5 13.5A9 9 0 0 1 10.5 3.5a9 9 0 1 0 10 10Z"/></svg></button></div>
  </div></header>
</template>
