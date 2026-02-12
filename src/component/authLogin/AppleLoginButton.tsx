import React from "react";
import { trackLogin } from "../../utils/googleAnalytics";
import { useTranslation } from "../../hooks/useTranslation";
import { openAuthUrl } from "../../utils/platform";

const AppleLoginButton: React.FC = () => {
  const { t } = useTranslation();
  const apiEndpoint = import.meta.env.VITE_API_BASE_URL || 'https://we-diet-backend.com/';

  return (
    <button
      type="button"
      onClick={() => {
        trackLogin('apple');
        const baseUrl = apiEndpoint.endsWith('/') ? apiEndpoint : apiEndpoint + '/';
        openAuthUrl(`${baseUrl}auth/apple/login`);
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
      <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, fill: "#fff" }}>
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
      {t('auth', 'loginWithApple', {}, 'Appleでログイン')}
    </button>
  );
};

export default AppleLoginButton;
