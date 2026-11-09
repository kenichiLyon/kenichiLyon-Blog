export function usePostIndex() {
  return useAsyncData('post-index', () => queryCollection('blog')
    .where('draft', '=', false)
    .select('title', 'slug', 'date', 'updated', 'author', 'series', 'categories', 'tags', 'source', 'order')
    .order('order', 'ASC').all(), { default: () => [] });
}
