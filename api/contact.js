// api/contact.js (Discord Webhook直結版)

// サーバー側の Node.js 環境で実行されます
export default async (req, res) => {
    // 秘匿されたDiscord Webhook URLを環境変数から取得
    const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
        res.status(500).json({ error: 'Server configuration error: DISCORD_WEBHOOK_URL is not set.' });
        return;
    }

    // クライアントから送られたPOSTデータ (JSONオブジェクト) を取得
    const requestBody = req.body;
    
    // Discordに送信するJSONペイロードを構築
    // 💡 GASで使っていたロジックをNode.js (Vercel) に移植します
    const payload = {
        username: "なんてつサーバー お問い合わせフォーム",
        embeds: [
            {
                title: "新しいお問い合わせが届きました 📩",
                color: 3719089,
                description: `**Discordにて順次対応をお願いします。**`,
                fields: [
                    // requestBodyが { player_name: "...", discord_tag: "...", message: "..." } の構造を想定
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
            body: JSON.stringify(payload) // 構築したペイロードを送信
        });
        
        // DiscordのWebhookは成功時 204 No Content を返す
        if (discordResponse.status === 204 || discordResponse.status === 200) {
            res.status(200).json({ status: 'success', message: 'Form submitted successfully via Discord Webhook.' });
        } else {
            // Discordがエラーコードを返した場合
            const errorText = await discordResponse.text();
            console.error("Discord Webhook Error:", discordResponse.status, errorText);
            res.status(500).json({ status: 'error', message: `Discord Webhook failed: ${discordResponse.status}` });
        }

    } catch (error) {
        console.error("Fetch Error to Discord:", error);
        res.status(500).json({ error: 'Failed to connect to Discord Webhook.' });
    }
};
