<script setup lang="ts">
const { data: posts } = await usePostIndex();
const asset = useAssetUrl();
const groups = computed(() => groupSeries(posts.value));
const latest = computed(() => [...posts.value].sort((a, b) => (b.updated || b.date).localeCompare(a.updated || a.date)).slice(0, 4));
useSeoMeta({ title: '个人志', description: 'kenichiLyon / 顾子深的个人创作档案。关于代码，也关于虚构世界中的人和事。' });
</script>

<template>
  <div class="home wrap">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> Independent writing & other worlds</p>
        <h1 id="home-title">在文字里，<br>让世界<em>发生。</em></h1>
        <p class="hero-intro">你好，我是 <strong>kenichiLyon / 顾子深</strong>。<br>写代码，也写故事。这里存放我的创作、角色，<br class="desktop-break">以及那些尚未抵达现实的世界。</p>
        <div class="hero-actions"><NuxtLink to="/directory/" class="button">打开创作档案 <span aria-hidden="true">↗</span></NuxtLink><NuxtLink to="/#about" class="text-link">关于我 <span aria-hidden="true">↓</span></NuxtLink></div>
        <div class="hero-notes"><span><b>{{ String(posts.length).padStart(2, '0') }}</b> 篇文章</span><span><b>{{ String(groups.length).padStart(2, '0') }}</b> 个系列</span><span class="hero-since">Writing since <b>2019</b></span></div>
      </div>
      <figure class="hero-art">
        <div class="hero-art__top"><span>FIELD NOTES — 001</span><span aria-hidden="true">✳</span></div>
        <div class="hero-art__image"><img :src="asset('/images/hero.webp')" alt="面向未来城市的科幻指挥室，屏幕前的身影正在观察数据" width="1731" height="909" fetchpriority="high"><div class="image-note"><span>BETWEEN CODE<br>AND FICTION.</span><span aria-hidden="true">↗</span></div></div>
        <figcaption><span>一端是代码，另一端是想象。</span><span>KENICHI LYON</span></figcaption>
      </figure>
    </section>

    <section class="home-section worlds-section" aria-labelledby="worlds-title">
      <div class="section-heading"><div><p class="eyebrow">01 / The collections</p><h2 id="worlds-title">两个世界，<span>不同回声。</span></h2></div><NuxtLink to="/directory/" class="text-link">完整目录 ↗</NuxtLink></div>
      <div class="world-grid"><NuxtLink v-for="(group, index) in groups" :key="group.name" :to="{ path: '/posts/', query: { series: group.name } }" class="world-card" :class="{ 'world-card--stage': group.world === 'stageworld' }">
        <div class="world-card__top"><span class="eyebrow">{{ group.world }}</span><span class="world-card__number" aria-hidden="true">0{{ index + 1 }}</span></div>
        <div class="world-card__content"><p class="world-card__type">{{ group.world === 'knowledgeworld' ? 'WORLD BUILDING / 世界观与人物' : 'STORIES / 舞台与聚光灯' }}</p><h3>{{ group.name }}</h3></div>
        <div class="world-card__bottom"><span>{{ group.posts.length }} 篇档案 <span class="world-card__separator">/</span> {{ [...new Set(group.posts.flatMap(p => p.tags))].length }} 个主题</span><span class="circle-arrow" aria-hidden="true">↗</span></div>
      </NuxtLink></div>
    </section>

    <section class="home-section" aria-labelledby="latest-title">
      <div class="section-heading"><div><p class="eyebrow">02 / Recent entries</p><h2 id="latest-title">最近，<span>写下的。</span></h2></div><NuxtLink to="/posts/" class="text-link">全部文章 ↗</NuxtLink></div>
      <div class="post-list"><PostRow v-for="post in latest" :key="post.slug" :post="post" /></div>
    </section>

    <section id="about" class="home-section about-section" aria-labelledby="about-title">
      <div class="about-intro"><p class="eyebrow">03 / Behind the words</p><h2 id="about-title">不止一种<br><em>身份。</em></h2><p>kenichiLyon / 顾子深<br><span>Tzushin Gu · 2004.08 · Virgo</span></p><p class="personal-signal">“don't want to be the bébé,<br>you know i'm sick of lying”</p></div>
      <div class="about-details"><dl class="about-facts"><div><dt>学习 / Education</dt><dd>人工智能技术应用<br>计算机网络技术</dd></div><div><dt>代码 / Languages</dt><dd>Golang · Python<br>TypeScript</dd></div><div><dt>专注 / Focus</dt><dd>AIOps · AI SRE<br>Product Management</dd></div></dl><article class="project-note"><div><p class="eyebrow">Academic project</p><h3>CloudTraceHub</h3><p>AI Agentic Util for Auto DevOps + AI</p></div><span class="project-symbol" aria-hidden="true">✳</span></article></div>
    </section>
  </div>
</template>
