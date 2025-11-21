import { getAnnouncement, getAllAnnouncementIds } from '../../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// Next.jsの機能：どのパス（URL）をビルド時に生成するかContentfulから取得
export async function getStaticPaths() {
    const paths = await getAllAnnouncementIds();
    return {
        paths,
        fallback: false, // 存在しないIDへのアクセスは404にする
    };
}

// Next.jsの機能：各パス（ID）に対応する記事データを取得
export async function getStaticProps({ params }) {
    const newsItem = await getAnnouncement(params.id);

    // データが存在しない場合は404
    if (!newsItem) {
        return { notFound: true };
    }

    return {
        props: {
            newsItem,
        },
        revalidate: 60,
    };
}

export default function NewsDetail({ newsItem }) {
    // 取得したデータから必要な情報を抽出
    const { タイトル, data, 本文 } = newsItem.fields; // Contentfulのフィールド名

    return (
        // style.cssのnews-wrapperを流用
        <section className="news-wrapper content-wrapper policy-page">
            <div className="policy-content">
                {/* 記事タイトル */}
                <h1>{タイトル}</h1>
                
                {/* 公開日時 */}
                <p className="update-date">
                    公開日: {new Date(data).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* 本文（リッチテキスト）をHTMLとしてレンダリング */}
                <div className="article-body">
                    {documentToReactComponents(本文)}
                </div>
            </div>
        </section>
    );
}