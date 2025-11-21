import { createClient } from 'contentful';
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer';

// Contentful SDK クライアントの設定
// ※ 環境変数 (CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN) はVercel側で設定済みである必要があります。
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

// Contentfulで設定されたコンテンツモデルのIDを使用
const CONTENT_TYPE_ID = 'announcement'; // ← Contentfulで設定したIDに合わせて変更してください

/**
 * すべてのお知らせ記事のリストを取得する関数
 */
export async function getAnnouncements() {
  try {
    const entries = await client.getEntries({
      content_type: CONTENT_TYPE_ID,
      // 'data' フィールド（公開日時）の新しい順にソート
      order: '-fields.data', 
      select: 'sys.id,fields.タイトル,fields.data,fields.本文' // 必要なフィールドのみを選択し軽量化
    });

    // リッチテキストの本文から概要 (Plain Text) を生成
    const itemsWithSnippets = entries.items.map(item => {
      const plainText = documentToPlainTextString(item.fields.本文).substring(0, 150);
      return {
        ...item,
        // スニペットを新しくfieldsに追加
        fields: {
          ...item.fields,
          snippet: plainText.length === 150 ? plainText + '...' : plainText,
        }
      };
    });

    return itemsWithSnippets;

  } catch (error) {
    console.error('Contentfulデータの取得エラー:', error);
    return [];
  }
}

/**
 * 特定のお知らせ記事をIDで取得する関数 (個別記事ページ用)
 * @param {string} id - ContentfulのエントリID (sys.id)
 */
export async function getAnnouncement(id) {
    const entry = await client.getEntry(id);
    return entry;
}

/**
 * 存在するすべてのお知らせのパス (ID) を取得する関数 (getStaticPaths用)
 */
export async function getAllAnnouncementIds() {
    const entries = await client.getEntries({
        content_type: CONTENT_TYPE_ID,
        select: 'sys.id', // IDのみを取得
    });
    
    // Next.jsのgetStaticPaths形式に変換
    return entries.items.map(item => ({
        params: { id: item.sys.id }
    }));
}