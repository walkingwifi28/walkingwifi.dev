import { defineCollection, z } from 'astro:content';

const blogsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        thumbnail: z.string().optional(),
        description: z.string().optional(),
    }),
});

export const collections = {
    'blogs': blogsCollection,
};
