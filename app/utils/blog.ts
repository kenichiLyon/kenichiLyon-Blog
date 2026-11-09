import type { Collections } from '@nuxt/content';

export type BlogPost = Collections['blog'];
export type PostSummary = Pick<BlogPost, 'title' | 'slug' | 'date' | 'updated' | 'author' | 'series' | 'categories' | 'tags' | 'source' | 'order'>;
export type SeriesGroup = { name: string; world: string; posts: PostSummary[] };
export type DirectoryNode = { name: string; children: DirectoryNode[]; posts: PostSummary[] };

export function postPath(post: Pick<PostSummary, 'slug'>) { return '/posts/' + post.slug + '/'; }
export function formatDate(value: string | Date) { return (value instanceof Date ? value.toISOString() : value).slice(0, 10).replaceAll('-', '.'); }
export function worldOf(post: PostSummary) { return post.categories.find(c => c !== '创作') || 'archive'; }
export function groupSeries(posts: PostSummary[]): SeriesGroup[] {
  const groups = new Map<string, SeriesGroup>();
  for (const post of posts) {
    const name = post.series || '独立篇章';
    if (!groups.has(name)) groups.set(name, { name, world: worldOf(post), posts: [] });
    groups.get(name)!.posts.push(post);
  }
  return [...groups.values()];
}
export function buildDirectory(posts: PostSummary[]): DirectoryNode {
  const root: DirectoryNode = { name: 'Archive', children: [], posts: [] };
  for (const post of posts) {
    let node = root;
    for (const name of post.source.split('/').slice(0, -1)) {
      let child = node.children.find(c => c.name === name);
      if (!child) { child = { name, children: [], posts: [] }; node.children.push(child); }
      node = child;
    }
    node.posts.push(post);
  }
  return root;
}
export function contentText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    if (typeof value[0] === 'string' && value[1] && typeof value[1] === 'object' && !Array.isArray(value[1])) {
      if (value[0] === 'img') return '';
      return value.slice(2).map(contentText).join(' ');
    }
    return value.map(contentText).join(' ');
  }
  if (value && typeof value === 'object' && 'value' in value) return contentText(value.value);
  return '';
}
export function readingMinutes(body: unknown) {
  const text = contentText(body);
  const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.match(/[A-Za-z0-9]+/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 400 + words / 220));
}
