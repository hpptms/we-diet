import React, { useState, useEffect } from 'react';
import { Box, Card, CardHeader, CardContent, Typography, Switch, FormControlLabel, Divider, Alert, Button } from '@mui/material';
import { notificationManager, NotificationSettings as NotificationSettingsType } from '../utils/notificationManager';

export const NotificationSettings: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettingsType>(notificationManager.getSettings());
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
    const [testNotificationSent, setTestNotificationSent] = useState(false);

    useEffect(() => {
        // 権限状態をチェック
        setPermission(Notification.permission);
    }, []);

    const handleEnableChange = async (enabled: boolean) => {
        if (enabled) {
            const hasPermission = await notificationManager.enableNotifications();
            if (hasPermission) {
                setSettings({ ...settings, enabled: true });
                setPermission('granted');
            } else {
                setPermission(Notification.permission);
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
            'テスト通知',
            'これはテスト通知です。通知設定が正常に動作しています。'
        );
        setTestNotificationSent(true);
        setTimeout(() => setTestNotificationSent(false), 3000);
    };

    const getPermissionMessage = () => {
        switch (permission) {
            case 'granted':
                return { type: 'success' as const, message: '通知の権限が許可されています' };
            case 'denied':
                return { type: 'error' as const, message: '通知がブロックされています。ブラウザの設定から許可してください。' };
            default:
                return { type: 'info' as const, message: '通知を有効にするには権限の許可が必要です' };
        }
    };

    const permissionInfo = getPermissionMessage();

    return (
        <Card>
            <CardHeader title="通知設定" />
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
                                disabled={permission === 'denied'}
                            />
                        }
                        label="通知を有効にする"
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
                                label="通知音を有効にする"
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.immediate}
                                        onChange={(e) => handleImmediateChange(e.target.checked)}
                                    />
                                }
                                label="即座に通知する（10分制限を無効）"
                            />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {settings.immediate 
                                        ? '即座通知が有効です。新しい通知がすぐに表示されます。'
                                        : '10分制限が有効です。同じタイプの通知は10分間隔で表示されます。'
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
                                    {testNotificationSent ? 'テスト通知を送信しました' : 'テスト通知を送信'}
                                </Button>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    通知設定をテストできます
                                </Typography>
                            </Box>
                        </>
                    )}

                    <Divider />

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            通知について
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • 新しいメッセージが届いた時<br />
                            • 重要なお知らせがある時<br />
                            • 音は設定により有効/無効にできます<br />
                            • 通知頻度は即座通知または10分制限から選択可能
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
