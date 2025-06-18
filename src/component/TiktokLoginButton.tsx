import React from "react";

const TiktokLoginButton: React.FC = () => (
  <button
    type="button"
    onClick={() => { window.location.href = "/auth/tiktok/login"; }}
    style={{
      width: "100%",
      padding: 10,
      background: "#010101",
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
      marginTop: 12,
      height: 44,
    }}
  >
    <span style={{ display: "flex", alignItems: "center", marginRight: 8 }}>
      {/* TikTok公式SVGアイコン */}
      <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
        <g>
          <path d="M41.5 16.5c-3.7 0-6.7-3-6.7-6.7V6.5h-6.2v25.2c0 2.7-2.2 4.9-4.9 4.9s-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9c.5 0 1 .1 1.5.2v-6.3c-.5-.1-1-.1-1.5-.1-6.2 0-11.2 5-11.2 11.2s5 11.2 11.2 11.2 11.2-5 11.2-11.2V23c2 1.1 4.3 1.7 6.7 1.7v-8.2z" fill="#25F4EE"/>
          <path d="M41.5 18.2c-2.4 0-4.7-.6-6.7-1.7v7.1c0 6.2-5 11.2-11.2 11.2-2.2 0-4.2-.6-5.9-1.7 2 3.1 5.5 5.2 9.4 5.2 6.2 0 11.2-5 11.2-11.2V23c2 1.1 4.3 1.7 6.7 1.7v-6.5z" fill="#FE2C55"/>
          <path d="M34.8 16.5v7.1c0 6.2-5 11.2-11.2 11.2-2.2 0-4.2-.6-5.9-1.7 2 3.1 5.5 5.2 9.4 5.2 6.2 0 11.2-5 11.2-11.2V23c2 1.1 4.3 1.7 6.7 1.7v-8.2c-3.7 0-6.7-3-6.7-6.7z" fill="#fff"/>
        </g>
      </svg>
    </span>
    TikTokでログイン
  </button>
);

export default TiktokLoginButton;
