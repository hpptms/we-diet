import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  // Header と同じストライプ配色
  const stripes = ['#cceeff', '#b3e5fc', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da'];

  const stripeBackground = `repeating-linear-gradient(
    to right,
    ${stripes.map((color, i) => `${color} ${i * 14.2}% ${(i + 1) * 14.2}%`).join(', ')}
  )`;

  return (
    <Box
      component="footer"
      sx={{
        backgroundImage: stripeBackground,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        color: '#000',        // 読みやすい文字色に
        py: 4,
        textAlign: 'center',
        boxShadow: '0 -6px 12px rgba(0, 0, 0, 0.3)', // ← 上方向の影
        zIndex: 1100, // 重なり順を確保（任意）
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} WeDiet. All&nbsp;Rights&nbsp;Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;