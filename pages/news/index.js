import Link from 'next/link';
import { getAnnouncements } from '/lib/contentful';

// お知らせ一覧データはビルド時に取得する (SSG)
export async function getStaticProps() {
  const newsItems = await getAnnouncements();

  return {
    props: {
      newsItems,
    },
    revalidate: 60, // Contentfulの更新を検知するため、60秒ごとに再生成
  };
}

export default function NewsIndex({ newsItems }) {
  return (
    // style.cssのnews-wrapperを使用
    <section className="news-wrapper content-wrapper">
      <h2>サーバーからのお知らせ 📢</h2>
      
      {newsItems.length > 0 ? (
        // 取得した記事を一つずつ表示
        newsItems.map((item) => (
          // style.cssのnews-itemを使用し、個別記事へのリンクを設定
          <Link href={`/news/${item.sys.id}`} key={item.sys.id} className="news-item">
            {/* item.fields.タイトルにアクセス */}
            <h3>{item.fields.タイトル}</h3> 
            
            {/* item.fields.dataにアクセスし、日付フォーマット */}
            <span className="news-date">
              {new Date(item.fields.data).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            
            {/* 生成したスニペットを表示。style.cssのnews-item pが適用される */}
            <p>{item.fields.snippet}</p>
          </Link>
        ))
      ) : (
        <p>現在、新しいお知らせはありません。</p>
      )}
    </section>
  );
}