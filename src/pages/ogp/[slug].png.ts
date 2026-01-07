import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";
import satori from "satori";
import sharp from "sharp";

// Google Fonts から Noto Sans JP を取得
async function loadGoogleFont(
    font: string,
    weight: number,
): Promise<ArrayBuffer> {
    const API = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`;
    const css = await (
        await fetch(API, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        })
    ).text();

    const fontUrl = css.match(
        /src: url\((.+)\) format\('(opentype|truetype)'\)/,
    )?.[1];
    if (!fontUrl) throw new Error("Font URL not found");
    return await (await fetch(fontUrl)).arrayBuffer();
}

// TinaCMS のパス形式 "src/content/tags/xxx.md" から ID を抽出
function extractTagId(tagPath: string): string | null {
    const match = tagPath.match(/src\/content\/tags\/(.+)\.md$/);
    return match ? match[1] : null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    const blogs = await getCollection("blogs");
    return await Promise.all(
        blogs.map(async (blog) => {
            // タグ情報を取得（存在しないタグはスキップ）
            const tagPaths = blog.data.tags?.map((t) => t.tag) || [];
            const tagPromises = tagPaths.map(async (tagPath) => {
                const tagId = extractTagId(tagPath);
                if (!tagId) return null;
                try {
                    const entry = await getEntry("tags", tagId);
                    return entry;
                } catch {
                    return null;
                }
            });

            const rawTags = await Promise.all(tagPromises);
            const tags = rawTags.filter((t) => t !== null);
            const tagNames = tags.map((t) => t.data.name);

            return {
                params: { slug: blog.id.replace(/\.md$/, "") },
                props: { title: blog.data.title, tagNames },
            };
        }),
    );
};

export const GET: APIRoute = async ({ props }) => {
    const { title, tagNames } = props as { title: string; tagNames: string[] };

    // フォントを読み込み
    const fontData = await loadGoogleFont("Noto+Sans+JP", 700);

    // タグ要素を生成
    const tagElements = tagNames.map((name) => ({
        type: "span",
        props: {
            style: {
                fontSize: "20px",
                padding: "4px 12px",
                backgroundColor: "#e4e4e7",
                borderRadius: "9999px",
                color: "#71717a",
            },
            children: `#${name}`,
        },
    }));

    // satori で SVG を生成
    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    width: "1200px",
                    height: "630px",
                    display: "flex",
                    background: "linear-gradient(135deg, #A0A1B5 0%, #BB99C0 100%)",
                    padding: "50px",
                },
                children: [
                    // 白い内側エリア
                    {
                        type: "div",
                        props: {
                            style: {
                                width: "100%",
                                height: "100%",
                                backgroundColor: "white",
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                padding: "40px 60px",
                            },
                            children: [
                                // タイトル（左上）
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "56px",
                                            fontWeight: 700,
                                            color: "#27272a",
                                            lineHeight: 1.4,
                                            maxWidth: "900px",
                                            wordBreak: "break-word",
                                        },
                                        children: title,
                                    },
                                },
                                // 下部エリア（タグ左、walkingwifi右）
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-end",
                                            width: "100%",
                                        },
                                        children: [
                                            // タグ（左）
                                            {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "8px",
                                                    },
                                                    children: tagElements,
                                                },
                                            },
                                            // walkingwifi（右）
                                            {
                                                type: "div",
                                                props: {
                                                    style: {
                                                        fontSize: "32px",
                                                        fontWeight: 400,
                                                        color: "#27272a",
                                                    },
                                                    children: "walkingwifi",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Noto Sans JP",
                    data: fontData,
                    weight: 700,
                    style: "normal",
                },
            ],
        },
    );

    // sharp で PNG に変換
    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(new Uint8Array(png), {
        headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
};
