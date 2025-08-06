import React, { ReactNode } from 'react';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
          {/* Desktop Left Sidebar */}
          <Grid item xs={0} sm={0} md={3} lg={3} xl={2.625} sx={{ 
            order: { xs: 1, md: 1 },
            display: { xs: 'none', md: 'block' }
          }}>
            {leftSidebar}
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6.75} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ 
              backgroundColor: isDarkMode ? '#000000' : 'white', 
              minHeight: { xs: '100vh', md: '100vh' },
              borderLeft: { xs: 'none', md: '1px solid white' },
              borderRight: { xs: 'none', md: '1px solid white' },
              borderTop: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              borderBottom: { xs: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`, md: 'none' },
              boxShadow: { xs: 'none', md: isDarkMode 
                ? '0 4px 12px rgba(187, 134, 252, 0.15)' 
                : '0 4px 12px rgba(66, 165, 245, 0.15)' },
              maxWidth: '100%',
              pb: { xs: 4, md: 0 },
              overflowY: { xs: 'auto', md: 'visible' }
            }}>
              {/* Mobile Header */}
              {isMobile && mobileHeader}
              
              {/* Main Content */}
              {mainContent}
            </Box>
          </Grid>

          {/* Desktop Right Sidebar */}
          <Grid item xs={0} sm={0} md={3} lg={3} xl={2.625} sx={{ 
            order: { xs: 2, md: 3 },
            display: { xs: 'none', md: 'block' }
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

          {/* Mobile Bottom Navigation */}
          {mobileBottomNav && (
            <Grid item xs={12} sx={{ 
              display: { xs: 'block', md: 'none' },
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
