import React from "react";

const GoogleLoginButton: React.FC = () => {
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/api/';
  
  return (
    <button
      type="button"
      onClick={() => { 
        // VITE_API_ENDPOINTからbaseURLを取得し、authパスを追加
        const baseUrl = apiEndpoint.replace('/api/', '/');
        window.location.href = `${baseUrl}auth/google/login`; 
      }}
    style={{
      width: "100%",
      padding: 10,
      background: "#fff",
      color: "#444",
      border: "1px solid #ccc",
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
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google"
      style={{ width: 20, height: 20, marginRight: 8 }}
    />
    Googleでログイン
    </button>
  );
};

export default GoogleLoginButton;
