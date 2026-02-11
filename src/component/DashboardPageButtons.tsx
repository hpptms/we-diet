import React, { useState, useEffect, useRef } from "react";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../recoil/darkModeAtom';
import { useTranslation } from '../hooks/useTranslation';
import { openExternalUrl, isNativePlatform } from '../utils/platform';
import './DashboardPageButtons.css';

type CurrentView = 'dashboard' | 'profile' | 'exercise' | 'weight' | 'FoodLog' | 'dieter' | 'debug';

interface DashboardPageButtonsProps {
  onViewChange: (view: CurrentView) => void;
  hasWeightInput?: boolean;
  showInstallButton?: boolean;
  onInstallClick?: () => void;
  isAdmin?: boolean;
  adminLoading?: boolean;
}

const DashboardPageButtons: React.FC<DashboardPageButtonsProps> = ({ onViewChange, hasWeightInput, isAdmin, adminLoading }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

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
  const isPC = windowWidth > 900 && !isPortraitMode;

  return (
    <div ref={containerRef} style={{
      display: isPC ? "grid" : "flex",
      gridTemplateColumns: isPC ? "repeat(3, 1fr)" : undefined,
      flexDirection: "column",
      gap: shouldUseFullWidth ? "15px" : "20px",
      marginBottom: shouldUseFullWidth ? "20px" : "30px",
      marginTop: shouldUseFullWidth ? "20px" : "40px",
      width: "100%",
      maxWidth: shouldUseFullWidth ? "100%" : "800px",
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
        className={`dashboard-button-base button-profile ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
          onViewChange('profile');
        }}
      >
        👤 {t('profile', 'editProfile')}
      </button>
      
      <button
        className={`dashboard-button-base button-exercise ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
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
        className={`dashboard-button-base button-weight ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
          onViewChange('weight');
        }}
      >
        ⚖️ {t('weight', 'weight')}
      </button>
      
      <button
        className={`dashboard-button-base button-foodlog ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
          onViewChange('FoodLog');
        }}
      >
        🍽️ {t('food', 'recordMeal')}
      </button>
      
      <button
        className={`dashboard-button-base button-dieter ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
          onViewChange('dieter');
        }}
      >
        💬 dieter
      </button>

      <button
        className={`dashboard-button-base button-blog ${isDarkMode ? 'dark-mode' : ''}`}
        onClick={() => {
          if (isNativePlatform()) {
            openExternalUrl('https://we-diet.net/blog/index.html');
          } else {
            window.location.href = '/blog/index.html';
          }
        }}
      >
        📝 {t('dashboard', 'blog', {}, 'ブログ')}
      </button>

      {/* 管理者専用デバッグボタン */}
      {!adminLoading && isAdmin && (
        <button
          className={`dashboard-button-base button-debug ${isDarkMode ? 'dark-mode' : ''}`}
          onClick={() => {
            console.log("管理者デバッグページがクリックされました");
            onViewChange('debug');
          }}
        >
          🔧 {t('dashboard', 'debug', {}, 'デバッグ')}
        </button>
      )}

    </div>
  );
};

export default DashboardPageButtons;
