import { getAnnouncement, getAllAnnouncementIds } from '../../../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

// この関数で、ビルド時に生成すべきすべてのパス (ID) を定義します
export async function generateStaticParams() {
    return await getAllAnnouncementIds();
}

// Next.jsの機能：paramsからIDを取得し、該当記事データを取得
export default async function NewsDetail({ params }) {
    const newsItem = await getAnnouncement(params.id);

    // データが存在しない場合 (エラーハンドリング)
    if (!newsItem) {
        // App Routerでは、notFound()を呼び出すか、return nullでエラー表示
        return notFound(); 
    }

    const { タイトル, data, 本文 } = newsItem.fields;

    return (
        <section className="news-wrapper content-wrapper policy-page">
            <div className="policy-content">
                <h1>{タイトル}</h1>
                <p className="update-date">
                    公開日: {new Date(data).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="article-body">
                    {documentToReactComponents(本文)}
                </div>
            </div>
        </section>
    );
}