import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentLanguage } from '../i18n';
import { SEOHelmet } from '../component/SEOHelmet';

const RegisterCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const currentLanguage = getCurrentLanguage();

  const seoHelmet = (
    <SEOHelmet
      title="登録完了 | We Diet - ダイエットSNS"
      description="We Dietへの登録が完了しました。"
      canonicalUrl="https://we-diet.net/register-complete"
      noindex={true}
    />
  );

  useEffect(() => {
    // ここで本来はメールアドレスの有効性検証APIを呼ぶ
    // 仮実装: 2秒後にダッシュボードへ遷移
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  // 日本語版
  const renderJapanese = () => (
    <>
      {seoHelmet}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>登録が完了しました</h2>
        <p>ダッシュボードへリダイレクトします...</p>
      </div>
    </>
  );

  // 英語版
  const renderEnglish = () => (
    <>
      {seoHelmet}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2>Registration Complete</h2>
        <p>Redirecting to dashboard...</p>
      </div>
    </>
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

export default RegisterCompletePage;
