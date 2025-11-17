// キャッシュ名 (バージョンを上げることで、新しいアセットに更新できます)
const CACHE_NAME = 'nantetu-server-cache-v2'; // v1 から v2 に変更！
const OFFLINE_URL = '/offline.html';

// Service Workerがキャッシュすべきアセットのリスト
const filesToCache = [
    // 必須ファイル
    '/',
    OFFLINE_URL,
    '/style.css',

    // 外部アセット (CDNやフォントなど)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
    // 冗長なフォントURLを一つにまとめます
    'https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Noto+Sans+JP:wght@400;700;900&display=swap',
    'https://fonts.gstatic.com' // 最終的にフォントファイルをフェッチしに行くオリジン

    // サイトの主要なスクリプトやアイコンなど、キャッシュしたいものがあれば追加してください
    // '/scripts/set_base.js',
    // '/icon.jpg',
];

// 1. インストールイベント: キャッシュの作成とアセットの追加
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: キャッシュを開いてアセットを追加中:', CACHE_NAME);
                // 必須ファイルをキャッシュに追加
                return cache.addAll(filesToCache);
            })
            .then(() => self.skipWaiting()) // インストール後すぐにアクティベート
            .catch(error => console.error('Service Worker: キャッシュインストール失敗:', error))
    );
});

// 2. アクティベートイベント: 古いキャッシュの削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 古いキャッシュを削除:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. フェッチイベント: リクエストの傍受とオフライン時の対応
self.addEventListener('fetch', (event) => {
    // GETリクエストかつ自サイトからのリクエストのみ処理
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request) // 1. まずキャッシュを確認
            .then((response) => {
                if (response) {
                    return response; // キャッシュがあればそれを返す
                }

                // 2. キャッシュがなければネットワークから取得を試みる
                return fetch(event.request).catch(() => {
                    // 3. ネットワークエラーが発生した場合
                    if (event.request.mode === 'navigate') {
                        // HTMLページへのナビゲーションリクエストなら、オフラインページを返す
                        return caches.match(OFFLINE_URL);
                    }
                    // 画像やCSSなどのリソースリクエストが失敗した場合はそのままエラー
                    throw new Error('Network request failed and no cache available.');
                });
            })
    );
});