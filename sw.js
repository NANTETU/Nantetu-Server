const CACHE_NAME = 'nantetu-server-cache-v1.0.4'; // キャッシュ名をバージョン管理する
const FILES_TO_CACHE = [
  '/', // トップページ
  '/index.html',
  '/style.css',
  '/_header.html', // キャッシュしたい共通パーツ
  '/_footer.html',
  '/scripts/dom-injector.js', // 上記で提案したJSファイル
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting(); // 新しいService Workerがすぐにアクティブになるようにする
});

self.addEventListener('fetch', (event) => {
  // キャッシュに存在するリソースを優先的に使用する (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. キャッシュからレスポンスを返す（「古い」コンテンツ）
      const fetchedResponsePromise = fetch(event.request).then((networkResponse) => {
        // 2. ネットワークから新しいレスポンスを取得し、キャッシュを更新
        // （ただし、POSTリクエストやクロスオリジンリクエストの一部はキャッシュしない）
        if (networkResponse.ok && networkResponse.type === 'basic') {
          const cacheClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheClone);
          });
        }
        return networkResponse;
      }).catch(error => {
        // ネットワークがオフラインの場合のエラーハンドリング
        console.error('Fetch failed: ', error);
        // 必要に応じてオフラインページを返す
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
      
      // キャッシュがあればキャッシュを返し、裏でネットワークから取得。なければネットワークから取得。
      return cachedResponse || fetchedResponsePromise;
    })
  );
});

self.addEventListener('activate', (event) => {
  // 古いキャッシュをクリーンアップ
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
