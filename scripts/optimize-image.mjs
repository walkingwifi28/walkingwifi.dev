#!/usr/bin/env node
/**
 * 画像最適化スクリプト
 * Git pre-commit フックから lint-staged 経由で呼び出される
 *
 * 機能:
 * - 最大幅 1920px にリサイズ
 * - JPEG/PNG: 品質80%で圧縮
 * - WebP: 品質80%で圧縮
 */

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function optimizeImage(filePath) {
    const absolutePath = path.resolve(filePath);

    // ファイルが存在するか確認
    if (!fs.existsSync(absolutePath)) {
        console.log(`⏭️  Skip: ${filePath} (ファイルが見つかりません)`);
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const originalSize = fs.statSync(absolutePath).size;

    try {
        // ファイルをバッファに読み込む（ファイルロック対策）
        const inputBuffer = fs.readFileSync(absolutePath);

        let image = sharp(inputBuffer);
        const metadata = await image.metadata();

        // 画像の幅が MAX_WIDTH を超える場合のみリサイズ
        if (metadata.width && metadata.width > MAX_WIDTH) {
            image = image.resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // フォーマットに応じた圧縮
        let outputBuffer;
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                outputBuffer = await image.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
                break;
            case '.png':
                outputBuffer = await image.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer();
                break;
            case '.webp':
                outputBuffer = await image.webp({ quality: QUALITY }).toBuffer();
                break;
            default:
                console.log(`⏭️  Skip: ${filePath} (対応外の形式: ${ext})`);
                return;
        }

        // 圧縮後のサイズが小さい場合のみ書き込み
        if (outputBuffer.length < originalSize) {
            // 一時ファイルに書き込んでからリネーム（Windows対策）
            const tempPath = path.join(os.tmpdir(), `optimize-${Date.now()}${ext}`);
            fs.writeFileSync(tempPath, outputBuffer);
            fs.copyFileSync(tempPath, absolutePath);
            fs.unlinkSync(tempPath);

            const savedPercent = ((1 - outputBuffer.length / originalSize) * 100).toFixed(1);
            const originalMB = (originalSize / 1024 / 1024).toFixed(2);
            const newMB = (outputBuffer.length / 1024 / 1024).toFixed(2);
            console.log(`✅ ${filePath}: ${originalMB}MB → ${newMB}MB (${savedPercent}% 削減)`);
        } else {
            console.log(`⏭️  ${filePath}: すでに最適化済み`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        process.exit(1);
    }
}

// コマンドライン引数からファイルパスを取得
const files = process.argv.slice(2);

if (files.length === 0) {
    console.log('使用方法: node scripts/optimize-image.mjs <file1> <file2> ...');
    process.exit(0);
}

// 各ファイルを処理
for (const file of files) {
    await optimizeImage(file);
}
