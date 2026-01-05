// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent, MicroCMSImage } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 型定義
export type Tag = {
    name: string;
} & MicroCMSListContent;

export type Blog = {
    title: string;
    content: string;
    eyecatch?: MicroCMSImage;
    tag?: Tag[];
} & MicroCMSListContent;

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
    return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
    contentId: string,
    queries?: MicroCMSQueries
) => {
    return await client.getListDetail<Blog>({
        endpoint: "blogs",
        contentId,
        queries,
    });
};
