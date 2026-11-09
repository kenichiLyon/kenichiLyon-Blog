<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const props = defineProps<{ src?: string; alt?: string; title?: string; width?: string | number; height?: string | number }>();
const asset = useAssetUrl();
const source = computed(() => props.src ? asset(props.src) : undefined);
</script>
<template><img v-bind="$attrs" :src="source" :alt="alt || ''" :title="title" :width="width" :height="height" loading="lazy" decoding="async" /></template>
