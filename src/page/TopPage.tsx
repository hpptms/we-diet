import React from 'react';
import { Box } from '@mui/material';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { HeroSection, FeatureSection, ProductSection } from '../component/TopPage';
import { SEOHelmet } from '../component/SEOHelmet';
import { useTranslation } from '../hooks/useTranslation';
import { setLanguageToEnglish, setLanguageToJapanese, setLanguageToChineseCN, setLanguageToKorean, setLanguageToSpanish } from '../i18n';

// 言語に対応したAMPリンクを生成
const getAMPLink = (type: 'privacy' | 'terms' | 'dataDeletion', language: string): string => {
  if (language === 'ja') {
    return type === 'privacy' ? '/amp/privacy-policy.html' : 
           type === 'terms' ? '/amp/terms-of-service.html' : 
           '/amp/data-deletion.html';
  }
  
  // 各言語コードのマッピング
  const langCodeMap: { [key: string]: string } = {
    'zh-CN': 'zh',
    'en': 'en',
    'ko': 'ko', 
    'es': 'es'
  };
  
  const langCode = langCodeMap[language] || language;
  
  return type === 'privacy' 
    ? `/amp/privacy-policy/${langCode}.html` 
    : type === 'terms'
    ? `/amp/terms-of-service/${langCode}.html`
    : `/amp/data-deletion/${langCode}.html`;
};

export const TopPage = () => {
  const { t, language, setLanguage } = useTranslation();
  
  // 現在の言語に基づいてcanonical URLを生成
  const getCanonicalUrl = () => {
    const baseUrl = 'https://we-diet.net';
    switch (language) {
      case 'en':
        return `${baseUrl}/en/`;
      case 'ko':
        return `${baseUrl}/ko/`;
      case 'zh-CN':
        return `${baseUrl}/zh/`;
      case 'ja':
      default:
        return `${baseUrl}/`;
    }
  };

  // 多言語対応のhreflangタグ設定
  const alternateUrls = [
    { lang: 'ja', url: 'https://we-diet.net/' },
    { lang: 'en', url: 'https://we-diet.net/en/' },
    { lang: 'ko', url: 'https://we-diet.net/ko/' },
    { lang: 'zh', url: 'https://we-diet.net/zh/' },
    { lang: 'x-default', url: 'https://we-diet.net/' }
  ];

  // 言語に応じたタイトルと説明文
  const getSEOContent = () => {
    switch (language) {
      case 'en':
        return {
          title: 'We Diet - Diet SNS App | Weight Management, Food Log & Exercise Tracking with Friends',
          description: 'Hard to continue dieting alone? We Diet makes it fun with friends! Share food logs, exercise records, and weight management on social platform. Free diet tracking app with motivation support. Start your healthy lifestyle journey today.'
        };
      case 'ko':
        return {
          title: 'We Diet - 다이어트 SNS 앱 | 친구와 함께하는 체중 관리, 식사 기록, 운동 기록',
          description: '혼자서는 계속하기 어려운 다이어트도 친구가 있으면 즐겁게 지속할 수 있습니다. We Diet은 식사 기록, 운동 기록, 체중 관리를 SNS로 공유할 수 있는 다이어트 기록 앱. 동기 부여를 지원하는 건강 관리 SNS 플랫폼. 무료로 시작하세요.'
        };
      case 'zh-CN':
        return {
          title: 'We Diet - 减肥SNS应用 | 与伙伴一起坚持的体重管理、饮食记录、运动记录',
          description: '一个人很难坚持减肥，但有伙伴就能愉快地持续下去。We Diet是可以在SNS上分享饮食记录、运动记录、体重管理的减肥记录应用。支持维持动力的健康管理SNS平台。免费开始使用。'
        };
      case 'ja':
      default:
        return {
          title: 'We Diet - ダイエットSNSアプリ | 仲間と続ける体重管理・食事記録・運動記録',
          description: '一人では続けにくいダイエットも、仲間がいれば楽しく継続できる。We Dietは食事記録・運動記録・体重管理をSNSで共有できるダイエット記録アプリ。モチベーション維持をサポートする健康管理SNSプラットフォーム。無料で始められます。'
        };
    }
  };

  const seoContent = getSEOContent();
  
  // ブラウザ言語による自動表示テスト
  console.log('Current language:', language);

  // デバッグ用: 英語テスト関数
  const switchToEnglishForTest = () => {
    setLanguageToEnglish();
    setLanguage('en');
    console.log('🔄 言語を英語に切り替えました (テスト用)');
  };

  // デバッグ用: 日本語に戻す関数
  const switchToJapaneseForTest = () => {
    setLanguageToJapanese();
    setLanguage('ja');
    console.log('🔄 言語を日本語に戻しました');
  };

  // デバッグ用: 中国語テスト関数
  const switchToChineseForTest = () => {
    setLanguageToChineseCN();
    setLanguage('zh-CN');
    console.log('🔄 言語を中国語(簡体字)に切り替えました (テスト用)');
  };

  // デバッグ用: 韓国語テスト関数
  const switchToKoreanForTest = () => {
    setLanguageToKorean();
    setLanguage('ko');
    console.log('🔄 言語を韓国語に切り替えました (テスト用)');
  };

  // デバッグ用: スペイン語テスト関数
  const switchToSpanishForTest = () => {
    setLanguageToSpanish();
    setLanguage('es');
    console.log('🔄 言語をスペイン語に切り替えました (テスト用)');
  };

  // デバッグ用: コンソールに関数を公開
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).switchToEnglishForTest = switchToEnglishForTest;
      (window as any).switchToJapaneseForTest = switchToJapaneseForTest;
      (window as any).switchToChineseForTest = switchToChineseForTest;
      (window as any).switchToKoreanForTest = switchToKoreanForTest;
      (window as any).switchToSpanishForTest = switchToSpanishForTest;
      console.log('🌐 多言語テスト用デバッグ関数が利用可能です(TopPage):');
      console.log('  switchToEnglishForTest() - 英語表示に切り替え');
      console.log('  switchToJapaneseForTest() - 日本語表示に切り替え');
      console.log('  switchToChineseForTest() - 中国語(簡体字)表示に切り替え');
      console.log('  switchToKoreanForTest() - 韓国語表示に切り替え');
      console.log('  switchToSpanishForTest() - スペイン語表示に切り替え');
      console.log('  現在の言語:', language);
    }
  }, [language]);

  return (
    <>
      {/* SEO設定 - canonicalタグとhreflangタグを動的に設定 */}
      <SEOHelmet
        title={seoContent.title}
        description={seoContent.description}
        canonicalUrl={getCanonicalUrl()}
        alternateUrls={alternateUrls}
      />
      
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden", // 横スクロールを防ぐ
        margin: 0, // マージン完全削除
        padding: 0, // パディング完全削除
        position: "relative"
      }}>
      {/* デバッグ用: 言語テストボタン */}
      {window.location.hostname === '192.168.1.22' && (
        <Box sx={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 10000,
          display: 'flex',
          gap: 1,
          flexDirection: 'column'
        }}>
          <button
            onClick={switchToEnglishForTest}
            style={{
              backgroundColor: language === 'en' ? '#4caf50' : '#2196f3',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇺🇸 EN
          </button>
          <button
            onClick={switchToJapaneseForTest}
            style={{
              backgroundColor: language === 'ja' ? '#4caf50' : '#ff9800',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇯🇵 JP
          </button>
          <button
            onClick={switchToChineseForTest}
            style={{
              backgroundColor: language === 'zh-CN' ? '#4caf50' : '#9c27b0',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇨🇳 CN
          </button>
          <button
            onClick={switchToKoreanForTest}
            style={{
              backgroundColor: language === 'ko' ? '#4caf50' : '#f44336',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇰🇷 KO
          </button>
          <button
            onClick={switchToSpanishForTest}
            style={{
              backgroundColor: language === 'es' ? '#4caf50' : '#795548',
              color: 'white',
              border: 'none',
              padding: '6px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            🇪🇸 ES
          </button>
          <div style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            textAlign: 'center'
          }}>
            {language.toUpperCase()}
          </div>
        </Box>
      )}
      {/* ナビゲーションバー */}
      <Header />

      <div style={{ 
        flex: 1,
        width: "100%", // 幅を100%に制限
        maxWidth: "100vw", // ビューポート幅を超えないように
        overflowX: "hidden", // 横スクロールを防ぐ
        margin: 0, // マージン完全削除
        padding: 0, // パディング完全削除
        // セクション間のスキマを完全に除去
        display: "flex",
        flexDirection: "column",
        gap: 0, // ギャップを0に設定
      }}>
        {/* ヒーローセクション - English Testing Mode */}
        <HeroSection language={language} />

        {/* 特集セクション */}
        <FeatureSection language={language} />

        {/* 製品詳細セクション */}
        <ProductSection language={language} />
        
        {/* 法的リンクセクション */}
        <div style={{
          padding: "40px 0",
          backgroundColor: "#f8f9fa",
          textAlign: "center"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap"
          }}>
            <a 
              href={getAMPLink('privacy', language)}
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 15px",
                borderRadius: "4px"
              }}
            >
              {t('pages', 'topPage.footer.privacyPolicy')}
            </a>
            <a 
              href={getAMPLink('terms', language)}
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 15px",
                borderRadius: "4px"
              }}
            >
              {t('pages', 'topPage.footer.termsOfService')}
            </a>
            <a 
              href={getAMPLink('dataDeletion', language)}
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 15px",
                borderRadius: "4px"
              }}
            >
              データ削除手順
            </a>
          </div>
        </div>
      </div>

      {/* フッターセクション */}
      <Footer />
      </div>
    </>
  );
};
