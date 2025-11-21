document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            // is-open クラスをトグルしてメニューを開閉
            mainNav.classList.toggle('is-open');

            // アクセシビリティのため、aria-expanded 属性も切り替える
            const isExpanded = mainNav.classList.contains('is-open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // (オプション) メニューを開いた後、リンクをクリックしたらメニューを閉じる
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});