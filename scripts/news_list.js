// scripts/news_list.js の内容
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyUBg7WSzVTOjKLHV92tFHPMU_ekQoEh9SK8OvyggB_cbzxv8V-QZZopT3dxT1mqEj_Nw/exec';

const newsListContainer = document.getElementById('news-list');

function createSnippet(text, lines = 2) {
    if (!text) return '';
    const splitText = text.split('\n');
    const snippet = splitText.slice(0, lines).join('\n');
    if (splitText.length > lines) {
        return snippet + '...';
    }
    return snippet;
}
function formatDiscordContent(content) {
    let formatted = content || '';
    formatted = formatted.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}
function formatNewsDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' };
    return date.toLocaleDateString('ja-JP', options);
}

async function fetchAndRenderNews() {
    try {
        const response = await fetch(GAS_WEB_APP_URL);
        const newsData = await response.json();

        newsListContainer.innerHTML = '';

        if (newsData.error) {
            newsListContainer.innerHTML = `<div class="news-item error-item"><p>エラー: ${newsData.error}</p></div>`;
            return;
        }

        if (newsData.length === 0) {
            newsListContainer.innerHTML = `<div class="news-item"><p>現在お知らせはありません。</p></div>`;
            return;
        }

        newsData.forEach(item => {
            const newsItemDiv = document.createElement('div');
            newsItemDiv.className = 'news-item';

            const title = item.title || 'タイトルなし';
            const author = item.author || '運営';
            const formattedDate = formatNewsDate(item.timestamp);

            const uniqueId = new Date(item.timestamp).getTime();
            const snippetText = createSnippet(item.content || '', 2);
            const formattedSnippet = formatDiscordContent(snippetText);

            newsItemDiv.innerHTML = `
                <h3>
                    <a href="news_detail?id=${uniqueId}" class="news-title-link">${title}</a>
                </h3> 
                <span class="news-date">投稿者: ${author} | ${formattedDate}</span>
                <p>${formattedSnippet}</p>
                <a href="news_detail?id=${uniqueId}" style="display: inline-block; font-weight: 700; margin-top: 10px;">続きを読む &raquo;</a>
            `;

            newsListContainer.appendChild(newsItemDiv);
        });

    } catch (error) {
        console.error('お知らせの取得に失敗:', error);
        newsListContainer.innerHTML = `<div class="news-item error-item"><p>お知らせの読み込みに失敗しました。時間をおいて再読み込みしてください。</p></div>`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    fetchAndRenderNews();
});