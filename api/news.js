// api/news.js (Vercel API Route)

// サーバー側の Node.js 環境で実行されます
export default async (req, res) => {
    // 1. Vercelの環境変数から秘匿されたGASのURLを取得
    const GAS_URL = process.env.GAS_WEB_APP_URL;

    if (!GAS_URL) {
        // 環境変数が設定されていない場合のエラーレスポンス
        res.status(500).json({ error: 'Server configuration error: GAS_WEB_APP_URL is not set.' });
        return;
    }

    // 2. GAS Webアプリにリクエストを送信
    try {
        const gasResponse = await fetch(GAS_URL);
        
        // 3. GASからのレスポンスボディ（JSONデータ）を取得
        const data = await gasResponse.json();
        
        // ★ 4. キャッシュ設定 (オプションだが強く推奨)
        // ブラウザやVercelのエッジサーバーに、このAPIの結果を60秒間保存させる
        // 頻繁なGASアクセスを防ぎ、クォータ消費を抑える
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

        // 5. 取得したデータをそのままフロントエンドに返す
        res.status(200).json(data);

    } catch (error) {
        // GASへのアクセスが失敗した場合のエラーレスポンス
        console.error("Error fetching data from GAS:", error);
        res.status(500).json({ error: 'Failed to proxy request to Google Apps Script.' });
    }
};