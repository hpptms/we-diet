import React from 'react';
import { getCurrentLanguage } from '../i18n';

const TermsOfService: React.FC = () => {
  const currentLanguage = getCurrentLanguage();

  // 日本語版
  const renderJapanese = () => (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
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
        <li>Facebookログイン</li>
        <li>Google OAuth</li>
        <li>TikTokログイン</li>
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
  );

  // 英語版
  const renderEnglish = () => (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString('en-US')}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using We Diet ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h2>2. Description of Service</h2>
      <p>We Diet is a social wellness platform that allows users to:</p>
      <ul>
        <li>Track daily meals, exercise, and weight management</li>
        <li>Record and share fitness journey progress</li>
        <li>Connect with a supportive community</li>
        <li>Access health and wellness resources</li>
      </ul>

      <h2>3. User Accounts</h2>
      <p>To use certain features of the Service, you must register for an account. You agree to:</p>
      <ul>
        <li>Provide accurate and complete information</li>
        <li>Maintain the security of your account credentials</li>
        <li>Be responsible for all activities under your account</li>
        <li>Notify us of any unauthorized use</li>
      </ul>

      <h2>4. User Content and Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Post harmful, offensive, or inappropriate content</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe on intellectual property rights</li>
        <li>Spam or harass other users</li>
        <li>Share false or misleading health information</li>
      </ul>

      <h2>5. Privacy</h2>
      <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>

      <h2>6. Third-Party Services</h2>
      <p>Our Service integrates with third-party platforms including:</p>
      <ul>
        <li>Facebook Login</li>
        <li>Google OAuth</li>
        <li>TikTok Login</li>
      </ul>
      <p>Your use of these services is subject to their respective terms and privacy policies.</p>

      <h2>7. Disclaimers</h2>
      <p>The Service is provided "as is" without warranties of any kind. We do not provide medical advice and recommend consulting healthcare professionals for medical concerns.</p>

      <h2>8. Limitation of Liability</h2>
      <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>

      <h2>9. Modifications</h2>
      <p>We reserve the right to modify these terms at any time. Changes will be effective upon posting to this page.</p>

      <h2>10. Termination</h2>
      <p>We may terminate or suspend your account at any time for violations of these terms.</p>

      <h2>11. Contact Information</h2>
      <p>If you have any questions about these Terms of Service, please contact us at:<br/>Email: we.diet.dev@gmail.com</p>

      <h2>12. Governing Law</h2>
      <p>These terms are governed by the laws of Japan.</p>
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

export default TermsOfService;
