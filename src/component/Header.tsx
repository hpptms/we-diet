import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header: React.FC = () => {
  // 青系ストライプ色を定義
  const stripes = ['#cceeff', '#b3e5fc', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da'];

  const stripeBackground = `repeating-linear-gradient(
    to right,
    ${stripes.map((color, i) => `${color} ${i * 14.2}% ${(i + 1) * 14.2}%`).join(', ')}
  )`;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: stripeBackground,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        color: '#000', // テキストを見やすく
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // ← しっかりめの影
        zIndex: 1100, // 重なり順を確保（任意）
        }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h2"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'Pacifico', 'Caveat', 'Lobster', 'Dancing Script', 'M PLUS 1p', sans-serif",
            maxWidth: 'fit-content',
            textShadow: `
              -2px -2px 0 #fff,
              2px -2px 0 #fff,
              -2px 2px 0 #fff,
              2px 2px 0 #fff,
              0px 2px 0 #fff,
              2px 0px 0 #fff,
              0px -2px 0 #fff,
              -2px 0px 0 #fff
            `,
          }}
        >
          We Diet
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
