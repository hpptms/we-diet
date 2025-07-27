import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useScreenOrientation } from './useScreenOrientation';

export const ProductSection: React.FC = () => {
  const { isPortraitDesktop } = useScreenOrientation();
  
  return (
    <Container maxWidth="lg" sx={{ 
      my: isPortraitDesktop ? { xs: 1, sm: 2, md: 3 } : { xs: 2, sm: 3, md: 4 }
    }}>
      <Grid container spacing={{ xs: 3, sm: 4 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: { xs: 2, md: 0 },
            }}
          >
            <Box
              component="img"
              sx={{
                width: isPortraitDesktop ? {
                  xs: '50%',  // 縦画面では小さく
                  sm: '40%',
                  md: '80%'  // 縦画面でも横並びを維持
                } : { 
                  xs: '60%',  // 通常画面を縮小
                  sm: '50%',
                  md: '80%'
                },
                maxWidth: isPortraitDesktop ? '150px' : '200px',
                height: 'auto',
                borderRadius: 2,
              }}
              alt="SNS"
              src="https://res.cloudinary.com/drmyhhtjo/image/upload/v1750312461/SNS_brbmkp.webp"
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontSize: isPortraitDesktop ? {
                xs: '1.2rem',  // 縦画面では小さく
                sm: '1.4rem',
                md: '1.6rem',
                lg: '1.4rem'
              } : {
                xs: '1.3rem',  // 通常画面も縮小
                sm: '1.5rem',
                md: '1.8rem',
                lg: '1.6rem'
              },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            ダイエットサポート
          </Typography>
          <Typography 
            variant="body1" 
            paragraph
            sx={{
              fontSize: isPortraitDesktop ? {
                xs: '0.8rem',
                sm: '0.9rem',
                md: '0.85rem',
              } : {
                xs: '0.8rem',
                sm: '0.85rem',
                md: '0.9rem',
              },
              lineHeight: 1.5,
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 2, md: 0 },
            }}
          >
            運動の記録、健康、食べ物を中心にしたSNS型アプリです。
            現在開発中です。たまたま見つけた方、もう少々お待ちください😂
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
