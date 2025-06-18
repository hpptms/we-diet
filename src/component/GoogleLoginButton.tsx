import React from "react";

const GoogleLoginButton: React.FC = () => (
  <button
    type="button"
    onClick={() => { window.location.href = "http://192.168.1.19:8080/auth/google/login"; }}
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

export default GoogleLoginButton;
