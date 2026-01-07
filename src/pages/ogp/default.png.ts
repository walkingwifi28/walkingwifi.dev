import type { APIRoute } from "astro";
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

export const GET: APIRoute = async () => {
    const title = "walkingwifiのテックブログ";

    // フォントを読み込み
    const fontData = await loadGoogleFont("Noto+Sans+JP", 700);

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
                                            fontSize: "64px",
                                            fontWeight: 700,
                                            color: "#27272a",
                                            lineHeight: 1.4,
                                            maxWidth: "900px",
                                            wordBreak: "break-word",
                                        },
                                        children: title,
                                    },
                                },
                                // walkingwifi（右下）
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            fontSize: "32px",
                                            fontWeight: 400,
                                            color: "#27272a",
                                            textAlign: "right",
                                            alignSelf: "flex-end",
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
