import React from "react";
import { MdEmail } from "react-icons/md";

type Props = {
  onClick: () => void;
};

const MailRegisterButton: React.FC<Props> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      width: "100%",
      padding: 10,
      background: "repeating-linear-gradient(135deg, #4dd0e1 0 20px, #b2ebf2 20px 40px)",
      color: "#fff",
      border: "1px rgba(0,0,0,0.4)",
      borderRadius: 4,
      fontWeight: 500,
      fontSize: 16,
      cursor: "pointer",
      marginTop: 0,
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    }}
  >
    <MdEmail size={22} style={{ marginRight: 4 }} />
    メールで登録
  </button>
);

export default MailRegisterButton;
