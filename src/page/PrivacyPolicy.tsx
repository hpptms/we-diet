import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentLanguage } from '../i18n';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const currentLanguage = getCurrentLanguage();

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

  // 日本語版
  const renderJapanese = () => (
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
        <li>FacebookやGoogleなどの外部サービスから提供される情報</li>
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
        <li>Facebook Login</li>
        <li>Google OAuth</li>
        <li>TikTok Login</li>
      </ul>
      <p>これらのサービスのプライバシーポリシーについては、各サービスの公式サイトをご確認ください。</p>

      <h2>7. お問い合わせ</h2>
      <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：<br/>メールアドレス: privacy@we-diat.com</p>

      <h2>8. プライバシーポリシーの変更</h2>
      <p>本プライバシーポリシーは、法令の変更やサービスの改善等により変更することがあります。変更した場合は、当サイトに掲載してお知らせします。</p>
    </div>
  );

  // 英語版
  const renderEnglish = () => (
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
        ← Back to Top
      </button>
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
      
      <h2>1. Information Collection</h2>
      <p>We Diet ("the Service") may collect the following personal information:</p>
      <ul>
        <li>Name, email address</li>
        <li>Profile information (height, weight, age, etc.)</li>
        <li>Meal records, exercise records</li>
        <li>Information provided by external services such as Facebook and Google</li>
      </ul>

      <h2>2. Use of Personal Information</h2>
      <p>We use the collected personal information for the following purposes:</p>
      <ul>
        <li>Providing, operating, and improving the service</li>
        <li>User support</li>
        <li>Creating statistical data (in a form that cannot identify individuals)</li>
      </ul>

      <h2>3. Third-Party Disclosure</h2>
      <p>We will not provide personal information to third parties without your consent, except as required by law.</p>

      <h2>4. Information Security</h2>
      <p>We implement appropriate security measures to prevent leakage, loss, or damage of personal information.</p>

      <h2>5. About Cookies</h2>
      <p>This service may use cookies to improve the service. If you do not wish to use cookies, you can disable them in your browser settings.</p>

      <h2>6. External Service Integration</h2>
      <p>This service integrates with the following external services:</p>
      <ul>
        <li>Facebook Login</li>
        <li>Google OAuth</li>
        <li>TikTok Login</li>
      </ul>
      <p>Please check the official websites of each service for their privacy policies.</p>

      <h2>7. Contact Us</h2>
      <p>For inquiries about the handling of personal information, please contact us at:<br/>Email: privacy@we-diat.com</p>

      <h2>8. Changes to Privacy Policy</h2>
      <p>This privacy policy may be changed due to changes in laws or service improvements. When changes are made, we will notify you by posting them on this site.</p>
    </div>
  );

  // 言語に基づいてコンテンツを選択
  switch (currentLanguage) {
    case 'en':
      return renderEnglish();
    case 'ja':
    default:
      return renderJapanese();
  }
};

export default PrivacyPolicy;
