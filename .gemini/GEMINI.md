# walkingwifi.dev プロジェクト概要

## 📝 プロジェクト概要
walkingwifi.devは、**Astro** フレームワークと **microCMS** を使用して構築された技術ブログサイトです。

## 🛠️ 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Astro | ^5.16.6 |
| スタイリング | Tailwind CSS | ^4.1.18 |
| ヘッドレスCMS | microCMS | microcms-js-sdk ^3.2.0 |
| パッケージマネージャー | pnpm | - |

## 📁 ディレクトリ構造

```
walkingwifi.dev/
├── public/              # 静的アセット
├── src/
│   ├── assets/          # 画像などのアセット
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/      # 再利用可能なコンポーネント
│   │   ├── Header.astro # サイトヘッダー
│   │   └── Welcome.astro
│   ├── layouts/         # ページレイアウト
│   │   └── Layout.astro # 共通レイアウト
│   ├── library/         # ユーティリティ・API
│   │   └── microcms.ts  # microCMS クライアント
│   ├── pages/           # ページコンポーネント
│   │   ├── index.astro  # トップページ（ブログ一覧）
│   │   └── [blogId].astro # ブログ詳細ページ
│   └── styles/          # スタイル
│       └── global.css   # グローバルCSS
├── astro.config.mjs     # Astro設定
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

## 🚀 開発コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm install` | 依存関係のインストール |
| `pnpm dev` | 開発サーバー起動 (localhost:4321) |
| `pnpm build` | 本番ビルド (`./dist/`に出力) |
| `pnpm preview` | ビルドプレビュー |

## 🔧 設定ファイル

### 環境変数 (.env)
microCMSとの接続に必要な環境変数:
- `MICROCMS_SERVICE_DOMAIN` - microCMS サービスドメイン
- `MICROCMS_API_KEY` - microCMS API キー

### astro.config.mjs
- Tailwind CSS v4 をViteプラグインとして設定

## 📄 主要ファイル説明

### `src/library/microcms.ts`
microCMS SDKクライアントの設定とAPI呼び出し関数:
- `getBlogs()` - ブログ一覧を取得
- `getBlogDetail()` - ブログ詳細を取得

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
- ブログ詳細ページは動的ルーティング (`[blogId].astro`)
- astroファイル内では<style>タグは使用せず、TailWind CSSを必ず使用してください
