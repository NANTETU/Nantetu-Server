document.addEventListener('DOMContentLoaded', () => {
    // Service Workerがブラウザでサポートされているか確認
    if ('serviceWorker' in navigator) {
        // Service Workerを登録（sw.jsファイルがルートディレクトリにあると仮定）
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker 登録成功:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker 登録失敗:', error);
            });
    } else {
        console.warn('Service Worker はこのブラウザでサポートされていません。オフライン機能は利用できません。');
    }
});