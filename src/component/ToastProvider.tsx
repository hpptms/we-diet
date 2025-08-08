import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../recoil/darkModeAtom';
import { ToastState } from '../hooks/useToast';

interface ToastProviderProps {
    toast: ToastState;
    onClose: () => void;
    position?: 'center' | 'bottom' | 'top';
}

const ToastProvider: React.FC<ToastProviderProps> = ({ toast, onClose, position = 'center' }) => {
    const isDarkMode = useRecoilValue(darkModeState);

    // 位置に応じてスタイルを調整
    const getPositionStyles = () => {
        switch (position) {
            case 'bottom':
                return {
                    position: 'fixed' as const,
                    bottom: '120px', // 保存・戻るボタンの上に表示
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10000,
                    width: 'auto',
                    maxWidth: '90vw',
                };
            case 'top':
                return {
                    position: 'fixed' as const,
                    top: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10000,
                    width: 'auto',
                    maxWidth: '90vw',
                };
            default: // center
                return {
                    position: 'fixed' as const,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10000,
                    width: 'auto',
                    maxWidth: '90vw',
                };
        }
    };

    return (
        <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                ...getPositionStyles(),
                '& .MuiSnackbarContent-root': {
                    minWidth: '300px',
                    maxWidth: '90vw'
                }
            }}
        >
                <Alert 
                    onClose={onClose} 
                    severity={toast.severity}
                    variant="filled"
                    sx={{
                        fontSize: '14px',
                        fontWeight: 'normal',
                        minWidth: '300px',
                        maxWidth: '90vw',
                        wordBreak: 'break-word',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        backgroundColor: isDarkMode ? (
                            toast.severity === 'success' ? '#2e7d32' :
                            toast.severity === 'info' ? '#1976d2' :
                            toast.severity === 'warning' ? '#ed6c02' : '#d32f2f'
                        ) : (
                            toast.severity === 'success' ? '#4caf50' :
                            toast.severity === 'info' ? '#2196f3' :
                            toast.severity === 'warning' ? '#ff9800' : '#f44336'
                        )
                    }}
                >
                    {toast.message}
                </Alert>
        </Snackbar>
    );
};

export default ToastProvider;
