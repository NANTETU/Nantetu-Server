document.addEventListener('DOMContentLoaded', function() {
    function loadHeader() {
        const placeholder = document.getElementById('header-placeholder');
        
        if (!placeholder) return; 

        fetch('/_header.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Header file not found: /_header.html'); 
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                
                setupMobileMenuToggle();
                fixHeaderLinks(); 
                setActiveLink();
            })
            .catch(error => {
                console.error('Failed to load header:', error);
            });
    }

    function loadFooter() {
        // フッター用のプレースホルダーIDを取得
        const placeholder = document.getElementById('footer-placeholder');
        
        if (!placeholder) return; 

        // ルート相対パスを使用して_footer.htmlを読み込む
        fetch('/_footer.html') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer file not found: /_footer.html'); 
                }
                return response.text();
            })
            .then(html => {
                // 取得したHTMLをプレースホルダーに挿入
                placeholder.innerHTML = html;
            })
            .catch(error => {
                console.error('Failed to load footer:', error);
            });
    }

    // 現在のページに基づいてアクティブなリンクをハイライトする関数 (変更なし)
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

    // ヘッダーのリンクを絶対パスに自動修正する関数 (変更なし)
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

    document.addEventListener('DOMContentLoaded', function() {
    function loadExternalHTML(url, targetElementId) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            const target = document.getElementById(targetElementId);
            if (target) {
                // プレースホルダーに外部HTML（ローディングバー）の内容を挿入
                target.innerHTML = data;
            }
        })
        .catch(error => console.error('外部HTMLの読み込みに失敗:', error));
        loadExternalHTML('loading-bar.html', 'loading-bar-placeholder');
}

// ページロード時に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // モバイルメニューの開閉機能を設定する関数 (変更なし)
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

    // 💡 実行部分も両方を呼び出すように修正
    loadHeader();
    loadFooter();
});
