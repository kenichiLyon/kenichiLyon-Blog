import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.string(), z.date()]),
    updated: z.union([z.string(), z.date()]).optional(),
    author: z.string(),
    last_modified_by: z.string(),
    categories: z.array(z.string()).default([]),
    series: z.string().optional(),
    tags: z.array(z.string()).default([]),
    source: z.string(),
    source_file: z.string().optional(),
    source_format: z.string().optional(),
    order: z.number(),
    slug: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
