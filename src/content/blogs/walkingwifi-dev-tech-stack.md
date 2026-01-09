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

## フロントエンド

Astroを採用しています。

2026年現在、主要なフロントエンドフレームワークは概ね以下の通りだと思います。

React

Vue.js

Angular

Next.js

Nuxt.js

Astro

ブログはページ内のコンテンツが目まぐるしく変わるものでもないので、SSG(静的サイト生成)対応のフレームワークが適していると考え、Next.jsとNuxt.jsとAstroに絞り、Next.jsとNuxt.jsはブログ構築には過剰すぎるので、Astroを採用しました。

git commitで画像圧縮

buildでogp画像生成

tinacmsの使用感

## CMS（コンテンツ管理システム）

TinaCMSを採用しています。

ブログ運営で欠かせないCMSは、従来型CMS、APIベースCMS、GitベースCMSに分けられ、APIベースとGitベースはフロントエンドを持たないのでヘッドレスCMSとも呼ばれます。

WordPressは従来型CMSに区分されます。

当初はAPIベースCMSの一種であるmicroCMSを使用していましたが、記事内容もgitで管理したかったので、GitベースCMSにしました。

Decap CMSやTinaCMSが候補に上がりますが、とりあえずはTinaCMSを採用しました。

この辺りは今後変わるかもしれません。使いながら最適なCMSを探すことになりそうです。

## ホスティングサービス

Cloudflare Pagesを採用しています。

他にもGithub PagesやNetlifyもありますが、Cloudflare Pagesを使ってみたかったのと、ドメインをCloudflare Registrarで取得したので、こっちの方が楽そうかなとなんとなくで選択しました。
