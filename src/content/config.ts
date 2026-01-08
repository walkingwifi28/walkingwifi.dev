import { defineCollection, z, reference } from 'astro:content';

const tagsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
    }),
});

const blogsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        createdAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        thumbnail: z.string().optional(),
        description: z.string().optional(),
        // TinaCMS は参照を "src/content/tags/xxx.md" 形式で保存するため、
        // reference() ではなく string として受け取る
        tags: z.array(z.object({
            tag: z.string(),
        })).optional(),
    }),
});

export const collections = {
    'blogs': blogsCollection,
    'tags': tagsCollection,
};
