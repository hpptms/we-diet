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

    // 現在表示されている画面の中央にトーストを表示
    return (
        <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000, // より高いz-indexを設定
                width: 'auto',
                maxWidth: '90vw',
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
