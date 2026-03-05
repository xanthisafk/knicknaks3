import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // Use glob loader for files in src/content/blog/
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    tags: z.array(z.string()),
    coverImage: z.string(), // Path to image
    isFeatured: z.boolean().optional().default(false),
    isSticky: z.boolean().optional().default(false),
    seoTitle: z.string(),
    seoDescription: z.string(),
  }),
});

export const collections = { blog };
