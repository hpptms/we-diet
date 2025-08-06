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

    return (
        <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
                zIndex: 9999,
                '& .MuiSnackbarContent-root': {
                    minWidth: '300px'
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
