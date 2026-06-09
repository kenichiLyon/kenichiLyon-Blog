import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export type DirectoryNode = {
  name: string;
  children: DirectoryNode[];
  posts: BlogPost[];
};

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => a.data.order - b.data.order);
}

export function buildDirectoryTree(posts: BlogPost[]) {
  const root: DirectoryNode = { name: "root", children: [], posts: [] };

  for (const post of sortPosts(posts)) {
    const parts = post.data.source.split("/").slice(0, -1);
    let node = root;
    for (const part of parts) {
      let child = node.children.find((item) => item.name === part);
      if (!child) {
        child = { name: part, children: [], posts: [] };
        node.children.push(child);
      }
      node = child;
    }
    node.posts.push(post);
  }

  return root;
}

export function renderDirectoryTree(node: DirectoryNode): string {
  const childItems = node.children
    .map((child) => `<li><span>${escapeHtml(child.name)}</span>${renderDirectoryTree(child)}</li>`)
    .join("");
  const postItems = node.posts
    .map((post) => `<li><a href="${postUrl(post)}">${escapeHtml(post.data.title)}</a></li>`)
    .join("");

  return `<ul>${childItems}${postItems}</ul>`;
}

export function formatDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.length >= 10 ? value.slice(0, 10) : value;
}

export function postUrl(post: BlogPost) {
  return sitePath(`/posts/${post.data.slug}/`);
}

export function sitePath(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
