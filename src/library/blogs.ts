// Blog型定義
export interface Blog {
    id: string;
    title: string;
    content: string;
    eyecatch?: { url: string; width: number; height: number };
    tag?: { name: string }[];
    createdAt: string;
    updatedAt: string;
}

// 静的なプレースホルダーデータ
export const placeholderBlogs: Blog[] = [
    {
        id: "sample-1",
        title: "サンプル記事 1",
        content: "<p>これはサンプル記事の内容です。実際のコンテンツに置き換えてください。</p>",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        tag: [{ name: "サンプル" }],
    },
    {
        id: "sample-2",
        title: "サンプル記事 2",
        content: "<p>これはサンプル記事の内容です。実際のコンテンツに置き換えてください。</p>",
        createdAt: "2026-01-02T00:00:00.000Z",
        updatedAt: "2026-01-02T00:00:00.000Z",
        tag: [{ name: "テスト" }],
    },
    {
        id: "sample-3",
        title: "サンプル記事 3",
        content: "<p>これはサンプル記事の内容です。実際のコンテンツに置き換えてください。</p>",
        createdAt: "2026-01-03T00:00:00.000Z",
        updatedAt: "2026-01-03T00:00:00.000Z",
        tag: [{ name: "開発" }],
    },
];

// ブログ一覧を取得
export const getBlogs = (): Blog[] => {
    return placeholderBlogs;
};

// ブログ詳細を取得
export const getBlogDetail = (id: string): Blog | undefined => {
    return placeholderBlogs.find((blog) => blog.id === id);
};
