import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Alert } from '@mui/material';
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

    // Auto-dismiss
    useEffect(() => {
        if (toast.open) {
            const timer = setTimeout(onClose, 6000);
            return () => clearTimeout(timer);
        }
    }, [toast.open, onClose]);

    if (!toast.open) return null;

    const alertSx = {
        fontSize: '14px',
        fontWeight: 'normal',
        minWidth: '300px',
        maxWidth: '90vw',
        wordBreak: 'break-word',
        whiteSpace: 'pre-line',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        backgroundColor: isDarkMode ? (
            toast.severity === 'success' ? '#2e7d32' :
            toast.severity === 'info' ? '#1976d2' :
            toast.severity === 'warning' ? '#ed6c02' : '#d32f2f'
        ) : (
            toast.severity === 'success' ? '#4caf50' :
            toast.severity === 'info' ? '#2196f3' :
            toast.severity === 'warning' ? '#ff9800' : '#f44336'
        )
    };

    const getWrapperStyle = (): React.CSSProperties => {
        switch (position) {
            case 'top':
                return {
                    position: 'fixed',
                    top: 'calc(env(safe-area-inset-top, 20px) + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10000,
                };
            case 'bottom':
                return {
                    position: 'fixed',
                    bottom: '120px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10000,
                };
            default: // center
                return {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10000,
                };
        }
    };

    // React Portalでdocument.body直下に描画
    // bodyのcontain/transform等のCSS影響を回避するためportal先はdocument.documentElement(html要素)
    return ReactDOM.createPortal(
        <div style={getWrapperStyle()}>
            <Alert
                onClose={onClose}
                severity={toast.severity}
                variant="filled"
                sx={alertSx}
            >
                {toast.message}
            </Alert>
        </div>,
        document.documentElement
    );
};

export default ToastProvider;
