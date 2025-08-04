import React from "react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookLoginButton: React.FC = () => {
  const apiEndpoint = import.meta.env.VITE_API_BASE_URL || 'https://we-diet-backend.com/';

  // デバッグ用：環境変数の値をコンソールに出力
  console.log('Facebook Environment variables:', {
    VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
    apiEndpoint: apiEndpoint
  });

  return (
    <button
      type="button"
      onClick={() => { 
        const baseUrl = apiEndpoint.endsWith('/') ? apiEndpoint : apiEndpoint + '/';
        console.log('Facebook redirecting to:', `${baseUrl}auth/facebook/login`);
        window.location.href = `${baseUrl}auth/facebook/login`;
      }}
      style={{
        width: "100%",
        padding: 10,
        background: "#1877f2",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 500,
        fontSize: 16,
        cursor: "pointer",
        gap: 8,
        marginTop: 0,
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
        alt="Facebook"
        style={{ width: 20, height: 20, marginRight: 8, background: "#fff", borderRadius: "50%" }}
      />
      Facebookでログイン
    </button>
  );
};

export default FacebookLoginButton;
