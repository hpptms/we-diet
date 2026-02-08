import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";
import Footer from "../component/Footer";
import { SEOHelmet } from "../component/SEOHelmet";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { MdPersonAdd, MdLogin } from "react-icons/md";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { serverProfileState, profileSettingsState, convertServerProfileToLocalProfile } from "../recoil/profileSettingsAtom";
import { useTranslation } from "../hooks/useTranslation";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userNameStatus, setUserNameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const navigate = useNavigate();
  const setServerProfile = useSetRecoilState(serverProfileState);
  const setProfileSettings = useSetRecoilState(profileSettingsState);

  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isPortraitMode = useMediaQuery('(orientation: portrait)');
  const isSmallScreen = useMediaQuery('(max-width: 900px)');
  const shouldUseFullWidth = isTabletOrMobile || isPortraitMode || isSmallScreen;

  useEffect(() => {
    if (localStorage.getItem("accountName")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  // ユーザー名の重複チェック（デバウンス付き）
  const checkUserName = useCallback(async (name: string) => {
    if (name.length < 3) {
      setUserNameStatus("idle");
      return;
    }
    setUserNameStatus("checking");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/check-username`,
        { params: { userName: name } }
      );
      setUserNameStatus(response.data.available ? "available" : "taken");
    } catch {
      setUserNameStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (userName.length < 3) {
      setUserNameStatus("idle");
      return;
    }
    const timer = setTimeout(() => {
      checkUserName(userName);
    }, 500);
    return () => clearTimeout(timer);
  }, [userName, checkUserName]);

  const fetchUserProfileAfterLogin = async (userId: number) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/proto/user_profile/${userId}`);
      if (response.data && response.data.profile) {
        const profile = response.data.profile;
        const now = Date.now();
        setServerProfile({ userId, profile, lastFetched: now });
        const currentLocalData = localStorage.getItem('profileSettingsData');
        if (!currentLocalData) {
          const localProfile = convertServerProfileToLocalProfile(profile);
          setProfileSettings(localProfile);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // 初回登録時はプロフィール未作成なので無視
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (userName.length < 3) {
      setError(t('auth', 'userNameMinLength', {}, 'ユーザー名は3文字以上である必要があります'));
      return;
    }

    if (userName.length > 30) {
      setError(t('auth', 'userNameMaxLength', {}, 'ユーザー名は30文字以下である必要があります'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth', 'passwordTooShort', {}, 'パスワードは6文字以上である必要があります'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth', 'passwordMismatch', {}, 'パスワードが一致しません'));
      return;
    }

    if (userNameStatus === "taken") {
      setError(t('auth', 'userNameTaken', {}, 'このユーザー名は既に使用されています'));
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/register`,
        {
          userName: userName,
          password: password,
        }
      );

      const data = response.data;
      localStorage.setItem("accountName", data.accountName || userName);
      localStorage.setItem("user_id", String(data.userId));

      if (data.token) {
        localStorage.setItem("jwt_token", data.token);
      }

      await fetchUserProfileAfterLogin(data.userId);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('auth', 'registrationFailed', {}, '登録に失敗しました'));
      }
    }
  };

  const getUserNameStatusColor = () => {
    switch (userNameStatus) {
      case "available": return "#4caf50";
      case "taken": return "#f44336";
      default: return "#999";
    }
  };

  const getUserNameStatusText = () => {
    switch (userNameStatus) {
      case "checking": return t('auth', 'checkingUserName', {}, '確認中...');
      case "available": return t('auth', 'userNameAvailable', {}, 'このユーザー名は使用可能です');
      case "taken": return t('auth', 'userNameTaken', {}, 'このユーザー名は既に使用されています');
      default: return "";
    }
  };

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

  const cardStyles = {
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
        title={`${t('auth', 'newRegistration', {}, '新規登録')} | We Diet`}
        description="We Dietに新規登録"
        keywords="新規登録,We Diet"
        canonicalUrl="https://we-diet.net/register"
        noindex={true}
      />
      <Box sx={containerStyles}>
        {!shouldUseFullWidth && <Header />}
        <Box sx={mainBoxStyles}>
          <Box sx={cardStyles}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: shouldUseFullWidth ? 3 : 2,
                fontSize: shouldUseFullWidth ? { xs: '1.75rem', sm: '2rem' } : '2rem',
                textAlign: 'center',
              }}
            >
              {t('auth', 'newRegistration', {}, '新規登録')}
            </Typography>

            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                maxWidth: shouldUseFullWidth ? "100%" : 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* ユーザー名 */}
              <Box sx={{ width: "100%", mb: 2 }}>
                <label style={{ width: "100%", display: "block" }}>
                  {t('auth', 'userName', {}, 'ユーザー名')}
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder={t('auth', 'enterUserName', {}, 'ユーザー名を入力してください')}
                    style={{
                      width: "100%",
                      margin: "8px 0 4px 0",
                      padding: 12,
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
                  />
                </label>
                {userNameStatus !== "idle" && (
                  <Typography
                    variant="body2"
                    sx={{ color: getUserNameStatusColor(), fontSize: '0.85rem', mt: 0.5 }}
                  >
                    {getUserNameStatusText()}
                  </Typography>
                )}
              </Box>

              {/* パスワード */}
              <Box sx={{ width: "100%", mb: 2 }}>
                <label style={{ width: "100%", display: "block" }}>
                  {t('auth', 'password', {}, 'パスワード')}
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder={t('auth', 'passwordMinLength', {}, '6文字以上のパスワードを入力')}
                    style={{
                      width: "100%",
                      margin: "8px 0",
                      padding: 12,
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
                  />
                </label>
              </Box>

              {/* パスワード確認 */}
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
                    style={{
                      width: "100%",
                      margin: "8px 0",
                      padding: 12,
                      fontSize: 16,
                      boxSizing: "border-box",
                    }}
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
                startIcon={<MdPersonAdd size={22} />}
                sx={{ py: 1.5, fontWeight: 500, fontSize: 16, borderRadius: 1, mt: 1 }}
              >
                {t('auth', 'registerNewAccount', {}, '新規登録する')}
              </Button>
            </form>

            {/* ログインへ戻るリンク */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {t('auth', 'alreadyHaveAccount', {}, 'すでにアカウントをお持ちですか？')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<MdLogin size={20} />}
                onClick={() => navigate("/login")}
                sx={{ borderRadius: 1 }}
              >
                {t('auth', 'login', {}, 'ログイン')}
              </Button>
            </Box>
          </Box>
        </Box>
        {!shouldUseFullWidth && <Footer />}
      </Box>
    </>
  );
};

export default RegisterPage;
