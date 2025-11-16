document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. ヘルパー関数: 外部HTMLファイルを読み込み、プレースホルダーに挿入する
    //    (ヘッダー、フッター、ローディングバーのすべてに使用)
    // =======================================================
    function loadExternalHTML(url, targetElementId, callback = null) {
        const placeholder = document.getElementById(targetElementId);
        if (!placeholder) return;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`ファイルが見つかりません: ${url}`);
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                if (callback) {
                    // 読み込み完了後に必要な処理を実行
                    callback();
                }
            })
            .catch(error => {
                console.error(`外部HTMLの読み込みに失敗 (${url}):`, error);
            });
    }

    // =======================================================
    // 2. ヘッダー/フッターの読み込み関数 (既存のロジック)
    // =======================================================
    function loadHeader() {
        // ヘッダー読み込み後、モバイルメニュー設定などをコールバックで実行
        loadExternalHTML('/_header.html', 'header-placeholder', () => {
            setupMobileMenuToggle();
            fixHeaderLinks();
            setActiveLink();
        });
    }

    function loadFooter() {
        loadExternalHTML('/_footer.html', 'footer-placeholder');
    }

    // =======================================================
    // 3. その他のユーティリティ関数 (既存のコードをそのまま使用)
    // =======================================================
    
    // モバイルメニューの開閉機能を設定する関数
    function setupMobileMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('open');
                const icon = menuToggle.querySelector('i');
                if (mainNav.classList.contains('open')) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            });

            // メニューを開いた状態でリンクをクリックしたら閉じる
            mainNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        mainNav.classList.remove('open');
                        const icon = menuToggle.querySelector('i');
                        if(icon) {
                            icon.classList.replace('fa-times', 'fa-bars');
                        }
                    }
                });
            });
        }
    }

    // 現在のページに基づいてアクティブなリンクをハイライトする関数
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').filter(p => p).pop().split('.')[0] || 'index';
        const navLinks = document.querySelectorAll('#main-nav a');
        
        navLinks.forEach(link => {
            let linkPath = link.getAttribute('href').replace(/\//g, '');
            
            if (linkPath === '' || linkPath === 'index') {
                linkPath = 'index';
            }
            
            if (currentPath === linkPath) {
                link.classList.add('active-nav-link');
            }
        });
    }

    // ヘッダーのリンクを絶対パスに自動修正する関数
    function fixHeaderLinks() {
        const navLinks = document.querySelectorAll('.navbar .nav-links a');
        navLinks.forEach(link => {
            let href = link.getAttribute('href');
            
            if (href === 'index.html') {
                link.setAttribute('href', '/');
            }
            else if (href.endsWith('.html')) {
                const newHref = '/' + href.replace('.html', '/');
                link.setAttribute('href', newHref);
            }
        });
    }

    // =======================================================
    // 4. メイン実行ブロック
    //    DOMContentLoaded イベント内で一度だけ呼び出す
    // =======================================================
    
    // 1. ローディングバーの読み込み (最優先)
    loadExternalHTML('loading-bar.html', 'loading-bar-placeholder'); 
    
    // 2. ヘッダーとフッターの読み込み
    loadHeader();
    loadFooter();
});
