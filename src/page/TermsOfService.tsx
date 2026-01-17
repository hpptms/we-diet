import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '../i18n';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  // 開発環境では強制的に日本語を使用
  const isDev = window.location.hostname === '192.168.1.22' || 
                window.location.hostname === 'localhost' ||
                window.location.port === '3000' ||
                process.env.NODE_ENV === 'development' ||
                import.meta.env?.DEV === true;
  
  // デバッグ用ログ
  console.log('TermsOfService - Environment check:', {
    hostname: window.location.hostname,
    port: window.location.port,
    NODE_ENV: process.env.NODE_ENV,
    DEV: import.meta.env?.DEV,
    isDev
  });
  
  const currentLanguage = 'ja' as const; // 開発環境では常に日本語、本番環境でも現在は日本語で統一

  const backButtonStyle = {
    display: 'inline-block',
    background: '#29b6f6',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 24px',
    borderRadius: '25px',
    marginBottom: '2rem',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(41, 182, 246, 0.3)',
  };

  const handleBackClick = () => {
    navigate('/');
  };

  // 現在は日本語で統一のため、日本語版のみを表示
  return (
    <>
      <Helmet>
        <title>利用規約 | We Diet - ダイエットSNS</title>
        <meta name="description" content="We Dietの利用規約です。サービス利用の条件、ユーザーアカウント、コンテンツガイドラインについて説明しています。" />
        <meta property="og:title" content="利用規約 | We Diet" />
        <meta property="og:description" content="We Dietの利用規約。サービス利用条件について。" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://we-diet.com/terms-of-service" />
        <link rel="canonical" href="https://we-diet.com/terms-of-service" />
      </Helmet>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <button 
        style={backButtonStyle} 
        onClick={handleBackClick}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#1e88e5';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(41, 182, 246, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = '#29b6f6';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 5px rgba(41, 182, 246, 0.3)';
        }}
      >
        ← トップページに戻る
      </button>
      <h1>利用規約</h1>
      <p>最終更新日: {new Date().toLocaleDateString('ja-JP')}</p>
      
      <h2>1. 利用規約の同意</h2>
      <p>We Diet（「本サービス」）にアクセス・利用することにより、お客様は本契約の条項に同意し、これに拘束されることに同意したものとみなします。</p>

      <h2>2. サービスの説明</h2>
      <p>We Dietは、ユーザーが以下のことを行えるソーシャルウェルネスプラットフォームです：</p>
      <ul>
        <li>日々の食事、運動、体重管理の記録</li>
        <li>フィットネス旅路の進捗記録と共有</li>
        <li>サポートコミュニティとの交流</li>
        <li>健康・ウェルネスリソースへのアクセス</li>
      </ul>

      <h2>3. ユーザーアカウント</h2>
      <p>本サービスの特定の機能を利用するには、アカウント登録が必要です。お客様は以下に同意するものとします：</p>
      <ul>
        <li>正確で完全な情報を提供すること</li>
        <li>アカウント認証情報のセキュリティを維持すること</li>
        <li>お客様のアカウントでのすべての活動に責任を負うこと</li>
        <li>不正使用があった場合に当社に通知すること</li>
      </ul>

      <h2>4. ユーザーコンテンツと行動</h2>
      <p>お客様は以下のことを行わないことに同意します：</p>
      <ul>
        <li>有害、攻撃的、または不適切なコンテンツの投稿</li>
        <li>適用される法律や規制の違反</li>
        <li>知的財産権の侵害</li>
        <li>他のユーザーへのスパムやハラスメント</li>
        <li>虚偽または誤解を招く健康情報の共有</li>
      </ul>

      <h2>5. プライバシー</h2>
      <p>お客様のプライバシーは当社にとって重要です。本サービスのご利用を規定するプライバシーポリシーもご確認いただき、当社の慣行をご理解ください。</p>

      <h2>6. サードパーティサービス</h2>
      <p>本サービスは以下のサードパーティプラットフォームと統合されています：</p>
      <ul>
        <li>Google OAuth</li>
        <li>Line ログイン</li>
      </ul>
      <p>これらのサービスのご利用は、それぞれの利用規約とプライバシーポリシーに従うものとします。</p>

      <h2>7. 免責事項</h2>
      <p>本サービスは「現状のまま」で提供され、いかなる種類の保証もありません。当社は医学的助言を提供しておらず、医学的懸念については医療専門家にご相談することをお勧めします。</p>

      <h2>8. 責任の制限</h2>
      <p>当社は、お客様の本サービスのご利用から生じる間接的、偶発的、特殊、結果的、または懲罰的な損害について責任を負いません。</p>

      <h2>9. 修正</h2>
      <p>当社はいつでもこれらの条項を修正する権利を留保します。変更は本ページへの投稿により効力を生じます。</p>

      <h2>10. 解約</h2>
      <p>当社は、これらの条項の違反があった場合、いつでもお客様のアカウントを解約または停止することができます。</p>

      <h2>11. お問い合わせ情報</h2>
      <p>本利用規約についてご質問がございましたら、以下までお問い合わせください：<br/>メール: we.diet.dev@gmail.com</p>

      <h2>12. 準拠法</h2>
      <p>本条項は日本法に準拠します。</p>
    </div>
    </>
  );
};

export default TermsOfService;
