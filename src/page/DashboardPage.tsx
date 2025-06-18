import React from "react";
import Header from "../component/Header";
import Footer from "../component/Footer";

// 仮のユーザー名取得（本来はContextやAPIから取得する想定）
const getAccountName = () => {
  // 例: localStorage.getItem("accountName") など
  return localStorage.getItem("accountName") || "ユーザー";
};

const DashboardPage: React.FC = () => {
  const accountName = getAccountName();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h1>ようこそ {accountName} さん</h1>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
