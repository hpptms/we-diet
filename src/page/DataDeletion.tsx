import React from 'react';
import { SEOHelmet } from '../component/SEOHelmet';

const DataDeletion: React.FC = () => {
  return (
    <>
      <SEOHelmet
        title="データ削除手順 | We Diet - ダイエットSNS"
        description="We Dietのアカウントとデータの削除方法についてご案内します。アプリ内からの削除方法、メールでの削除依頼、Facebook連携データの削除について説明しています。"
        keywords="データ削除,アカウント削除,We Diet,プライバシー,個人情報削除,GDPR,データ保護"
        canonicalUrl="https://we-diet.net/data-deletion"
        ogType="article"
      />
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1>ユーザーデータ削除について</h1>
      <p>最終更新日: {new Date().toLocaleDateString('ja-JP')}</p>
      
      <h2>データ削除の概要</h2>
      <p>
        We dietでは、ユーザーの皆様がいつでも自分のアカウントとデータを削除できるオプションを提供しています。
        データ削除を実行すると、以下の情報が完全に削除されます。
      </p>

      <h2>削除されるデータ</h2>
      <ul>
        <li>アカウント情報（氏名、メールアドレス等）</li>
        <li>プロフィール情報（身長、体重、年齢等）</li>
        <li>食事記録</li>
        <li>運動記録</li>
        <li>体重記録</li>
        <li>投稿・コメント・いいね</li>
        <li>フォロー・フォロワー関係</li>
        <li>アップロードした画像</li>
        <li>Facebook、Google等の外部サービス連携情報</li>
      </ul>

      <h2>データ削除の方法</h2>
      
      <h3>方法1: アプリ内からの削除</h3>
      <ol>
        <li>We dietアプリにログイン</li>
        <li>「プロフィール設定」に移動</li>
        <li>「アカウント設定」セクションを選択</li>
        <li>「アカウントを削除」ボタンをクリック</li>
        <li>確認画面で削除を実行</li>
      </ol>

      <h3>方法2: メールでの削除依頼</h3>
      <p>
        アプリにアクセスできない場合は、以下のメールアドレスにデータ削除を依頼してください：
      </p>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '5px', 
        margin: '20px 0' 
      }}>
        <p><strong>データ削除依頼先:</strong></p>
        <p>メールアドレス: <a href="mailto:data-deletion@we-diet.net">data-deletion@we-diet.net</a></p>
        <p><strong>件名:</strong> データ削除依頼</p>
        <p><strong>本文に記載する情報:</strong></p>
        <ul>
          <li>登録時のメールアドレス</li>
          <li>アカウント名（分かる場合）</li>
          <li>登録日（分かる場合）</li>
          <li>削除理由（任意）</li>
        </ul>
      </div>

      <h2>Facebook連携データの削除</h2>
      <p>
        Facebookログインを使用してアカウントを作成された場合：
      </p>
      <ol>
        <li>上記の方法でWe dietのアカウントを削除</li>
        <li>Facebookの「設定とプライバシー」→「設定」→「アプリとウェブサイト」から「We diet」を削除</li>
      </ol>

      <h2>データ削除の処理時間</h2>
      <ul>
        <li><strong>アプリ内削除:</strong> 即座に削除処理が開始されます</li>
        <li><strong>メール依頼:</strong> 営業日3日以内に処理いたします</li>
        <li><strong>完全削除:</strong> システムから完全に削除されるまで最大30日かかる場合があります</li>
      </ul>

      <h2>削除後の注意事項</h2>
      <ul>
        <li>削除されたデータは復元できません</li>
        <li>同じメールアドレスで再登録することは可能です</li>
        <li>法的要件により一部のログデータは規定期間保持される場合があります</li>
      </ul>

      <h2>お問い合わせ</h2>
      <p>
        データ削除に関するご質問がございましたら、以下までお問い合わせください：
      </p>
      <p>
        メールアドレス: <a href="mailto:support@we-diet.net">support@we-diet.net</a><br/>
        件名: データ削除に関する問い合わせ
      </p>

      <div style={{ 
        background: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '15px', 
        borderRadius: '5px', 
        marginTop: '30px' 
      }}>
        <strong>重要:</strong> データ削除は取り消しできません。削除前に必要なデータはバックアップを取ることをお勧めします。
      </div>
    </div>
    </>
  );
};

export default DataDeletion;
