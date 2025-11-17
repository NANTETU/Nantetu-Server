const REPO_NAME = 'Nantetu-Server';
const isGitHubPages = window.location.pathname.includes(`/${REPO_NAME}/`);

if (isGitHubPages) {
    const baseTag = document.createElement('base');
    baseTag.href = `/${REPO_NAME}/`;
    document.head.prepend(baseTag);
}

// サーバー状態を更新する関数
function updateStatus(isOnline, players) {
    const serverStatusDiv = document.getElementById('server-status');
    const serverStatusBox = document.querySelector('.server-status-box'); // 新しく取得

    if (serverStatusDiv && serverStatusBox) {
        // CSS変数の値を取得するヘルパー関数
        const varColor = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();

        if (isOnline) {
            serverStatusDiv.innerHTML = `<i class="fas fa-check-circle" style="color: ${varColor('success')}"></i> オンライン | 現在 ${players} 人がプレイ中`;
            // オンラインの場合のみ、鼓動アニメーション用のクラスを追加
            serverStatusBox.classList.add('online');
        } else {
            serverStatusDiv.innerHTML = `<i class="fas fa-times-circle" style="color: ${varColor('error')}"></i> オフライン | 現在接続できません`;
            // オフラインの場合はクラスを削除
            serverStatusBox.classList.remove('online');
        }
    }
}

// ... [fetchServerStatus() や クイズロジックなど、他の既存コードは省略] ...

// サーバー状態をAPIから取得する関数
function fetchServerStatus() {
    const serverStatusDiv = document.getElementById('server-status');
    if (!serverStatusDiv) return;

    // 読み込み中状態を再設定
    const varColor = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
    serverStatusDiv.innerHTML = `<i class="fas fa-spinner fa-spin" style="color: ${varColor('text-medium')}"></i> 状態確認中...`;

    // サーバー状態をポーリングするための定数
    const SERVER_STATUS_API = 'https://mcapi.us/server/status?ip=server.example.com&port=19132'; // ★★★ 実際のサーバーAPI URLに置き換える必要があります ★★★

    fetch(SERVER_STATUS_API)
        .then(response => {
            if (!response.ok) {
                throw new Error('API応答エラー');
            }
            return response.json();
        })
        .then(data => {
            const isOnline = data.online;
            // プレイヤー数が存在しない場合は0をデフォルトとする
            const players = data.players ? data.players.online : 0;
            updateStatus(isOnline, players);
        })
        .catch(error => {
            console.error("サーバー状態の取得エラー:", error);
            updateStatus(false, 0); // エラー時もオフラインとして表示
        });
}

// ... [他の既存コードは省略] ...