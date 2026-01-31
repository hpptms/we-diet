import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { SEOHelmet } from "../component/SEOHelmet";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { MdLogin } from "react-icons/md";
import axios from "axios";
import MailRegisterModal from "../component/MailRegisterModal";
import MailRegisterButton from "../component/MailRegisterButton";
import GoogleLoginButton from "../component/authLogin/GoogleLoginButton";
import FacebookLoginButton from "../component/FacebookLoginButton";
import TiktokLoginButton from "../component/TiktokLoginButton";
import LineLoginButton from "../component/LineLoginButton";
import XLoginButton from "../component/XLoginButton";
import { useSetRecoilState } from "recoil";
import { serverProfileState, profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";
import { useTranslation } from "../hooks/useTranslation";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
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

  // メール登録送信ハンドラ
  const handleSendRegisterEmail = async () => {
    setRegisterError("");
    setRegisterSuccess("");
    if (!registerEmail) {
      setRegisterError(t('auth', 'enterEmailAddress', {}, 'メールアドレスを入力してください'));
      return;
    }
    try {
      // JSONでリクエストを送信
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register/mail`,
        { email: registerEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setRegisterSuccess(response.data.message || t('auth', 'sendVerificationEmail', {}, '確認メールを送信しました。メールをご確認ください。'));
      setRegisterEmail("");
      setTimeout(() => {
        setShowEmailModal(false);
        setRegisterSuccess("");
      }, 2000);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setRegisterError(err.response.data.error || err.response.data.message || t('auth', 'sendingFailed', {}, '送信に失敗しました'));
      } else {
        setRegisterError(t('auth', 'sendingFailed', {}, '送信に失敗しました'));
      }
    }
  };

  // URLパラメータからエラーを検出し、適切なエラーメッセージを表示
  const [isPasswordSetMode, setIsPasswordSetMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("accountName")) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // URLパラメータを取得
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const verifiedParam = urlParams.get('verified');
    
    // メール認証完了後の場合
    if (verifiedParam === 'true') {
      setIsPasswordSetMode(true);
      // verifiedパラメータをURLから削除
      const url = new URL(window.location.href);
      url.searchParams.delete('verified');
      window.history.replaceState({}, '', url.toString());
    }
    
    if (errorParam) {
      let errorMessage = '';
      switch (errorParam) {
        case 'user_creation':
          errorMessage = t('auth', 'userCreationError', {}, 'ユーザー作成に失敗しました。しばらく時間をおいて再度お試しください。');
          break;
        case 'invalid_state':
          errorMessage = t('auth', 'invalidStateError', {}, 'セキュリティエラーが発生しました。再度ログインをお試しください。');
          break;
        case 'token_exchange':
          errorMessage = t('auth', 'tokenExchangeError', {}, '認証トークンの取得に失敗しました。再度ログインをお試しください。');
          break;
        case 'service_creation':
          errorMessage = t('auth', 'serviceCreationError', {}, 'サービス接続エラーが発生しました。再度ログインをお試しください。');
          break;
        case 'userinfo':
          errorMessage = t('auth', 'userinfoError', {}, 'ユーザー情報の取得に失敗しました。再度ログインをお試しください。');
          break;
        case 'db_error':
          errorMessage = t('auth', 'dbError', {}, 'データベースエラーが発生しました。管理者にお問い合わせください。');
          break;
        case 'jwt_generation':
          errorMessage = t('auth', 'jwtGenerationError', {}, '認証処理に失敗しました。再度ログインをお試しください。');
          break;
        default:
          errorMessage = t('auth', 'loginProcessError', {}, 'ログイン処理中にエラーが発生しました。再度お試しください。');
      }
      setError(errorMessage);
      
      // エラーパラメータをURLから削除（ページリロード時の再表示を防ぐ）
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [navigate]);

  // パスワード設定ハンドラ
  const handlePasswordSet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError(t('auth', 'passwordMismatch', {}, 'パスワードが一致しません'));
      return;
    }
    
    if (password.length < 6) {
      setError(t('auth', 'passwordTooShort', {}, 'パスワードは6文字以上である必要があります'));
      return;
    }
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/set-password`,
        {
          email: email,
          password: password,
        }
      );
      
      console.log("パスワード設定成功:", response.data);
      
      // パスワード設定成功後、ログイン処理
      const data = response.data;
      localStorage.setItem("accountName", data.accountName || email);
      localStorage.setItem("user_id", String(data.userId || data.user_id));
      
      // プロフィールを取得
      await fetchUserProfileAfterLogin(data.userId || data.user_id);
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("パスワード設定エラー:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('auth', 'passwordSetFailed', {}, 'パスワード設定に失敗しました'));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (isPasswordSetMode) {
      return handlePasswordSet(e);
    }
    
    e.preventDefault();
    setError("");
    console.log("ログイン開始:", { email, password: "***" });
    console.log("API Endpoint:", `${import.meta.env.VITE_API_BASE_URL}/api/login`);
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        {
          email: email,
          password,
        }
      );
      console.log("ログイン成功:", response.data);
      
      // レスポンスからアカウント名とユーザーIDとJWTトークンを取得しlocalStorageに保存
      const data = response.data;
      localStorage.setItem("accountName", data.accountName || email);
      localStorage.setItem("user_id", String(data.userId || data.user_id || 2));
      
      // JWTトークンを保存
      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
        console.log("JWTトークンを保存しました");
      }
      
      console.log("localStorageに保存:", data.accountName || email, "user_id:", data.userId || data.user_id, "token:", data.token ? "あり" : "なし");
      
      // ログイン成功後、プロフィールを取得
      await fetchUserProfileAfterLogin(data.userId || data.user_id || 2);
      
      navigate("/dashboard");
    } catch (err: any) {
      console.error("ログインエラー:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('auth', 'loginFailed', {}, 'ログインに失敗しました'));
      }
    }
  };

  // ログイン後にプロフィールを取得する関数
  const fetchUserProfileAfterLogin = async (userId: number) => {
    try {
      console.log("ログイン後プロフィール取得中...", { userId });
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/proto/user_profile/${userId}`);
      
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
    <>
      <SEOHelmet
        title="ログイン | We Diet - ダイエットSNS"
        description="We Dietにログイン。ダイエット仲間と一緒に健康的な生活を始めましょう。Google、LINE、Xでの簡単ログインに対応。"
        keywords="ログイン,We Diet,ダイエットSNS,アカウント,サインイン,Google,LINE,X,Twitter,Facebook,TikTok"
        canonicalUrl="https://we-diet.net/login"
        noindex={true}
      />
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
            {isPasswordSetMode ? t('auth', 'passwordSet', {}, 'パスワード設定') : t('auth', 'login', {}, 'ログイン')}
          </Typography>
          {isPasswordSetMode && (
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              {t('auth', 'emailVerificationComplete', {}, 'メール認証が完了しました。')}<br />
              {t('auth', 'setPasswordInstructions', {}, 'アカウントのパスワードを設定してください。')}
            </Typography>
          )}
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
                {t('auth', 'email', {}, 'メールアドレス')}
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                />
              </label>
            </Box>
            <Box sx={{ width: "100%", mb: 2 }}>
              <label style={{ width: "100%", display: "block" }}>
                {isPasswordSetMode ? t('auth', 'newPassword', {}, '新しいパスワード') : t('auth', 'password', {}, 'パスワード')}
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={isPasswordSetMode ? "new-password" : "current-password"}
                  placeholder={isPasswordSetMode ? t('auth', 'passwordMinLength', {}, '6文字以上のパスワードを入力') : ''}
                  style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                />
              </label>
            </Box>
            {isPasswordSetMode && (
              <Box sx={{ width: "100%", mb: 2 }}>
                <label style={{ width: "100%", display: "block" }}>
                  {t('auth', 'confirmPassword', {}, 'パスワード確認')}
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder={t('auth', 'reenterPassword', {}, 'パスワードを再入力してください')}
                    style={{ width: "100%", margin: "8px 0", padding: 12, fontSize: 16, boxSizing: "border-box" }}
                  />
                </label>
              </Box>
            )}
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
              {isPasswordSetMode ? t('auth', 'setPassword', {}, 'パスワードを設定') : t('auth', 'login', {}, 'ログイン')}
            </Button>
          </form>
          {/* パスワード設定モード時はメール登録・ソーシャルログインボタンを非表示 */}
          {!isPasswordSetMode && (
            <>
              {/* メールで登録ボタン */}
              {/* <Box sx={{ 
                mt: 1, 
                textAlign: "center", 
                width: "100%", 
                maxWidth: shouldUseFullWidth ? "100%" : 400 
              }}>
                <MailRegisterButton onClick={() => setShowEmailModal(true)} />
              </Box> */}
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
                <XLoginButton />
                <LineLoginButton />
                {/* <FacebookLoginButton /> */}
                {/* <TiktokLoginButton /> */}
              </Box>
            </>
          )}
          {/* メールアドレス入力用モーダル */}
          {/* <MailRegisterModal
            open={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            onSend={handleSendRegisterEmail}
            registerEmail={registerEmail}
            setRegisterEmail={setRegisterEmail}
            registerError={registerError}
            registerSuccess={registerSuccess}
          /> */}
        </Box>
      </Box>
      {!shouldUseFullWidth && <Footer />}
    </Box>
    </>
  );
};

export default LoginPage;
