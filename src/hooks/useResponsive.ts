import { useTheme, useMediaQuery } from '@mui/material';

/**
 * レスポンシブデザイン用の共通フック
 * 各コンポーネントで使用されているブレークポイントロジックを統一
 */
export const useResponsive = () => {
    const theme = useTheme();

    // 基本的なブレークポイント
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px以下
    const isTablet = useMediaQuery(theme.breakpoints.down('md')); // 768px以下
    const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')); // 768px以下
    const isSmallScreen = useMediaQuery('(max-width: 900px)'); // 900px以下
    const isPortraitMode = useMediaQuery('(orientation: portrait)');

    // よく使用される複合条件
    const shouldUseFullWidth = isTabletOrMobile || isPortraitMode || isSmallScreen;

    return {
        theme,
        isMobile,
        isTablet,
        isTabletOrMobile,
        isSmallScreen,
        isPortraitMode,
        shouldUseFullWidth,
    };
};

/**
 * ボタンサイズ用の共通フック
 * CommonButtons等で使用されるボタンのサイズロジックを統一
 */
export const useButtonSize = () => {
    const { isMobile } = useResponsive();

    return {
        size: isMobile ? 'medium' : 'large' as 'small' | 'medium' | 'large',
        minWidth: isMobile ? 40 : 60,
        padding: isMobile ? 1 : 2.5,
        fontSize: isMobile ? '0.75rem' : '1rem',
        height: 40,
    };
};

/**
 * 共通のグラデーションボタンスタイルを生成
 */
export const createGradientButtonStyle = (
    colors: [string, string],
    isDarkMode: boolean = false
) => {
    const { isMobile } = useResponsive();

    return {
        minWidth: isMobile ? 40 : 60,
        px: isMobile ? 0.8 : 2.5,
        py: 0.5,
        fontWeight: 'bold',
        fontSize: isMobile ? '0.75rem' : '1rem',
        borderRadius: 3,
        background: isDarkMode ? '#000000' : `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
        color: '#fff',
        border: isDarkMode ? '1px solid white' : 'none',
        boxShadow: isDarkMode ? 'none' : `0 2px 8px 0 ${colors[0]}10`,
        transition: 'transform 0.1s, box-shadow 0.1s',
        height: 40,
        whiteSpace: 'nowrap',
        '&:hover': {
            background: isDarkMode
                ? 'rgba(255, 255, 255, 0.1)'
                : `linear-gradient(90deg, ${colors[1]} 0%, ${colors[0]} 100%)`,
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : `0 4px 16px 0 ${colors[0]}18`,
        },
    };
};
