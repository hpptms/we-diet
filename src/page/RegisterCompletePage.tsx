import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterCompletePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ここで本来はメールアドレスの有効性検証APIを呼ぶ
    // 仮実装: 2秒後にダッシュボードへ遷移
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2>登録が完了しました</h2>
      <p>ダッシュボードへリダイレクトします...</p>
    </div>
  );
};

export default RegisterCompletePage;
