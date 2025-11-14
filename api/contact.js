// api/contact.js (Vercel / Next.js API Route)

// サーバー側の Node.js 環境で実行されます
export default async (req, res) => {
    // 秘匿されたDiscord Webhook URLを環境変数から取得
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
        res.status(500).json({ error: 'Server configuration error: DISCORD_WEBHOOK_URL is not set.' });
        return;
    }

    // 💡 1. req.body が存在しない/空の場合を考慮
    const requestBody = req.body || {}; 

    // 💡 2. データが存在しない場合はエラーを返す
    // フロントエンドのキー名と一致することを確認してください
    if (!requestBody.player_name || !requestBody.message) {
        // 400 Bad Request を返す
        return res.status(400).json({ 
            status: 'error', 
            message: 'Missing required data (player_name or message) in request body.' 
        });
    }
    
    // Discordに送信するJSONペイロードを構築
    const payload = {
        username: "お問い合わせ",
        embeds: [
            {
                title: "新しいお問い合わせが届きました 📩",
                color: 3719089, // 紫色
                description: `**Discordにて順次対応をお願いします。**`,
                fields: [
                    { name: "👤 お名前 / プレイヤー名", value: requestBody.player_name || 'N/A', inline: true },
                    { name: "👾 Discord Tag", value: requestBody.discord_tag || 'N/A', inline: true },
                    { 
                        name: "📋 お問い合わせ内容",
                        value: "```\n" + (requestBody.message || '内容なし') + "\n```", 
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "フォームからの自動通知" }
            }
        ]
    };

    // Discord Webhookへ直接送信
    try {
        const discordResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // DiscordのWebhookは成功時 204 No Content を返す
        if (discordResponse.status === 204 || discordResponse.status === 200) {
            // 成功をフロントエンドに返す
            res.status(200).json({ status: 'success', message: 'Form submitted successfully via Discord Webhook.' });
        } else {
            // Discord側でエラーが発生した場合
            const errorText = await discordResponse.text();
            console.error("Discord Webhook Error:", discordResponse.status, errorText);
            // 500 Internal Server Errorを返す
            res.status(500).json({ status: 'error', message: `Failed to post to Discord. Status: ${discordResponse.status}. Details: ${errorText.substring(0, 100)}` });
        }

    } catch (error) {
        console.error("Fetch Error to Discord:", error);
        res.status(500).json({ error: 'Failed to connect to Discord Webhook.' });
    }
};
