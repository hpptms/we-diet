import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

interface SaveButtonsProps {
    loading: boolean;
    onSave: () => void;
    onBack?: () => void;
    saveButtonText?: string;
    backButtonText?: string;
}

const SaveButtons: React.FC<SaveButtonsProps> = ({
    loading,
    onSave,
    onBack,
    saveButtonText = '記録を保存',
    backButtonText = '戻る'
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
            {onBack && (
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                >
                    {backButtonText}
                </Button>
            )}
            <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={onSave}
                disabled={loading}
                sx={{ minWidth: 120 }}
            >
                {loading ? '保存中...' : saveButtonText}
            </Button>
        </Box>
    );
};

export default SaveButtons;
