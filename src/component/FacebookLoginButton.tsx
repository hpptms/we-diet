import React from "react";

const FacebookLoginButton: React.FC = () => (
  <button
    type="button"
    onClick={() => { window.location.href = "/auth/facebook/login"; }}
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
      marginTop: 12,
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

export default FacebookLoginButton;
