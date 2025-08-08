import React, { useState, useEffect } from "react";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../recoil/darkModeAtom';
import { useTranslation } from '../hooks/useTranslation';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter' | 'debug';

interface DashboardPageButtonsProps {
  onViewChange: (view: CurrentView) => void;
  hasWeightInput?: boolean;
  showInstallButton?: boolean;
  onInstallClick?: () => void;
  isAdmin?: boolean;
  adminLoading?: boolean;
}

const DashboardPageButtons: React.FC<DashboardPageButtonsProps> = ({ onViewChange, hasWeightInput, showInstallButton, onInstallClick, isAdmin, adminLoading }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 768;
  const isTabletOrMobile = windowWidth <= 900;
  const isPortraitMode = window.matchMedia('(orientation: portrait)').matches;
  const shouldUseFullWidth = isTabletOrMobile || isPortraitMode;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: shouldUseFullWidth ? "15px" : "20px",
      marginBottom: shouldUseFullWidth ? "20px" : "30px",
      marginTop: shouldUseFullWidth ? "20px" : "40px",
      width: "100%",
      maxWidth: shouldUseFullWidth ? "100%" : "400px",
      margin: shouldUseFullWidth ? "20px 0" : "40px auto 30px auto",
      backgroundColor: isDarkMode ? "#000000" : "white",
      padding: shouldUseFullWidth ? "15px" : "30px",
      borderRadius: shouldUseFullWidth ? "0" : "12px",
      boxShadow: shouldUseFullWidth ? "none" : "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)",
      border: shouldUseFullWidth ? "none" : isDarkMode ? "2px solid #ffffff" : "1px solid rgba(0, 0, 0, 0.05)",
      boxSizing: "border-box",
      minHeight: shouldUseFullWidth ? "auto" : "auto",
    }}>
      <button
        style={{
          padding: "20px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          background: isDarkMode ? "#000000" : "linear-gradient(135deg, #4CAF50, #45a049, #2E7D32)",
          color: "white",
          border: isDarkMode ? "2px solid #ffffff" : "none",
          borderRadius: "15px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
        }}
        onMouseOver={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(76, 175, 80, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "linear-gradient(135deg, #66BB6A, #4CAF50, #43A047)";
          }
        }}
        onMouseOut={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "linear-gradient(135deg, #4CAF50, #45a049, #2E7D32)";
          }
        }}
        onFocus={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onBlur={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onClick={() => {
          // console.log("プロフィール変更がクリックされました");
          onViewChange('profile');
        }}
      >
        👤 {t('profile', 'editProfile')}
      </button>
      
      <button
        style={{
          padding: "20px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          background: isDarkMode ? "#000000" : "linear-gradient(135deg, #2196F3, #1976D2, #0D47A1)",
          color: "white",
          border: isDarkMode ? "2px solid #ffffff" : "none",
          borderRadius: "15px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 20px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
        }}
        onMouseOver={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(33, 150, 243, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "linear-gradient(135deg, #42A5F5, #2196F3, #1976D2)";
          }
        }}
        onMouseOut={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "linear-gradient(135deg, #2196F3, #1976D2, #0D47A1)";
          }
        }}
        onFocus={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onBlur={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onClick={() => {
          // console.log("運動を記録がクリックされました");
          onViewChange('exercise');
        }}
      >
        {hasWeightInput ? (() => {
          const icons = [
            "💪", "🏃", "🚴", "🏊", "⚽", "🏀", "🎾", "🏓", "🏸", "🥊",
            "🤸", "🧘", "🤾", "🏋️", "🤺", "🏇", "⛷️", "🏂", "🤸‍♀️", "🧗"
          ];
          const icon = icons[Math.floor(Math.random() * icons.length)];
          return `✨ ${t('exercise', 'recordExercise')} ${icon}`;
        })() : `💪 ${t('exercise', 'recordExercise')}`}
      </button>
      
      <button
        style={{
          padding: "20px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          background: isDarkMode ? "#000000" : "linear-gradient(135deg, #FF9800, #F57C00, #E65100)",
          color: "white",
          border: isDarkMode ? "2px solid #ffffff" : "none",
          borderRadius: "15px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 20px rgba(255, 152, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
        }}
        onMouseOver={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 152, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "linear-gradient(135deg, #FFB74D, #FF9800, #F57C00)";
          }
        }}
        onMouseOut={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 152, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "linear-gradient(135deg, #FF9800, #F57C00, #E65100)";
          }
        }}
        onFocus={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onBlur={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onClick={() => {
          // console.log("体重を管理がクリックされました");
          onViewChange('weight');
        }}
      >
        ⚖️ {t('weight', 'weight')}
      </button>
      
      <button
        style={{
          padding: "20px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          background: isDarkMode ? "#000000" : "linear-gradient(135deg, #9C27B0, #7B1FA2, #4A148C)",
          color: "white",
          border: isDarkMode ? "2px solid #ffffff" : "none",
          borderRadius: "15px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 20px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
        }}
        onMouseOver={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(156, 39, 176, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "linear-gradient(135deg, #BA68C8, #9C27B0, #7B1FA2)";
          }
        }}
        onMouseOut={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(156, 39, 176, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "linear-gradient(135deg, #9C27B0, #7B1FA2, #4A148C)";
          }
        }}
        onFocus={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onBlur={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onClick={() => {
          // console.log("食事を記録がクリックされました");
          onViewChange('FoodLog');
        }}
      >
        🍽️ {t('food', 'recordMeal')}
      </button>
      
      <button
        style={{
          padding: "20px 25px",
          fontSize: "18px",
          fontWeight: "bold",
          background: isDarkMode ? "#000000" : "linear-gradient(135deg, #607D8B, #455A64, #263238)",
          color: "white",
          border: isDarkMode ? "2px solid #ffffff" : "none",
          borderRadius: "15px",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 6px 20px rgba(96, 125, 139, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
          position: "relative",
          overflow: "hidden",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
          transform: "translateY(0)",
        }}
        onMouseOver={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(96, 125, 139, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
            e.currentTarget.style.background = "linear-gradient(135deg, #78909C, #607D8B, #455A64)";
          }
        }}
        onMouseOut={(e) => {
          if (!isDarkMode) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(96, 125, 139, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "linear-gradient(135deg, #607D8B, #455A64, #263238)";
          }
        }}
        onFocus={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onBlur={(e) => {
          if (isDarkMode) {
            e.currentTarget.style.background = "#000000";
            e.currentTarget.style.border = "2px solid #ffffff";
            e.currentTarget.style.color = "white";
          }
        }}
        onClick={() => {
          // console.log("dieterがクリックされました");
          onViewChange('dieter');
        }}
      >
        💬 dieter
      </button>
      
      {/* 管理者専用デバッグボタン */}
      {!adminLoading && isAdmin && (
        <button
          style={{
            padding: "20px 25px",
            fontSize: "18px",
            fontWeight: "bold",
            background: isDarkMode ? "#000000" : "linear-gradient(135deg, #FF5722, #E64A19, #BF360C)",
            color: "white",
            border: isDarkMode ? "2px solid #ffffff" : "none",
            borderRadius: "15px",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 6px 20px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            position: "relative",
            overflow: "hidden",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            transform: "translateY(0)",
          }}
          onMouseOver={(e) => {
            if (!isDarkMode) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(255, 87, 34, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, #FF7043, #FF5722, #E64A19)";
            }
          }}
          onMouseOut={(e) => {
            if (!isDarkMode) {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 87, 34, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "linear-gradient(135deg, #FF5722, #E64A19, #BF360C)";
            }
          }}
          onFocus={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.background = "#000000";
              e.currentTarget.style.border = "2px solid #ffffff";
              e.currentTarget.style.color = "white";
            }
          }}
          onBlur={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.background = "#000000";
              e.currentTarget.style.border = "2px solid #ffffff";
              e.currentTarget.style.color = "white";
            }
          }}
          onClick={() => {
            console.log("管理者デバッグページがクリックされました");
            onViewChange('debug');
          }}
        >
          🔧 デバッグ
        </button>
      )}

      {/* PWAインストールボタン */}
      {showInstallButton && (
        <button
          style={{
            padding: "20px 25px",
            fontSize: "18px",
            fontWeight: "bold",
            background: isDarkMode ? "#000000" : "linear-gradient(135deg, #E91E63, #C2185B, #880E4F)",
            color: "white",
            border: isDarkMode ? "2px solid #ffffff" : "none",
            borderRadius: "15px",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 6px 20px rgba(233, 30, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            position: "relative",
            overflow: "hidden",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            transform: "translateY(0)",
          }}
          onMouseOver={(e) => {
            if (!isDarkMode) {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(233, 30, 99, 0.6), inset 0 1px 0 rgba(255,255,255,0.3)";
              e.currentTarget.style.background = "linear-gradient(135deg, #F06292, #E91E63, #C2185B)";
            }
          }}
          onMouseOut={(e) => {
            if (!isDarkMode) {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(233, 30, 99, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "linear-gradient(135deg, #E91E63, #C2185B, #880E4F)";
            }
          }}
          onFocus={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.background = "#000000";
              e.currentTarget.style.border = "2px solid #ffffff";
              e.currentTarget.style.color = "white";
            }
          }}
          onBlur={(e) => {
            if (isDarkMode) {
              e.currentTarget.style.background = "#000000";
              e.currentTarget.style.border = "2px solid #ffffff";
              e.currentTarget.style.color = "white";
            }
          }}
          onClick={onInstallClick}
        >
          🏠✨ ホームに追加
        </button>
      )}
    </div>
  );
};

export default DashboardPageButtons;
