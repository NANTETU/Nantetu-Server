document.addEventListener('DOMContentLoaded', function() {
    // 共通ヘッダーを挿入する関数
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

    function injectAiWidget() {
        const body = document.body;
        if (!body) return; 

        // AI Widgetのスクリプト要素を作成
        const widgetScript = document.createElement('script');
        widgetScript.type = 'text/javascript';

        // 🚨 絶対パスを使用: '/ai/widget.js' のパスでAIウィジェットのメインロジックを読み込みます。
        widgetScript.src = '/ai/widget.js'; 

        // ページにスクリプトを挿入
        body.appendChild(widgetScript);
        console.log('AI Widget script injected successfully.');
    }

 const loadingBar = document.getElementById("loading-bar");

    // ページ読み込み進行度をシミュレーション
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20; // ランダムに進行
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingBar.style.opacity = "0"; // 完了後にフェードアウト
        }, 500);
      }
      loadingBar.style.width = progress + "%";
    }, 300);

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

    // 💡 実行部分にウィジェット挿入を追加
    loadHeader();
    loadFooter();
    injectAiWidget(); // AIウィジェットを呼び出し
});
