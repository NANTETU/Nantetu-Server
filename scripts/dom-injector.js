/**
 * 指定したURLからHTMLコンテンツを取得し、指定した要素に挿入します。
 * @param {string} url - 読み込むHTMLファイルのパス。
 * @param {string} targetSelector - コンテンツを挿入する要素のCSSセレクタ。
 */
export async function injectHTML(url, targetSelector) {
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    // ターゲット要素が見つからない場合はエラーをコンソールに出力して終了
    console.error(`Error: Target element not found for selector "${targetSelector}"`);
    return;
  }

  try {
    // 非同期でHTMLコンテンツを取得
    const response = await fetch(url);

    // HTTPステータスが200番台以外の場合
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} from ${url}`);
    }

    // テキストとしてコンテンツを取得
    const htmlContent = await response.text();

    // 取得したHTMLコンテンツをターゲット要素に挿入
    targetElement.innerHTML = htmlContent;

  } catch (error) {
    // ネットワークエラーやfetch失敗時の処理
    console.error(`Failed to inject content from ${url}:`, error);
    // ユーザーに問題があることを示す代替コンテンツを表示することも検討
    targetElement.innerHTML = `<p style="color: red;">コンテンツの読み込みに失敗しました。</p>`;
  }
}

// ==============================================
// 使用例（エントリポイントとなるファイル内で実行）
// ==============================================

// document.addEventListener('DOMContentLoaded', () => {
//   // ヘッダーを<header id="main-header"></header>に挿入
//   injectHTML('/_header.html', '#main-header');

//   // フッターを<footer id="main-footer"></footer>に挿入
//   injectHTML('/_footer.html', '#main-footer');
// });
