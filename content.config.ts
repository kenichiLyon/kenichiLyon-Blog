import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

const blog = defineCollection({
  type: "page",
  source: "posts/**/*.md",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    updated: z.string().optional(),
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

export default defineContentConfig({
  collections: { blog },
});
