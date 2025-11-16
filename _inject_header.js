document.addEventListener('DOMContentLoaded', function() {
    // 共通ヘッダーを挿入する関数
    function loadHeader() {
        const placeholder = document.getElementById('header-placeholder');
        
        if (!placeholder) return; 

        // 💡 修正点: fetch('/_header.html') でルート相対パスを使用
        fetch('/_header.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Header file not found: /_header.html'); 
                }
                return response.text();
            })
            .then(html => {
                // 取得したHTMLをプレースホルダーに挿入
                placeholder.innerHTML = html;
                
                // ナビゲーションが挿入された後、必要な機能を設定
                setupMobileMenuToggle();
                fixHeaderLinks(); 
                setActiveLink();
            })
            .catch(error => {
                console.error('Failed to load header:', error);
            });
    }

    // 現在のページに基づいてアクティブなリンクをハイライトする関数
    function setActiveLink() {
        // 例: /guide/index.html -> guide, /index.html -> index
        // `split('/').pop()`で末尾のファイル名を取得（例: index.html）
        // `.split('.')[0]`で拡張子を取り除く（例: index）
        const currentPath = window.location.pathname.split('/').filter(p => p).pop().split('.')[0] || 'index'; 
        
        const navLinks = document.querySelectorAll('#main-nav a');
        
        navLinks.forEach(link => {
            // リンクのhrefからファイル名部分を取得（例: guide/ -> guide, / -> /）
            let linkPath = link.getAttribute('href').replace(/\//g, ''); 
            
            // index.html または / の場合は 'index' として扱う
            if (linkPath === '' || linkPath === 'index') {
                linkPath = 'index';
            }
            
            // 現在のファイル名（拡張子なし）とリンクのパス（フォルダ名）が一致するかチェック
            if (currentPath === linkPath) {
                 link.classList.add('active-nav-link');
            }
        });
    }

    // 💡 修正した fixHeaderLinks 関数
    function fixHeaderLinks() {
        const navLinks = document.querySelectorAll('.navbar .nav-links a');
        navLinks.forEach(link => {
            let href = link.getAttribute('href');
            
            // 例: index.html -> /
            if (href === 'index.html') {
                link.setAttribute('href', '/');
            } 
            // 例: guide.html -> /guide/
            else if (href.endsWith('.html')) {
                // ファイル名から.htmlを取り除き、前後に / をつける
                const newHref = '/' + href.replace('.html', '/');
                link.setAttribute('href', newHref);
            }
        });
    } // <-- ここに閉じ括弧を追加しました！

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
