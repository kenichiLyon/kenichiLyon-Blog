import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";

const root = process.cwd();
const manifestPath = path.join(root, "site", "content", "posts.json");
const destinationRoot = path.join(root, "src", "content", "blog");
const author = "Yamamoto Kenichi";

if (!fs.existsSync(manifestPath)) {
  throw new Error("Missing site/content/posts.json. Run this migration before removing the previous static output.");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

fs.rmSync(destinationRoot, { recursive: true, force: true });
fs.mkdirSync(destinationRoot, { recursive: true });

for (const item of manifest) {
  const storedMarkdown = path.join(root, "site", item.stored_markdown);
  const markdownDir = path.dirname(storedMarkdown);
  const slug = item.url.replace(/^\/posts\//, "").replace(/\/$/, "");
  const outputDir = path.join(destinationRoot, ...slug.split("/"));
  fs.mkdirSync(outputDir, { recursive: true });

  const { frontmatter, body } = parseMarkdown(fs.readFileSync(storedMarkdown, "utf8"));
  const imageMap = copyAssets(markdownDir, outputDir);
  const cleanedBody = stripDuplicateTitle(rewriteImageRefs(body, imageMap), item.title);

  const nextFrontmatter = {
    title: item.title,
    date: item.date,
    updated: item.updated,
    author,
    last_modified_by: author,
    categories: item.categories ?? [],
    series: item.series ?? "",
    tags: item.tags ?? [],
    source: item.source,
    source_file: frontmatter.source_file ?? "",
    source_format: frontmatter.source_format ?? "",
    order: item.order,
    slug,
    draft: false,
  };

  const text = `---\n${YAML.stringify(nextFrontmatter).trim()}\n---\n\n${cleanedBody.trimStart()}`;
  fs.writeFileSync(path.join(outputDir, "index.md"), text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

console.log(`Migrated ${manifest.length} posts to ${path.relative(root, destinationRoot)}`);

function parseMarkdown(text) {
  const normalized = text.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return { frontmatter: {}, body: normalized };
  }
  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) {
    return { frontmatter: {}, body: normalized };
  }
  const rawFrontmatter = normalized.slice(4, end);
  return {
    frontmatter: YAML.parse(rawFrontmatter) ?? {},
    body: normalized.slice(end + "\n---\n".length),
  };
}

function copyAssets(sourceDir, outputDir) {
  const map = new Map();
  const files = fs.readdirSync(sourceDir, { withFileTypes: true }).filter((entry) => entry.isFile());
  let assetIndex = 1;

  for (const file of files) {
    if (file.name === "post.md") {
      continue;
    }
    const sourcePath = path.join(sourceDir, file.name);
    const data = fs.readFileSync(sourcePath);
    const extension = detectImageExtension(data);
    if (!extension) {
      continue;
    }
    const stem = path.basename(outputDir);
    const nextName = `${stem}-asset-${String(assetIndex).padStart(2, "0")}${extension}`;
    fs.copyFileSync(sourcePath, path.join(outputDir, nextName));
    map.set(file.name, nextName);
    assetIndex += 1;
  }

  return map;
}

function detectImageExtension(data) {
  if (data.length < 16) {
    return "";
  }
  if (data.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return ".jpg";
  }
  if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return ".png";
  }
  if (data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") {
    return ".webp";
  }
  if (data.subarray(0, 3).toString("ascii") === "GIF") {
    return ".gif";
  }
  return "";
}

function rewriteImageRefs(body, imageMap) {
  return body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_full, alt, ref) => {
    const cleanRef = ref.replace(/^\.\//, "");
    return `![${alt}](./${imageMap.get(cleanRef) ?? cleanRef})`;
  });
}

function stripDuplicateTitle(body, title) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstContentIndex === -1) {
    return body;
  }

  const first = lines[firstContentIndex].trim();
  const firstText = first.replace(/^#{1,6}\s+/, "").trim();
  if (normalizeTitle(firstText) !== normalizeTitle(title)) {
    return body;
  }

  lines.splice(firstContentIndex, 1);
  while (lines[firstContentIndex] !== undefined && lines[firstContentIndex].trim() === "") {
    lines.splice(firstContentIndex, 1);
  }
  return lines.join("\n").replace(/^\n+/, "");
}

function normalizeTitle(value) {
  return String(value).trim().replace(/\s+/g, " ");
}
