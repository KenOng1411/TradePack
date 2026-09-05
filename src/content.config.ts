import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(["en", "ko", "de", "vi", "zh-hant"]),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    author: z.string().default("TradePack Team"),
  }),
});

export const collections = { blog };
