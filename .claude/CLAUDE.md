# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Always respond in Japanese.

## Project Overview

walkingwifi.dev is a personal tech blog built with Astro, TinaCMS, and Tailwind CSS. It features markdown-based blog posts with dynamic OGP image generation.

## Commands

```bash
pnpm dev          # Start dev server with TinaCMS (localhost:4321)
pnpm build        # Build production site to ./dist/
pnpm preview      # Preview production build locally
```

## Architecture

### Content System
- **Astro Content Collections** (`src/content/config.ts`): Defines schemas for `blogs` and `tags` collections
- **TinaCMS** (`tina/config.ts`): Headless CMS configuration that manages content in `src/content/blogs/` and `src/content/tags/`
- TinaCMS stores tag references as paths like `"src/content/tags/xxx.md"` - extraction helper needed when resolving tags

### Dynamic OGP Generation
- `src/pages/ogp/[slug].png.ts`: Generates OGP images at build time using Satori + Sharp
- Each blog post gets an OGP image at `/ogp/{slug}.png`
- Uses Google Fonts (Noto Sans JP) loaded at build time

### Date Handling
- Dates are stored in UTC (TinaCMS config has `utc: true`)
- Displayed in JST (UTC+9) via manual offset calculation in templates

### Image Optimization
- `scripts/optimize-image.mjs`: Runs via husky/lint-staged on commit
- Automatically compresses images in `public/` (max 1920px width, 80% quality)

### Draft Posts
- Posts with `draft: true` in frontmatter are hidden from production
- Filter drafts when querying with `getCollection("blogs")`
