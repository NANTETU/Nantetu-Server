// api/chat.js (Vercel Serverless Function用)
// Node.jsの標準的なHTTPリクエストハンドラ形式を使用

import { GoogleGenAI } from '@google/genai';

// 1. なんてつサーバーのナレッジベース (SYSTEM_PROMPT)
// ... (SYSTEM_PROMPT の内容は index.js から変更なしでコピー) ...
const SYSTEM_PROMPT = `
あなたは、マインクラフト統合版「なんてつサーバー」の公式AIアシスタントです。
... (中略: 長いので省略します。index.jsの内容をそのままコピーしてください) ...
---
`;

// ======================================================
// 2. Vercel Function メインハンドラ
// ======================================================

// Vercel/Node.js のエクスポート形式
export default async function handler(req, res) {
    // Vercel Functions では req.method でリクエストメソッドを取得
    if (req.method !== 'POST') {
        // VercelではCORSヘッダーは vercel.json で設定することを推奨しますが、
        // 今回はコード内でも設定しておきます。
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // req.body から history を取得
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
        return res.status(400).json({ error: 'Conversation history is required' });
    }

    try {
        // 💡 Vercelでは、環境変数は process.env から取得します。
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not set in Vercel environment.' });
        }

        const ai = new GoogleGenAI({
            apiKey: apiKey
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: history,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.2,
                maxOutputTokens: 300,
            }
        });

        const aiResponse = response.text.trim();

        // 応答を JSON 形式で返す
        res.status(200).json({ response: aiResponse });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: 'AIサービスとの通信中にエラーが発生しました。' });
    }
}