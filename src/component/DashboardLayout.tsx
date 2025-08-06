import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../recoil/darkModeAtom";
import { useTheme, useMediaQuery } from '@mui/material';
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: isDarkMode ? "#000000" : "#ffffff", // より明確な白背景
      width: "100%",
      maxWidth: "100vw"
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        display: "flex", 
        width: "100%", 
        padding: "0",
        backgroundColor: isDarkMode ? "#000000" : "#ffffff" // 白背景で統一
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "100vw",
          backgroundColor: isDarkMode ? "#000000" : "#ffffff", // 透明ではなく明確な色指定
          minHeight: "100%", // 最小高さを確保
          position: "relative", // ポジション制御
          boxSizing: "border-box" // ボックスサイジング明確化
        }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
