// api/chat.js (Vercel Serverless Function用)

import { GoogleGenAI } from '@google/genai';

// 1. なんてつサーバーのナレッジベース (SYSTEM_PROMPT)
// ... (SYSTEM_PROMPT の内容は index.js から変更なしでコピー) ...
const SYSTEM_PROMPT = `
あなたは、マインクラフト統合版「なんてつサーバー」の公式AIアシスタントです。
... (中略: index.jsの内容をそのままコピーしてください) ...
---
`;

// ======================================================
// 2. Vercel Function メインハンドラ
// ======================================================

// Vercel/Node.js のエクスポート形式 (req, res を使用)
export default async function handler(req, res) {
    // CORSヘッダーを設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // req.body から prompt を取得
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // 💡 Vercelでは process.env から環境変数を取得
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Error: GEMINI_API_KEY is not set.');
            // APIキーがない場合、500エラーを返す
            return res.status(500).json({ error: 'AIサービスの設定エラー' });
        }

        const ai = new GoogleGenAI({
            apiKey: apiKey
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            // 💡 history ではなく prompt のみを使用する元のcontents
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.2,
                maxOutputTokens: 300,
            }
        });

        const aiResponse = response.text.trim();

        // 応答を JSON 形式で返す
        return res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error("Gemini API Error:", error);
        // エラーをログに出力し、ユーザーには一般的なエラーメッセージを返す
        return res.status(500).json({ error: 'AIサービスとの通信中にエラーが発生しました。' });
    }
}