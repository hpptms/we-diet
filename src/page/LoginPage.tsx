import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { Box, Typography, Button } from "@mui/material";
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
        `${import.meta.env.VITE_API_ENDPOINT}register/mail`,
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
    console.log("ログイン開始:", { email, password: "***" });
    console.log("API Endpoint:", `${import.meta.env.VITE_API_ENDPOINT}login`);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}login`,
        {
          email,
          password,
        }
      );
      console.log("ログイン成功:", response.data);
      
      // レスポンスからアカウント名を取得しlocalStorageに保存
      const data = response.data;
      localStorage.setItem("accountName", data.accountName || email);
      console.log("localStorageに保存:", data.accountName || email);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("ログインエラー:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("ログインに失敗しました");
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: '#f5f5f7' }}>
      <Header />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ maxWidth: 600, background: '#FFF', m: "40px auto", p: 3, border: "1px solid #ccc", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            ログイン
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box sx={{ width: "100%", mb: 2 }}>
              <label style={{ width: "100%", display: "block" }}>
                メールアドレス or ユーザーネーム
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                />
              </label>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
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
            </Box>
            {error && (
              <Typography color="error" sx={{ mb: 1, width: "100%", textAlign: "center" }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<MdLogin size={22} />}
              sx={{ py: 1.5, fontWeight: 500, fontSize: 16, borderRadius: 1, mt: 1 }}
            >
              ログイン
            </Button>
          </form>
          {/* メールで登録ボタン */}
          <Box sx={{ mt: 1.5, textAlign: "center", width: "100%", maxWidth: 400 }}>
            <MailRegisterButton onClick={() => setShowEmailModal(true)} />
          </Box>
          <Box sx={{ mt: 3, textAlign: "center", width: "100%", maxWidth: 400 }}>
            <GoogleLoginButton />
            <FacebookLoginButton />
            <TiktokLoginButton />
          </Box>
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
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default LoginPage;
