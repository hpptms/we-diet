import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '../i18n';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  // 開発環境では強制的に日本語を使用
  const isDev = window.location.hostname === '192.168.1.22' || 
                window.location.hostname === 'localhost' ||
                window.location.port === '3000' ||
                process.env.NODE_ENV === 'development' ||
                import.meta.env?.DEV === true;
  
  // デバッグ用ログ
  console.log('PrivacyPolicy - Environment check:', {
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
        <title>プライバシーポリシー | We Diet - ダイエットSNS</title>
        <meta name="description" content="We Dietのプライバシーポリシーです。個人情報の収集・利用目的・管理について説明しています。" />
        <meta property="og:title" content="プライバシーポリシー | We Diet" />
        <meta property="og:description" content="We Dietのプライバシーポリシー。個人情報の取り扱いについて。" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://we-diet.com/privacy-policy" />
        <link rel="canonical" href="https://we-diet.com/privacy-policy" />
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
      <h1>プライバシーポリシー</h1>
      <p>最終更新日: {new Date().toLocaleDateString('ja-JP')}</p>
      
      <h2>1. 個人情報の収集</h2>
      <p>We diet（以下「当サービス」）では、以下の個人情報を収集することがあります：</p>
      <ul>
        <li>氏名、メールアドレス</li>
        <li>プロフィール情報（身長、体重、年齢等）</li>
        <li>食事記録、運動記録</li>
        <li>Googleなどの外部サービスから提供される情報</li>
      </ul>

      <h2>2. 個人情報の利用目的</h2>
      <p>収集した個人情報は以下の目的で利用します：</p>
      <ul>
        <li>サービスの提供、運営、改善</li>
        <li>ユーザーサポート</li>
        <li>統計データの作成（個人を特定できない形で）</li>
      </ul>

      <h2>3. 個人情報の第三者提供</h2>
      <p>法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>

      <h2>4. 個人情報の管理</h2>
      <p>個人情報の漏洩、滅失、毀損を防止するため、適切な安全管理措置を講じています。</p>

      <h2>5. Cookieについて</h2>
      <p>当サービスでは、サービス向上のためCookieを使用する場合があります。Cookieの使用を希望されない場合は、ブラウザの設定で無効にすることができます。</p>

      <h2>6. 外部サービス連携</h2>
      <p>当サービスでは、以下の外部サービスと連携しています：</p>
      <ul>
        <li>Google OAuth</li>
        <li>Line Login</li>
      </ul>
      <p>これらのサービスのプライバシーポリシーについては、各サービスの公式サイトをご確認ください。</p>

      <h2>7. お問い合わせ</h2>
      <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：<br/>メールアドレス: we.diet.dev@gmail.com</p>

      <h2>8. プライバシーポリシーの変更</h2>
      <p>本プライバシーポリシーは、法令の変更やサービスの改善等により変更することがあります。変更した場合は、当サイトに掲載してお知らせします。</p>
    </div>
    </>
  );
};

export default PrivacyPolicy;
