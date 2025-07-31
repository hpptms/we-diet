import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "../recoil/darkModeAtom";
import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      backgroundColor: isDarkMode ? "#000000" : "#f5f5f7" 
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        display: "flex", 
        width: "100%", 
        padding: "0",
        backgroundColor: isDarkMode ? "#000000" : "transparent"
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: "100vw",
          backgroundColor: isDarkMode ? "#000000" : "transparent"
        }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
