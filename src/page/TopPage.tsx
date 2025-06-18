import React from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';

export const TopPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ナビゲーションバー */}
      <Header />

      <div style={{ flex: 1 }}>
        {/* ヒーローセクション */}
        <Box 
          sx={{
            backgroundColor: '#f5f5f7',
            py: 8,
            textAlign: 'center',
            minHeight: '50vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" gutterBottom>
              新時代の健康生活へ
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              健康的なダイエットとライフスタイルを手に入れる
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
            >
              詳しく見る
            </Button>
          </Container>
        </Box>

        {/* 製品詳細セクション */}
        <Container maxWidth="lg" sx={{ my: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                }}
                alt="Main Image"
                src="your-image-url.jpg" // ここに画像URLを追加
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                ダイエットサポート
              </Typography>
              <Typography variant="body1" paragraph>
                最先端の栄養学に基づいて開発された我々の製品は、あなたの健康的な体重維持をサポートします。
              </Typography>
              <Button size="large" variant="outlined" color="secondary">
                購入する
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* フッターセクション */}
      <Footer />
    </div>
  );
};
