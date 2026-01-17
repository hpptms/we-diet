import React, { ReactNode } from 'react';
import { Box, Grid } from '@mui/material';
import { useResponsive } from '../../../hooks/useResponsive';

interface ResponsiveLayoutProps {
  isDarkMode: boolean;
  leftSidebar: ReactNode;
  mainContent: ReactNode;
  rightSidebar: ReactNode;
  mobileHeader: ReactNode;
  mobileBottomNav?: ReactNode;
  mobileLeftOverlay: ReactNode;
  mobileRightOverlay: ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  isDarkMode,
  leftSidebar,
  mainContent,
  rightSidebar,
  mobileHeader,
  mobileBottomNav,
  mobileLeftOverlay,
  mobileRightOverlay,
}) => {
  const { isTabletOrMobile, isSmallScreen } = useResponsive();
  // モバイル: 768px以下、タブレット: 768px～960px、デスクトップ: 960px以上
  const isMobile = isTabletOrMobile;
  const isTablet = isSmallScreen && !isTabletOrMobile; // 768px～900pxの間

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? '#000000'
        : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      py: 0,
      px: 0
    }}>
      <Box sx={{ maxWidth: '100vw', mx: 0 }}>
        {/* Mobile Overlays */}
        {mobileLeftOverlay}
        {mobileRightOverlay}

        <Grid container spacing={0} sx={{ width: '100%' }}>
          {/* Desktop Left Sidebar - lg以上で表示 */}
          <Grid item xs={0} sm={0} md={0} lg={2.5} xl={2.5} sx={{
            order: { xs: 1, lg: 1 },
            display: { xs: 'none', lg: 'block' }
          }}>
            {leftSidebar}
          </Grid>

          {/* Main Content - タブレットでは全幅、デスクトップでは中央 */}
          <Grid item xs={12} sm={12} md={12} lg={7} xl={7} sx={{ order: { xs: 1, lg: 2 } }}>
            <Box sx={{
              backgroundColor: isDarkMode ? '#000000' : 'white',
              minHeight: { xs: '100vh', md: '100vh' },
              borderLeft: { xs: 'none', lg: '1px solid white' },
              borderRight: { xs: 'none', lg: '1px solid white' },
              borderTop: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, lg: 'none' },
              borderBottom: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, lg: 'none' },
              boxShadow: { xs: 'none', lg: isDarkMode
                ? '0 4px 12px rgba(187, 134, 252, 0.15)'
                : '0 4px 12px rgba(66, 165, 245, 0.15)' },
              maxWidth: { xs: '100%', md: '800px', lg: '100%' },
              mx: { xs: 0, md: 'auto', lg: 0 },
              pb: { xs: 10, md: 4, lg: 0 }, // モバイルでは底部ナビ用に余白
              overflowY: { xs: 'auto', lg: 'visible' }
            }}>
              {/* Mobile/Tablet Header */}
              {isMobile && mobileHeader}

              {/* Main Content */}
              {mainContent}
            </Box>
          </Grid>

          {/* Desktop Right Sidebar - lg以上で表示 */}
          <Grid item xs={0} sm={0} md={0} lg={2.5} xl={2.5} sx={{
            order: { xs: 2, lg: 3 },
            display: { xs: 'none', lg: 'block' }
          }}>
            <Box
              position="sticky"
              top={0}
              sx={{
                maxHeight: '100vh',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(41, 182, 246, 0.5)',
                  borderRadius: '3px',
                  '&:hover': {
                    background: 'rgba(41, 182, 246, 0.7)',
                  },
                },
              }}
            >
              {rightSidebar}
            </Box>
          </Grid>

          {/* Mobile/Tablet Bottom Navigation - lg未満で表示 */}
          {mobileBottomNav && (
            <Grid item xs={12} sx={{
              display: { xs: 'block', lg: 'none' },
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              order: 3
            }}>
              {mobileBottomNav}
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ResponsiveLayout;
