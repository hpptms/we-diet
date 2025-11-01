import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  canonicalUrl: string;
  alternateUrls?: {
    lang: string;
    url: string;
  }[];
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

/**
 * SEOHelmet - 動的にSEOタグを設定するコンポーネント
 * Google検索エンジン向けに適切なcanonicalタグとhreflangタグを設定
 */
export const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = 'We Diet - ダイエットSNSアプリ | 仲間と続ける体重管理・食事記録・運動記録',
  description = '一人では続けにくいダイエットも、仲間がいれば楽しく継続できる。We Dietは食事記録・運動記録・体重管理をSNSで共有できるダイエット記録アプリ。モチベーション維持をサポートする健康管理SNSプラットフォーム。無料で始められます。',
  canonicalUrl,
  alternateUrls = [],
  ogImage = 'https://res.cloudinary.com/drmyhhtjo/image/upload/v1753593907/afa4835f-e2b4-49f9-b342-1c272be930d3_cngflc.webp',
  ogType = 'website',
  twitterCard = 'summary_large_image'
}) => {
  return (
    <Helmet>
      {/* 基本メタタグ */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="ダイエット,SNS,体重管理,食事記録,運動記録,ダイエットアプリ,健康管理,モチベーション,ダイエット仲間,レコーディングダイエット,ダイエット記録,体重記録,カロリー管理,健康SNS" />
      
      {/* Canonical URL - 重複コンテンツ問題を解決 */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* 多言語対応 - hreflangタグ */}
      {alternateUrls.map((alternate) => (
        <link
          key={alternate.lang}
          rel="alternate"
          hrefLang={alternate.lang}
          href={alternate.url}
        />
      ))}
      
      {/* OGPタグ */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter Cardタグ */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* ロボットタグ */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
    </Helmet>
  );
};
