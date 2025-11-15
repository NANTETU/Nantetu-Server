document.addEventListener('DOMContentLoaded', function() {
    // 共通ヘッダーを挿入する関数
    function loadHeader() {
        const placeholder = document.getElementById('header-placeholder');
        
        if (!placeholder) return; 

        // _header.htmlの内容を取得
        fetch('_header.html')
            .then(response => {
                if (!response.ok) {
                    // 開発中にファイルが見つからない場合に分かりやすくするため
                    throw new Error('Header file not found: _header.html'); 
                }
                return response.text();
            })
            .then(html => {
                // 取得したHTMLをプレースホルダーに挿入
                placeholder.innerHTML = html;
                
                // ナビゲーションが挿入された後、必要な機能を設定
                setupMobileMenuToggle();
                setActiveLink();
            })
            .catch(error => {
                console.error('Failed to load header:', error);
            });
    }

    // 現在のページに基づいてアクティブなリンクをハイライトする関数
    function setActiveLink() {
        // 例: /guide/ -> guide, /index.html -> /, / -> /
        const currentPath = window.location.pathname.split('/').pop().split('.')[0] || '/'; 
        
        const navLinks = document.querySelectorAll('#main-nav a');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            
            // リンクのパス（/を除く）が現在のファイル名（拡張子なし）と一致するかチェック
            // / の場合は「トップ」をアクティブにする
            if (currentPath === '/' && linkPath === '/') {
                 link.classList.add('active-nav-link');
            } else if (linkPath !== '/' && currentPath === linkPath) {
                 link.classList.add('active-nav-link');
            }
        });
    }
    
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

            // メニューリンククリックで閉じる
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

    // 読み込みを開始
    loadHeader();
});
