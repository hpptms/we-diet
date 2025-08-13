import React from "react";
import { trackLogin } from "../utils/googleAnalytics";
import { useTranslation } from "../hooks/useTranslation";

const XLoginButton: React.FC = () => {
  const { t } = useTranslation();
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
        // Google Analyticsでログイン試行を追跡
        trackLogin('x');
        
        // VITE_API_BASE_URLからbaseURLを取得し、authパスを追加
        const baseUrl = apiEndpoint.endsWith('/') ? apiEndpoint : apiEndpoint + '/';
        console.log('Redirecting to:', `${baseUrl}auth/x/login`);
        window.location.href = `${baseUrl}auth/x/login`; 
      }}
    style={{
      width: "100%",
      padding: 10,
      background: "#000",
      color: "#fff",
      border: "1px solid #000",
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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: 20, height: 20, marginRight: 8, fill: "#fff" }}
    >
      <g>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </g>
    </svg>
    {t('auth', 'loginWithX', {}, 'Xでログイン')}
    </button>
  );
};

export default XLoginButton;
