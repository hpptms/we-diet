import React, { useEffect } from 'react';

interface AMPRedirectProps {
  ampPath: string;
}

const AMPRedirect: React.FC<AMPRedirectProps> = ({ ampPath }) => {
  useEffect(() => {
    // 開発環境と本番環境の両方でAMPページにリダイレクト
    window.location.href = ampPath;
  }, [ampPath]);

  // リダイレクト中の表示
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          marginBottom: '1rem',
          fontSize: '1.1rem',
          color: '#666'
        }}>
          ページを読み込み中...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e3f2fd',
          borderTop: '3px solid #29b6f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default AMPRedirect;
