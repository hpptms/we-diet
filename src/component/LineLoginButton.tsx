import React from "react";

const LineLoginButton: React.FC = () => {
  const apiEndpoint = import.meta.env.VITE_API_BASE_URL || 'https://we-diet-backend.com/';
  
  // デバッグ用：環境変数の値をコンソールに出力
  console.log('Environment variables:', {
    VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    apiEndpoint: apiEndpoint
  });
  
  return (
    <button
      type="button"
      onClick={() => { 
        // VITE_API_BASE_URLからbaseURLを取得し、authパスを追加
        const baseUrl = apiEndpoint.endsWith('/') ? apiEndpoint : apiEndpoint + '/';
        console.log('Redirecting to:', `${baseUrl}auth/line/login`);
        window.location.href = `${baseUrl}auth/line/login`; 
      }}
    style={{
      width: "100%",
      padding: 10,
      background: "#00B900",
      color: "#fff",
      border: "1px solid #00B900",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 500,
      fontSize: 16,
      cursor: "pointer",
      gap: 8,
    }}
  >
    <img
      src="https://cdn.worldvectorlogo.com/logos/line-1.svg"
      alt="LINE"
      style={{ width: 20, height: 20, marginRight: 8 }}
    />
    LINEでログイン
    </button>
  );
};

export default LineLoginButton;
