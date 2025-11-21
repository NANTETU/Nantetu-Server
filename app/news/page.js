import Link from 'next/link';
// lib/contentful.js はそのまま使用
import { getAnnouncements } from '../../../lib/contentful'; 

// Server Componentとしてデータを直接取得
export default async function NewsIndex() {
  // Contentfulで設定したコンテンツモデルのIDに合わせて変更してください
  const contentTypeId = 'announcement'; 
  const newsItems = await getAnnouncements(contentTypeId); // Contentfulからデータを取得

  return (
    // 既存のCSSクラスを使用
    <section className="news-wrapper content-wrapper">
      <h2>サーバーからのお知らせ 📢</h2>
      
      {newsItems.length > 0 ? (
        newsItems.map((item) => (
          // 個別記事へのリンクは前回と同じくsys.idを使用
          <Link href={`/news/${item.sys.id}`} key={item.sys.id} className="news-item">
            <h3>{item.fields.タイトル}</h3> 
            <span className="news-date">
              {new Date(item.fields.data).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <p>{item.fields.snippet}</p>
          </Link>
        ))
      ) : (
        <p>現在、新しいお知らせはありません。</p>
      )}
    </section>
  );
}