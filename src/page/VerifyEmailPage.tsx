import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './VerifyEmailPage.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'メール認証が完了しました！');
        
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
            <div className="success-icon">✓</div>
            <h2>認証完了！</h2>
            <p>{message}</p>
            <p className="redirect-message">3秒後にログインページに移動します...</p>
            <button 
              onClick={handleReturnToLogin}
              className="btn btn-primary"
            >
              今すぐログインページへ
            </button>
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
