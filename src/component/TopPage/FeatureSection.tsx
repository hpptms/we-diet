import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useScreenOrientation } from './useScreenOrientation';

interface FeatureItem {
  image: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    image: 'https://res.cloudinary.com/drmyhhtjo/image/upload/v1753595013/yoga_ytxrh6.webp',
    title: 'エクササイズ',
    description: '今日は何キロ歩きましたか？距離を自慢しちゃいましょう'
  },
  {
    image: 'https://res.cloudinary.com/drmyhhtjo/image/upload/v1753595013/pizza_fhzq0m.webp',
    title: '爆食い',
    description: '今日はチートデイ！あなたの爆食いで飯テロしましょう'
  },
  {
    image: 'https://res.cloudinary.com/drmyhhtjo/image/upload/v1753595013/sns_titjmz.webp',
    title: 'SNS連携',
    description: 'あなたの健康記録をSNSで共有して、誰かと共有する、そんな場所です。'
  }
];

export const FeatureSection: React.FC = () => {
  const { isPortraitDesktop } = useScreenOrientation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // セクションごとのグラデーション色
  const sectionColors = [
    'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)', // 明るい水色
    'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)', // 中間の青
    'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'  // 濃い青
  ];

  return (
    <Box component="section" sx={{ position: 'relative' }}>
      {features.map((feature, index) => (
        <Box key={index}>
          <Box
            sx={{
              background: sectionColors[index],
              py: { xs: 1.5, md: 3 },
              px: { xs: 1.5, md: 3 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box
              sx={{
                maxWidth: '1200px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: isMobile ? 'column' : (index % 2 === 0 ? 'row' : 'row-reverse'),
                  gap: { xs: 2, md: 4 },
                  opacity: 0,
                  transform: 'translateY(50px)',
                  animation: `fadeInUp 0.8s ease-out ${index * 0.3}s forwards`,
                  '@keyframes fadeInUp': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(50px)'
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)'
                    }
                  }
                }}
              >
                <Box
                  sx={{
                    flex: isMobile ? '0 0 auto' : '0 0 200px',
                    position: 'relative',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                >
                  <Box
                    component="img"
                    src={feature.image}
                    alt={feature.title}
                    sx={{
                      width: '100%',
                      height: { xs: '120px', md: '150px' },
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 5px 15px rgba(255, 107, 107, 0.3)',
                      fontSize: '16px',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    {index === 0 ? '🏃' : index === 1 ? '🍕' : '📱'}
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    flex: 1,
                    textAlign: isMobile ? 'center' : 'left',
                    color: 'white',
                    px: { xs: 2, md: 4 }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{
                      fontSize: isPortraitDesktop ? {
                        xs: '1.6rem',
                        sm: '1.8rem',
                        md: '2rem',
                        lg: '1.8rem'
                      } : {
                        xs: '1.7rem',
                        sm: '1.9rem',
                        md: '2.2rem',
                        lg: '2rem'
                      },
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                      mb: 1.5,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -4,
                        left: isMobile ? '50%' : 0,
                        transform: isMobile ? 'translateX(-50%)' : 'none',
                        width: '40px',
                        height: '3px',
                        background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                        borderRadius: '2px'
                      }
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      fontSize: isPortraitDesktop ? {
                        xs: '1.15rem',
                        sm: '1.2rem',
                        md: '1.25rem',
                      } : {
                        xs: '1.2rem',
                        sm: '1.25rem',
                        md: '1.3rem',
                      },
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      maxWidth: '450px',
                      margin: isMobile ? '0 auto' : '0'
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* 装飾的な背景要素 */}
            <Box
              sx={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '15%',
                right: '8%',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse'
              }}
            />
          </Box>
          
          {/* ギザギザの境界線 */}
          {index < features.length - 1 && (
            <Box
              sx={{
                height: '30px',
                background: sectionColors[index],
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '30px',
                  background: sectionColors[index + 1],
                  clipPath: 'polygon(0 100%, 5% 80%, 10% 100%, 15% 85%, 20% 100%, 25% 75%, 30% 100%, 35% 90%, 40% 100%, 45% 70%, 50% 100%, 55% 85%, 60% 100%, 65% 80%, 70% 100%, 75% 90%, 80% 100%, 85% 75%, 90% 100%, 95% 85%, 100% 100%, 100% 0, 0 0)',
                  zIndex: 1
                }
              }}
            />
          )}
        </Box>
      ))}
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
};
