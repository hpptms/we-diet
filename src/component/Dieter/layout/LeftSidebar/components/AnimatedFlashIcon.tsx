import React from 'react';
import { styled } from '@mui/material';
import { FlashOn } from '@mui/icons-material';

// アニメーション付きFlashOnアイコン
export const AnimatedFlashOn = styled(FlashOn)`
    @keyframes pulse {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    animation: pulse 1.5s infinite;
`;
