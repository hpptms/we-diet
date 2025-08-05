import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './VerifyEmailPage.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [loginInfo, setLoginInfo] = useState<{email: string, password: string, username: string} | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('認証トークンが見つかりません。');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://we-diet-backend.com'}/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'メール認証が完了しました！');
        
        // ログイン情報を設定
        if (data.email && data.temp_password && data.username) {
          setLoginInfo({
            email: data.email,
            password: data.temp_password,
            username: data.username
          });
          
          // ログイン情報をlocalStorageに保存（プロフィール設定で使用）
          localStorage.setItem("accountName", data.email);
          localStorage.setItem("user_id", String(data.user_id || data.userId || ""));
        }
      } else {
        setStatus('error');
        setMessage(data.error || 'メール認証に失敗しました。');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      setStatus('error');
      setMessage('ネットワークエラーが発生しました。');
    }
  };

  const handleReturnToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        {status === 'loading' && (
          <div className="verify-status loading">
            <div className="spinner"></div>
            <h2>メール認証を確認中...</h2>
            <p>しばらくお待ちください</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-status success">
            <div className="success-icon">🎉</div>
            <h2>登録完了おめでとうございます！</h2>
            <p>{message}</p>
            
            {loginInfo && (
              <div className="login-info-display">
                <h3>🔐 ログイン情報</h3>
                <p className="welcome-message">
                  {loginInfo.username}さん、We-Dietへようこそ！🌟
                </p>
                <div className="login-credentials">
                  <div className="credential-item">
                    <label>メールアドレス</label>
                    <div className="credential-value">{loginInfo.email}</div>
                  </div>
                  <div className="credential-item">
                    <label>仮パスワード</label>
                    <div className="credential-value password-value">{loginInfo.password}</div>
                  </div>
                </div>
                <div className="password-warning">
                  🔒 <strong>重要</strong>：プロフィール変更でパスワードを必ず変更してください。
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              <button 
                onClick={() => {
                  // プロフィール設定ページに直接遷移（user_idは既に保存済み）
                  navigate('/dashboard/profile-settings');
                }}
                className="btn btn-primary login-btn"
              >
                プロフィール設定へ移動
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-status error">
            <div className="error-icon">✗</div>
            <h2>認証に失敗しました</h2>
            <p>{message}</p>
            <div className="error-actions">
              <button 
                onClick={handleReturnToLogin}
                className="btn btn-primary"
              >
                ログインページに戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
