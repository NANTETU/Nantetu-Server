// widget_logic.js
document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const inputForm = document.getElementById('input-form');
    const userInput = document.getElementById('user-input');
    const closeButton = document.getElementById('close-button');

    // 💡 Cloudflare Workerのデプロイ済みフルURLに設定
    const SEND_API_ENDPOINT = '/api/chat';

    // ===================================================
    // 💡 会話履歴を格納する配列 (メモリ)
    // ===================================================
    const chatHistory = [];
    const initialBotMessageText = 'なんてつサーバーへようこそ！ルール、コマンド、接続情報など、何でもご質問ください。';

    // ===================================================
    // 1. 親ウィンドウとの連携 (閉じるボタン)
    // ===================================================
    closeButton.addEventListener('click', () => {
        window.parent.postMessage('close-ai-widget', '*');
    });

    // ===================================================
    // 2. メッセージの追加とスクロール (タイムスタンプ追加)
    // ===================================================

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    }

    // 💡 履歴に追加する機能を追加
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        const timeStamp = getCurrentTime();

        // タイムスタンプを追加
        messageDiv.innerHTML = `
            <p>${text.replace(/\n/g, '<br>')}</p>
            <span class="message-time">${timeStamp}</span>
        `;
        messagesContainer.appendChild(messageDiv);

        // 履歴にメッセージを追加 (Gemini APIの形式に合わせる)
        // role: user (ユーザー) or model (AI)
        const role = sender === 'user' ? 'user' : 'model';
        chatHistory.push({
            role: role,
            parts: [{ text: text }]
        });

        // 最新のメッセージが見えるように自動スクロール
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // ===================================================
    // 3. フォームの送信処理 (API呼び出し)
    // ===================================================

    inputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userText = userInput.value.trim();
        if (!userText) return;

        // ユーザーのメッセージを画面に追加 (同時に履歴に追加される)
        addMessage(userText, 'user');
        userInput.value = ''; // 入力欄をクリア

        // ローディングメッセージを追加
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'bot-message', 'loading');
        loadingMessage.innerHTML = `<p>AIが考え中...</p><span class="message-time">${getCurrentTime()}</span>`;
        messagesContainer.appendChild(loadingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Cloudflare WorkerへのAPIコール
            // 💡 修正: prompt ではなく chatHistory 全体を送信
            const response = await fetch(SEND_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 💡 送信するデータ構造を {history: [...]} に変更
                body: JSON.stringify({ history: chatHistory })
            });

            if (!response.ok) {
                let errorDetail = 'サーバー応答エラー';
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.error) {
                        errorDetail = errorJson.error;
                    }
                } catch (e) {
                    // JSONパースエラー
                }
                throw new Error(errorDetail);
            }

            // ローディングメッセージを削除し、AIの回答を表示
            messagesContainer.removeChild(loadingMessage);
            const data = await response.json();

            // data.response にAIの回答が入っていることを期待
            addMessage(data.response || '回答を取得できませんでした。', 'bot');

        } catch (error) {
            console.error('AI通信エラー:', error);
            // エラー時もローディングメッセージを削除
            if (messagesContainer.contains(loadingMessage)) {
                messagesContainer.removeChild(loadingMessage);
            }

            // 💡 修正: ネットワークエラー（Failed to fetch）の場合、外部障害の可能性を指摘
            if (error.message.includes('Failed to fetch') || error.message.includes('サーバー応答エラー')) {
                addMessage(`現在、サーバーまたはネットワークに接続できません。**Cloudflare側の障害**の可能性があります。時間を置いて再度質問を送信してください。`, 'bot');
            } else {
                // その他のWorker側、またはAPIキー由来のエラー
                addMessage(`エラーが発生しました。（詳細: ${error.message}）時間を置いて再度お試しください。`, 'bot');
            }
        }
    });

    // 初期メッセージの表示 (履歴にも追加される)
    addMessage(initialBotMessageText, 'bot');
});