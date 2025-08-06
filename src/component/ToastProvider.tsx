import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../recoil/darkModeAtom';
import { ToastState } from '../hooks/useToast';

interface ToastProviderProps {
    toast: ToastState;
    onClose: () => void;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ toast, onClose }) => {
    const isDarkMode = useRecoilValue(darkModeState);

    // 画面に固定された位置でトーストを表示
    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                width: 'auto',
                maxWidth: '90vw',
                pointerEvents: toast.open ? 'auto' : 'none'
            }}
        >
            <Snackbar
                open={toast.open}
                autoHideDuration={6000}
                onClose={onClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    transform: 'none',
                    width: '100%',
                    zIndex: 'inherit',
                    '& .MuiSnackbar-root': {
                        position: 'static',
                        transform: 'none'
                    },
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
        </div>
    );
};

export default ToastProvider;
