import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { useResponsive } from '../../hooks/useResponsive';

interface SaveButtonsProps {
    loading: boolean;
    onSave: () => void;
    onBack: () => void;
}

const SaveButtons: React.FC<SaveButtonsProps> = ({
    loading,
    onSave,
    onBack,
}) => {
    const { isMobile, isTablet } = useResponsive();

    return (
        <Box sx={{
            textAlign: 'center',
            mt: 4,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: isMobile ? 1.5 : 2,
            px: isMobile ? 1 : 0
        }}>
            <Button
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                onClick={onSave}
                disabled={loading}
                sx={{
                    px: isMobile ? 2 : 4,
                    py: isMobile ? 1.2 : 1.5,
                    fontSize: isMobile ? '0.9rem' : isTablet ? '1rem' : '1.1rem',
                    borderRadius: 2,
                    minWidth: isMobile ? 'auto' : 140,
                    whiteSpace: 'nowrap',
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : 'none'
                }}
            >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'プロフィールを保存'}
            </Button>
            <Button
                variant="outlined"
                size={isMobile ? 'medium' : 'large'}
                onClick={onBack}
                sx={{
                    px: isMobile ? 2 : 4,
                    py: isMobile ? 1.2 : 1.5,
                    fontSize: isMobile ? '0.9rem' : isTablet ? '1rem' : '1.1rem',
                    borderRadius: 2,
                    minWidth: isMobile ? 'auto' : 100,
                    whiteSpace: 'nowrap',
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '100%' : 'none'
                }}
            >
                戻る
            </Button>
        </Box>
    );
};

export default SaveButtons;
