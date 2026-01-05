# walkingwifi.dev プロジェクト概要

## 📝 プロジェクト概要
walkingwifi.devは、**Astro** フレームワークと **Tina CMS** を使用して構築された技術ブログサイトです。

## 🛠️ 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Astro | ^5.16.6 |
| スタイリング | Tailwind CSS | ^4.1.18 |
| ヘッドレスCMS | Tina CMS | tinacms ^3.1.3, @tinacms/cli ^2.0.6 |
| パッケージマネージャー | pnpm | - |

## 📁 ディレクトリ構造

```
walkingwifi.dev/
├── public/              # 静的アセット
├── src/
│   ├── assets/          # 画像・アイコンアセット
│   │   └── icons/       # SVGアイコン
│   ├── components/      # 再利用可能なコンポーネント
│   │   ├── Header.astro # サイトヘッダー
│   │   ├── BlogCard.astro # ブログカード
│   │   └── Tag.astro    # タグコンポーネント
│   ├── content/         # Astro Content Collections
│   │   ├── blogs/       # ブログ記事 (Markdown)
│   │   └── config.ts    # Content Collections スキーマ定義
│   ├── layouts/         # ページレイアウト
│   │   └── Layout.astro # 共通レイアウト
│   ├── pages/           # ページコンポーネント
│   │   ├── index.astro  # トップページ（ブログ一覧）
│   │   └── blogs/
│   │       └── [...slug].astro # ブログ詳細ページ
│   └── styles/          # スタイル
│       └── global.css   # グローバルCSS
├── tina/                # Tina CMS 設定
│   ├── config.ts        # Tina CMS スキーマ設定
│   ├── tina-lock.json   # Tina 自動生成ロックファイル
│   └── __generated__/   # Tina 自動生成ファイル
├── astro.config.mjs     # Astro設定
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## 🚀 開発コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm install` | 依存関係のインストール |
| `pnpm dev` | 開発サーバー起動 (localhost:4321 + Tina CMS管理画面) |
| `pnpm build` | 本番ビルド (Tina ビルド + Astro ビルド) |
| `pnpm preview` | ビルドプレビュー |

## 🔧 設定ファイル

### 環境変数 (.env)
Tina CMSとの接続に必要な環境変数:
- `NEXT_PUBLIC_TINA_CLIENT_ID` - Tina Cloud クライアントID
- `TINA_TOKEN` - Tina Cloud トークン

### tina/config.ts
Tina CMSのスキーマ定義:
- `blog` コレクション（`src/content/blogs`に保存）
- フィールド: `title`, `createdAt`, `updatedAt`, `tags`, `body`

### src/content/config.ts
Astro Content Collectionsのスキーマ定義:
- `blogs` コレクション
- Zodによる型検証

### astro.config.mjs
- Tailwind CSS v4 をViteプラグインとして設定

## 📄 主要ファイル説明

### `tina/config.ts`
Tina CMS設定とブログスキーマ定義:
- GitHub連携ブランチ設定
- ブログコンテンツのフィールド定義（title, createdAt, updatedAt, tags, body）
- メディア管理設定

### `src/content/config.ts`
Astro Content Collections設定:
- `blogs` コレクションの型定義
- `title`, `createdAt`, `updatedAt`, `tags` フィールド

### `src/layouts/Layout.astro`
共通レイアウト:
- Google Fonts (Noto Sans JP) の読み込み
- Headerコンポーネントの配置
- グローバルCSSのインポート

### `src/styles/global.css`
- Tailwind CSS インポート
- CSS カスタムプロパティによるテーマ定義（ライト/ダークモード準備済み）
- ベーススタイル設定

### `src/components/Header.astro`
固定ヘッダー:
- glassmorphism デザイン（半透明背景 + ブラー）
- サイト名表示とホームリンク

## 🎨 デザインシステム

### カラーパレット (CSS変数)
```css
--color-bg: #f4f4f5           /* 背景色 */
--color-bg-secondary: #e4e4e7  /* セカンダリ背景 */
--color-text: #27272a          /* テキスト色 */
--color-text-secondary: #71717a /* セカンダリテキスト */
--color-primary: #3b82f6       /* プライマリカラー */
--color-border: #e5e7eb        /* ボーダー色 */
```

### フォント
- Noto Sans JP (Google Fonts)

## 📌 注意事項
- ダークモードはCSS変数として準備済み（現在コメントアウト）
- 静的サイト生成 (SSG) を使用
- ブログ詳細ページは動的ルーティング (`[...slug].astro`)
- astroファイル内では<style>タグは使用せず、TailWind CSSを必ず使用してください
- ブログ記事は `src/content/blogs/` にMarkdown形式で保存
- Tina CMS管理画面は開発時に `/admin` でアクセス可能
