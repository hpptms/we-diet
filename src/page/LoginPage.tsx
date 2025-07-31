import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { MdLogin } from "react-icons/md";
import axios from "axios";
import { encodeMailRegisterRequest, decodeMailRegisterResponse } from "../proto/mail_register_pb";
import MailRegisterModal from "../component/MailRegisterModal";
import MailRegisterButton from "../component/MailRegisterButton";
import GoogleLoginButton from "../component/authLogin/GoogleLoginButton";
import FacebookLoginButton from "../component/FacebookLoginButton";
import TiktokLoginButton from "../component/TiktokLoginButton";
import { useSetRecoilState } from "recoil";
import { serverProfileState, profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";

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
  const setServerProfile = useSetRecoilState(serverProfileState);
  const setProfileSettings = useSetRecoilState(profileSettingsState);
  
  // レスポンシブデザイン用のブレークポイント
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')); // 768px以下
  const isPortraitMode = useMediaQuery('(orientation: portrait)');
  const isSmallScreen = useMediaQuery('(max-width: 900px)');
  const shouldUseFullWidth = isTabletOrMobile || isPortraitMode || isSmallScreen;

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

  // URLパラメータからエラーを検出し、適切なエラーメッセージを表示
  useEffect(() => {
    if (localStorage.getItem("accountName")) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // URLパラメータからエラーを取得
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      let errorMessage = '';
      switch (errorParam) {
        case 'user_creation':
          errorMessage = 'ユーザー作成に失敗しました。しばらく時間をおいて再度お試しください。';
          break;
        case 'invalid_state':
          errorMessage = 'セキュリティエラーが発生しました。再度ログインをお試しください。';
          break;
        case 'token_exchange':
          errorMessage = '認証トークンの取得に失敗しました。再度ログインをお試しください。';
          break;
        case 'service_creation':
          errorMessage = 'サービス接続エラーが発生しました。再度ログインをお試しください。';
          break;
        case 'userinfo':
          errorMessage = 'ユーザー情報の取得に失敗しました。再度ログインをお試しください。';
          break;
        case 'db_error':
          errorMessage = 'データベースエラーが発生しました。管理者にお問い合わせください。';
          break;
        case 'jwt_generation':
          errorMessage = '認証処理に失敗しました。再度ログインをお試しください。';
          break;
        default:
          errorMessage = 'ログイン処理中にエラーが発生しました。再度お試しください。';
      }
      setError(errorMessage);
      
      // エラーパラメータをURLから削除（ページリロード時の再表示を防ぐ）
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
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
          email: email,
          password,
        }
      );
      console.log("ログイン成功:", response.data);
      
      // レスポンスからアカウント名を取得しlocalStorageに保存
      const data = response.data;
      localStorage.setItem("accountName", data.accountName || email);
      console.log("localStorageに保存:", data.accountName || email);
      
      // ログイン成功後、プロフィールを取得
      await fetchUserProfileAfterLogin(data.userId || 2);
      
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

  // ログイン後にプロフィールを取得する関数
  const fetchUserProfileAfterLogin = async (userId: number) => {
    try {
      console.log("ログイン後プロフィール取得中...", { userId });
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}proto/user_profile/${userId}`);
      
      if (response.data && response.data.profile) {
        const profile = response.data.profile;
        console.log("ログイン後プロフィール取得成功:", profile);
        
        const now = Date.now();
        // サーバープロフィール状態を更新
        setServerProfile({
          userId,
          profile,
          lastFetched: now,
        });
        
        // 既存のローカル設定をチェック
        const currentLocalData = localStorage.getItem('profileSettingsData');
        console.log("現在のローカルデータ:", currentLocalData);
        
        if (!currentLocalData) {
          // ローカルデータがない場合のみ設定
          const localProfile = convertServerProfileToLocalProfile(profile);
          console.log("新規ローカルプロフィール設定:", localProfile);
          setProfileSettings(localProfile);
        } else {
          console.log("既存のローカルデータを保持");
        }
        
        console.log("プロフィール状態更新完了");
      }
    } catch (error: any) {
      console.log("ログイン後プロフィール取得エラー:", error);
      // 404エラーの場合は初回ログイン（プロフィール未作成）なので、エラーログのみ
      if (error.response?.status === 404) {
        console.log("プロフィールが見つかりません（初回ログイン）");
      }
    }
  };

  // レスポンシブスタイル設定
  const containerStyles = {
    minHeight: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    background: '#f5f5f7',
    boxSizing: "border-box",
    overflowX: "hidden",
  };

  const mainBoxStyles = {
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: shouldUseFullWidth ? "flex-start" : "center",
    p: shouldUseFullWidth ? 0 : 2,
  };

  const loginCardStyles = {
    maxWidth: shouldUseFullWidth ? "100%" : 600,
    width: shouldUseFullWidth ? "100%" : "auto",
    background: '#FFF',
    m: shouldUseFullWidth ? 0 : "40px auto",
    p: shouldUseFullWidth ? { xs: 2, sm: 3 } : 3,
    border: shouldUseFullWidth ? "none" : "1px solid #ccc",
    borderRadius: shouldUseFullWidth ? 0 : 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: shouldUseFullWidth ? "100vh" : "auto",
    justifyContent: shouldUseFullWidth ? "center" : "flex-start",
    boxSizing: "border-box",
  };

  return (
    <Box sx={containerStyles}>
      {!shouldUseFullWidth && <Header />}
      <Box sx={mainBoxStyles}>
        <Box sx={loginCardStyles}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: shouldUseFullWidth ? 3 : 2,
              fontSize: shouldUseFullWidth ? { xs: '1.75rem', sm: '2rem' } : '2rem',
              textAlign: 'center',
            }}
          >
            ログイン
          </Typography>
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              width: "100%", 
              maxWidth: shouldUseFullWidth ? "100%" : 400, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}
          >
            <Box sx={{ width: "100%", mb: 2 }}>
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
          <Box sx={{ 
            mt: 1, 
            textAlign: "center", 
            width: "100%", 
            maxWidth: shouldUseFullWidth ? "100%" : 400 
          }}>
            <MailRegisterButton onClick={() => setShowEmailModal(true)} />
          </Box>
          {/* ソーシャルログインボタン */}
          <Box sx={{ 
            mt: 1, 
            textAlign: "center", 
            width: "100%", 
            maxWidth: shouldUseFullWidth ? "100%" : 400,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}>
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
      {!shouldUseFullWidth && <Footer />}
    </Box>
  );
};

export default LoginPage;
