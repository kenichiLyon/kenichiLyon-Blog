<script setup lang="ts">
import type { PostSummary } from '~/utils/blog';
defineProps<{ post: PostSummary }>();
</script>
<template>
  <article class="post-row">
    <span class="post-row__number">{{ String(post.order).padStart(2, '0') }}</span>
    <div class="post-row__body">
      <p class="post-row__category">{{ worldOf(post) }} <span>/</span> {{ post.tags[0] || 'Writing' }}</p>
      <h2><NuxtLink :to="postPath(post)">{{ post.title }}</NuxtLink></h2>
      <p class="post-row__series">{{ post.series }}</p>
    </div>
    <div class="post-row__end"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span aria-hidden="true">↗</span></div>
  </article>
</template>
