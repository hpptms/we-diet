import React, { useState, useEffect } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Switch, FormControlLabel, Divider, Alert, Button } from '@mui/material';
import { notificationManager, NotificationSettings as NotificationSettingsType } from '../utils/notificationManager';
import { useTranslation } from '../hooks/useTranslation';

export const NotificationSettings: React.FC = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState<NotificationSettingsType>(notificationManager.getSettings());
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [testNotificationSent, setTestNotificationSent] = useState(false);
    const [isNotificationSupported, setIsNotificationSupported] = useState(false);

    useEffect(() => {
        // iOS Safari対応: Notification APIの存在をチェック
        if (typeof Notification !== 'undefined' && 'permission' in Notification) {
            setIsNotificationSupported(true);
            setPermission(Notification.permission);
        } else {
            setIsNotificationSupported(false);
            console.log('Notification API is not supported in this browser');
        }
    }, []);

    const handleEnableChange = async (enabled: boolean) => {
        if (!isNotificationSupported) {
            console.log('Notifications are not supported in this browser');
            return;
        }
        
        if (enabled) {
            const hasPermission = await notificationManager.enableNotifications();
            if (hasPermission) {
                setSettings({ ...settings, enabled: true });
                setPermission('granted');
            } else {
                // iOS Safari対応: 安全にNotification.permissionにアクセス
                if (typeof Notification !== 'undefined' && 'permission' in Notification) {
                    setPermission(Notification.permission);
                }
            }
        } else {
            notificationManager.disableNotifications();
            setSettings({ ...settings, enabled: false });
        }
    };

    const handleSoundChange = (enabled: boolean) => {
        notificationManager.toggleSound(enabled);
        setSettings({ ...settings, sound: enabled });
    };

    const handleImmediateChange = (enabled: boolean) => {
        notificationManager.toggleImmediate(enabled);
        setSettings({ ...settings, immediate: enabled });
    };

    const handleTestNotification = async () => {
        await notificationManager.showGeneralNotification(
            t('profile', 'testNotificationTitle'),
            t('profile', 'testNotificationBody')
        );
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
    };

    const getPermissionMessage = () => {
        if (!isNotificationSupported) {
            return { type: 'warning' as const, message: t('profile', 'notificationNotSupported') };
        }
        
        switch (permission) {
            case 'granted':
                return { type: 'success' as const, message: t('profile', 'notificationPermissionGranted') };
            case 'denied':
                return { type: 'error' as const, message: t('profile', 'notificationPermissionDenied') };
            default:
                return { type: 'info' as const, message: t('profile', 'notificationPermissionDefault') };
        }
    };

    const permissionInfo = getPermissionMessage();

    return (
        <Card>
            <CardHeader title={t('profile', 'notificationTitle')} />
            <CardContent>
                <Alert severity={permissionInfo.type} sx={{ mb: 2 }}>
                    {permissionInfo.message}
                </Alert>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={settings.enabled && permission === 'granted'}
                                onChange={(e) => handleEnableChange(e.target.checked)}
                                disabled={permission === 'denied' || !isNotificationSupported}
                            />
                        }
                        label={t('profile', 'enableNotifications')}
                    />

                    {settings.enabled && permission === 'granted' && (
                        <>
                            <Divider />
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.sound}
                                        onChange={(e) => handleSoundChange(e.target.checked)}
                                    />
                                }
                                label={t('profile', 'enableSound')}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.immediate}
                                        onChange={(e) => handleImmediateChange(e.target.checked)}
                                    />
                                }
                                label={t('profile', 'immediateNotifications')}
                            />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {settings.immediate 
                                        ? t('profile', 'immediateEnabled')
                                        : t('profile', 'tenMinuteLimit')
                                    }
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Button
                                    variant="outlined"
                                    onClick={handleTestNotification}
                                    disabled={testNotificationSent}
                                >
                                    {testNotificationSent ? t('profile', 'testNotificationSent') : t('profile', 'sendTestNotification')}
                                </Button>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    {t('profile', 'testNotificationDescription')}
                                </Typography>
                            </Box>
                        </>
                    )}

                    <Divider />

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            {t('profile', 'aboutNotifications')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                            {t('profile', 'notificationDescriptions')}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
