import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { HeroSection, FeatureSection, ProductSection } from '../component/TopPage';

export const TopPage = () => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden", // 横スクロールを防ぐ
      margin: 0, // マージン完全削除
      padding: 0, // パディング完全削除
    }}>
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
        {/* ヒーローセクション */}
        <HeroSection />

        {/* 特集セクション */}
        <FeatureSection />

        {/* 製品詳細セクション */}
        <ProductSection />
        
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
            <Link 
              to="/privacy-policy" 
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 15px",
                borderRadius: "4px"
              }}
            >
              プライバシーポリシー
            </Link>
            <Link 
              to="/terms-of-service" 
              style={{
                color: "#6c757d",
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px 15px",
                borderRadius: "4px"
              }}
            >
              利用規約
            </Link>
          </div>
        </div>
      </div>

      {/* フッターセクション */}
      <Footer />
    </div>
  );
};
