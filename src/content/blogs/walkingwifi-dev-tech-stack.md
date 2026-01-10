---
title: walkingwifi.devを支える技術
createdAt: 2026-01-08T22:28:26.648Z
updatedAt: 2026-01-08T22:35:18.128Z
description: |-
  このブログ、WordPressは使っていません。
  エンジニアなら、フロントエンドとバックエンドでそれぞれ技術選定をして、カスタマイズ性・拡張性のあるブログを構築したいですよね。
  あとは記事をWordPressにベンダーロックインするのも気が引けるし、テーマをカスタムして万が一壊れたら怖い。
  それにコストも最小限にしたい。
  今回は、walkingwifi.devを支える技術についてお話しします。
draft: true
tags:
  - tag: src/content/tags/zatudan.md
---

このブログ、WordPressは使っていません。

エンジニアなら、フロントエンドとバックエンドでそれぞれ技術選定をして、カスタマイズ性・拡張性のあるブログを構築したいですよね。

あとは記事をWordPressにベンダーロックインするのも気が引けるし、テーマをカスタムして万が一壊れたら怖い。

それにコストも最小限にしたい。

今回は、walkingwifi.devを支える技術についてお話しします。

料金は年2000円程度のドメイン費しかかかっていません。

## フロントエンド

Astroを採用しています。

2026年現在、主要なフロントエンドフレームワークは概ね以下の通りだと思います。

* React
* Vue.js
* Angular
* Next.js
* Nuxt.js
* Astro

ブログはページ内のコンテンツが頻繁に変わるものではありません。そのため、SSG（静的サイト生成）対応のフレームワークが適していると考えました。候補としてNext.js、Nuxt.js、Astroに絞りましたが、Next.jsとNuxt.jsはブログ構築には過剰な機能も多いため、Astroを採用しました。

### 画像圧縮

サイトの動作を高速にするため、使用している画像は圧縮して保存されています。画像圧縮処理は[sharp](https://github.com/lovell/sharp)を用いています。Git commit時に[husky](https://github.com/typicode/husky)と[lint-staged](https://github.com/lint-staged/lint-staged)を用いて画像圧縮をすることで、自動化しています。

### SNS共有時のサムネイル画像

![](/x-thumbnail.png)

Xでリンクを入れてポストした時に表示されるこれです。

OGPを用いてサムネイル画像を表示しているのですが、htmlのhead要素にあるmetaタグで以下のように記載すると設定できます。

```htmlbars
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content="article" />
<meta property="og:site_name" content={defaultTitle} />
<meta property="og:locale" content="ja_JP" />
```

og:imageのcontentにサムネイル画像として使用する画像のパスを渡します。

記事を追加するたびに毎回サムネイル画像を手動で作成するのも大変なので、build時に[satori](https://github.com/vercel/satori)で記事のtitleを変数化したsvgデータを作成し、[sharp](https://github.com/lovell/sharp)を用いてsvgデータをpngファイルに変換しています。

## CMS（コンテンツ管理システム）

TinaCMSを採用しています。

ブログ運営で欠かせないCMSは、従来型CMS、APIベースCMS、GitベースCMSに分けられ、APIベースとGitベースはフロントエンドを持たないのでヘッドレスCMSとも呼ばれます。

WordPressは従来型CMSに区分されます。

当初はAPIベースCMSの一種であるmicroCMSを使用していましたが、記事内容もGitで管理したかったので、GitベースCMSにしました。

Decap CMSやTinaCMSが候補に上がりますが、とりあえずはTinaCMSを採用しました。

この辺りは今後変わるかもしれません。使いながら最適なCMSを探すことになりそうです。

### TinaCMS

記事の編集画面は以下の通りです。

![](/tinacms-write-blog-1.png)

タイトル・作成日・更新日・サムネイル・説明・下書きフラグ・タグ・本文を編集できるようにしています。

記事にどの項目を設定するかは、tina/config.tsで設定できます。

```ts
import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,


  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        name: "blog",
        label: "Blogs",
        path: "src/content/blogs",
        fields: [
          {
            type: "string",
            name: "title",
            label: "タイトル",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "createdAt",
            label: "作成日",
            ui: {
              dateFormat: "YYYY.MM.DD",
              timeFormat: false,
              utc: true,
            } as any,
          },
          {
            type: "datetime",
            name: "updatedAt",
            label: "更新日",
            ui: {
              dateFormat: "YYYY.MM.DD",
              timeFormat: false,
              utc: true,
            } as any,
          },
          {
            type: "image",
            name: "thumbnail",
            label: "サムネイル",
          },
          {
            type: "string",
            name: "description",
            label: "説明",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "boolean",
            name: "draft",
            label: "下書き",
            description: "チェックを入れると公開されません",
          },
          {
            type: "object",
            name: "tags",
            label: "タグ",
            list: true,
            fields: [
              {
                type: "reference",
                name: "tag",
                label: "タグ",
                collections: ["tag"],
              },
            ],
            ui: {
              itemProps: (item: { tag?: string }) => {
                const tagPath = item?.tag;
                if (tagPath) {
                  const tagName = tagPath.split("/").pop()?.replace(".md", "");
                  return { label: tagName };
                }
                return { label: "タグを選択" };
              },
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "tag",
        label: "Tags",
        path: "src/content/tags",
        fields: [
          {
            type: "string",
            name: "name",
            label: "タグ名",
            isTitle: true,
            required: true,
          },
        ],
      },
    ],
  },
});
```

本文の編集画面は以下の通りです。

![](/tinacms-write-blog-2.png)

基本的な編集はできますが、URLをリンクカードで表示する等はデフォルトではできず、カスタマイズする必要があります。

コードブロックにファイル名も記載できなさそうでした。

## ホスティングサービス

Cloudflare Pagesを採用しています。

他にもGithub PagesやNetlifyもありますが、Cloudflare Pagesを使ってみたかったのと、ドメインをCloudflare Registrarで取得したので、こっちの方が楽そうかなとなんとなくで選択しました。
