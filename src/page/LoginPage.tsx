import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { MdLogin } from "react-icons/md";
import axios from "axios";
import { encodeMailRegisterRequest, decodeMailRegisterResponse } from "../proto/mail_register_pb";
import MailRegisterModal from "../component/MailRegisterModal";
import MailRegisterButton from "../component/MailRegisterButton";
import GoogleLoginButton from "../component/GoogleLoginButton";
import FacebookLoginButton from "../component/FacebookLoginButton";
import TiktokLoginButton from "../component/TiktokLoginButton";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // メール登録用モーダルの状態
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const navigate = useNavigate();

  // メール登録送信ハンドラ（後でAPI連携）
  const handleSendRegisterEmail = async () => {
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerEmail) {
      setRegisterError("メールアドレスを入力してください");
      return;
    }
    try {
      // Protobufでリクエストをエンコード
      const reqBin = encodeMailRegisterRequest({ email: registerEmail });
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/register/mail`,
        reqBin,
        {
          headers: {
            "Content-Type": "application/x-protobuf",
            "Accept": "application/x-protobuf",
          },
          responseType: "arraybuffer",
        }
      );
      // Protobufでレスポンスをデコード
      const resObj = decodeMailRegisterResponse(new Uint8Array(response.data));
      setRegisterSuccess(resObj.message || "確認メールを送信しました。メールをご確認ください。");
      setRegisterEmail("");
      setTimeout(() => {
        setShowEmailModal(false);
        setRegisterSuccess("");
      }, 2000);
    } catch (err: any) {
      // バイナリレスポンスもdecodeしてエラーメッセージを取得
      if (err.response && err.response.data) {
        try {
          const resObj = decodeMailRegisterResponse(new Uint8Array(err.response.data));
          setRegisterError(resObj.message || "送信に失敗しました");
        } catch {
          setRegisterError("送信に失敗しました");
        }
      } else {
        setRegisterError("送信に失敗しました");
      }
    }
  };

  // すでにログイン済みならダッシュボードへリダイレクト
  useEffect(() => {
    if (localStorage.getItem("accountName")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("/login", {
        username: email,
        password,
      });
      // 仮: レスポンスからアカウント名を取得しlocalStorageに保存
      // 実際はAPIのレスポンスに合わせて修正
      const data = response.data;
      localStorage.setItem("accountName", data.accountName || email);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("ログインに失敗しました");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column",background: '#f5f5f7' }}>
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, background: '#FFF', margin: "40px auto", padding: 24, border: "1px solid #ccc", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>ログイン</h2>
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "100%" }}>
              <label style={{ width: "100%", display: "block" }}>
                メールアドレス
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                />
              </label>
            </div>
            <div style={{ width: "100%" }}>
              <label style={{ width: "100%", display: "block" }}>
                パスワード
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                />
              </label>
            </div>
            {error && <div style={{ color: "red", marginBottom: 8, width: "100%", textAlign: "center" }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 12, background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 500, fontSize: 16 }}>
              <MdLogin size={22} style={{ marginRight: 4 }} />
              ログイン
            </button>
          </form>
          {/* メールで登録ボタン */}
          <div style={{ marginTop: 12, textAlign: "center", width: "100%", maxWidth: 400 }}>
            <MailRegisterButton onClick={() => setShowEmailModal(true)} />
          </div>
          <div style={{ marginTop: 24, textAlign: "center", width: "100%", maxWidth: 400 }}>
            <GoogleLoginButton />
            <FacebookLoginButton />
            <TiktokLoginButton />
          </div>
          {/* メールアドレス入力用モーダル */}
          <MailRegisterModal
            open={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            onSend={handleSendRegisterEmail}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerError={registerError}
            registerSuccess={registerSuccess}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
