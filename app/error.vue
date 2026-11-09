<script setup lang="ts">
import type { NuxtError } from '#app';
defineProps<{ error: NuxtError }>();
const recover = () => clearError({ redirect: '/' });
useSeoMeta({ title: '页面未找到', robots: 'noindex' });
</script>
<template><div class="error-page wrap"><p class="eyebrow">Lost in the archive</p><h1>{{ error.statusCode || 500 }}</h1><h2>{{ error.statusCode === 404 ? '这一页，还没有被写下。' : '页面暂时无法打开。' }}</h2><p class="muted">{{ error.statusCode === 404 ? '可以回到首页，或从创作目录继续阅读。' : error.statusMessage }}</p><button class="button" @click="recover">返回首页 ↗</button></div></template>
