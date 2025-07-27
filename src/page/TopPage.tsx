import React from 'react';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { HeroSection, FeatureSection, ProductSection } from '../component/TopPage';

export const TopPage = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ナビゲーションバー */}
      <Header />

      <div style={{ flex: 1 }}>
        {/* ヒーローセクション */}
        <HeroSection />

        {/* 特集セクション */}
        <FeatureSection />

        {/* 製品詳細セクション */}
        <ProductSection />
      </div>

      {/* フッターセクション */}
      <Footer />
    </div>
  );
};
