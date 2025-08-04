import React, { useEffect } from "react";

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

const FacebookLoginButton: React.FC = () => {
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/api/';
  const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID || 'your-facebook-app-id-here';

  useEffect(() => {
    // Facebook SDK初期化
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
      
      window.FB.AppEvents.logPageView();
    };

    // Facebook SDK スクリプトの動的読み込み
    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/ja_JP/sdk.js';
      document.getElementsByTagName('head')[0].appendChild(js);
    }
  }, [facebookAppId]);

  return (
    <button
      type="button"
      onClick={() => { window.location.href = `${apiEndpoint}auth/facebook/login`; }}
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
