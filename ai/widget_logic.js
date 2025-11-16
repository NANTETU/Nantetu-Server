document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('messages');
    const inputForm = document.getElementById('input-form');
    const userInput = document.getElementById('user-input');
    const closeButton = document.getElementById('close-button');
    const SEND_API_ENDPOINT = 'https://nantetuservercloudflare.nantetu1.workers.dev/'; 

    // ===================================================
    // 1. 親ウィンドウとの連携 (閉じるボタン)
    // ===================================================

    // 閉じるボタンがクリックされたら、親ウィンドウにメッセージを送る
    closeButton.addEventListener('click', () => {
        // 親ウィンドウのJSがこのメッセージを受け取り、iframeを非表示にする
        window.parent.postMessage('close-ai-widget', '*'); 
    });

    // ===================================================
    // 2. メッセージの追加とスクロール
    // ===================================================

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`; // 改行を反映
        messagesContainer.appendChild(messageDiv);
        
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

        // ユーザーのメッセージを画面に追加
        addMessage(userText, 'user');
        userInput.value = ''; // 入力欄をクリア
        
        // ローディングメッセージを追加
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('message', 'bot-message', 'loading');
        loadingMessage.innerHTML = '<p>AIが考え中...</p>';
        messagesContainer.appendChild(loadingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Vercel Edge FunctionへのAPIコール
            const response = await fetch(SEND_API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userText })
            });

            if (!response.ok) {
                throw new Error('サーバー応答エラー');
            }
            
            // ローディングメッセージを削除し、AIの回答を表示
            messagesContainer.removeChild(loadingMessage);
            const data = await response.json(); // Edge FunctionがJSONで回答を返すことを想定

            addMessage(data.response || '回答を取得できませんでした。', 'bot');

        } catch (error) {
            console.error('AI通信エラー:', error);
            // エラー時もローディングメッセージを削除
            if (messagesContainer.contains(loadingMessage)) {
                 messagesContainer.removeChild(loadingMessage);
            }
            addMessage('エラーが発生しました。時間を置いて再度お試しください。', 'bot');
        }
    });

});
