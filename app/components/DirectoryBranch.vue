<script setup lang="ts">
import { postPath, type DirectoryNode } from '~/utils/blog';

withDefaults(defineProps<{ node: DirectoryNode; depth?: number }>(), { depth: 0 });
</script>

<template>
  <ul class="directory-branch">
    <li v-for="child in node.children" :key="child.name" class="directory-folder">
      <details :open="depth === 0">
        <summary><span>{{ child.name }}</span></summary>
        <DirectoryBranch :node="child" :depth="depth + 1" />
      </details>
    </li>
    <li v-for="post in node.posts" :key="post.slug" class="directory-leaf">
      <NuxtLink :to="postPath(post)">{{ post.title }}</NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.directory-branch { list-style: none; margin: 0; padding: 0; }
.directory-folder + .directory-folder, .directory-leaf + .directory-leaf { margin-top: .45rem; }
.directory-folder summary { padding: .35rem 0; cursor: pointer; color: var(--text); font-size: .85rem; line-height: 1.65; overflow-wrap: anywhere; }
.directory-folder summary::marker { color: var(--accent); font-size: .8em; }
.directory-folder summary span { margin-left: .25rem; }
.directory-folder summary:focus-visible, .directory-leaf a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: .1rem; }
.directory-folder .directory-branch { margin: .35rem 0 .65rem .3rem; padding-left: .9rem; border-left: 1px solid var(--line); }
.directory-leaf { padding: .25rem 0; }
.directory-leaf a { display: inline-block; color: var(--muted); font-size: .8rem; line-height: 1.8; text-decoration: none; overflow-wrap: anywhere; }
.directory-leaf a:hover { color: var(--accent); text-decoration: underline; text-underline-offset: .2em; }
</style>
