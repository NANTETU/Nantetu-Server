// api/contact.js (最終修正版)

// サーバー側の Node.js 環境で実行されます
export default async (req, res) => {
    // 秘匿されたGASのURLを環境変数から取得
    const GAS_URL = process.env.GAS_WEB_APP_URL;

    if (!GAS_URL) {
        res.status(500).json({ error: 'Server configuration error: GAS_WEB_APP_URL is not set.' });
        return;
    }

    // クライアントから送られたPOSTデータ (JSONオブジェクト) を取得
    const requestBody = req.body; 

    // 取得したデータをそのままGAS Webアプリに転送
    try {
        const gasResponse = await fetch(GAS_URL, {
            method: 'POST',
            headers: {
                // GASは 'Content-Type': 'application/json' でデータを受け取る
                'Content-Type': 'application/json' 
            },
            // 受け取ったJSONオブジェクトを、文字列に変換してGASに渡す (GASのdoPostの仕様に合わせる)
            body: JSON.stringify(requestBody) 
        });
        
        // GASからのJSONレスポンスを読み取り
        const data = await gasResponse.json();
        
        // 取得したレスポンスをそのままフロントエンドに返す
        res.status(200).json(data);

    } catch (error) {
        console.error("Error posting data to GAS:", error);
        res.status(500).json({ error: 'Failed to submit form via Google Apps Script proxy.' });
    }
};
