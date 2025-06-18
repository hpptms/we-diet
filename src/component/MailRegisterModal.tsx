import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: () => void;
  registerEmail: string;
  setRegisterEmail: (v: string) => void;
  registerError: string;
  registerSuccess: string;
};

const MailRegisterModal: React.FC<Props> = ({
  open,
  onClose,
  onSend,
  registerEmail,
  setRegisterEmail,
  registerError,
  registerSuccess,
}) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 32,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          minWidth: 320,
          maxWidth: "90vw",
        }}
      >
        <h3>メールアドレスで登録</h3>
        <input
          type="email"
          value={registerEmail}
          onChange={e => setRegisterEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          style={{ width: "100%", padding: 8, margin: "12px 0" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            onClick={onSend}
            style={{
              flex: 1,
              padding: 10,
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            送信
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 10,
              background: "#ccc",
              color: "#333",
              border: "none",
              borderRadius: 4,
              fontWeight: 500,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
        </div>
        {registerError && (
          <div style={{ color: "red", marginTop: 8 }}>{registerError}</div>
        )}
        {registerSuccess && (
          <div style={{ color: "green", marginTop: 8 }}>{registerSuccess}</div>
        )}
      </div>
    </div>
  );
};

export default MailRegisterModal;
