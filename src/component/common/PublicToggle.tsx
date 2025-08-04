import React from 'react';
import { Paper, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WarningIcon from '@mui/icons-material/Warning';

interface PublicToggleProps {
    isPublic: boolean;
    onChange: (isPublic: boolean) => void;
    label?: string;
    isDarkMode?: boolean;
    isSensitive?: boolean;
    onSensitiveChange?: (isSensitive: boolean) => void;
    showSensitiveOption?: boolean;
}

const PublicToggle: React.FC<PublicToggleProps> = ({ 
    isPublic, 
    onChange, 
    label = 'dieterに投稿',
    isDarkMode = false,
    isSensitive = false,
    onSensitiveChange,
    showSensitiveOption = false
}) => {
    return (
        <Paper elevation={2} sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2,
            background: isDarkMode ? '#000000' : 'white',
            border: isDarkMode ? '1px solid white' : 'none'
        }}>
            {/* メインのチェックボックス群を横並びに配置 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {/* dieterに投稿チェックボックス */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isPublic}
                            onChange={(e) => onChange(e.target.checked)}
                            color="primary"
                            sx={{
                                color: isDarkMode ? 'white' : 'inherit',
                                '&.Mui-checked': {
                                    color: isDarkMode ? 'white' : '#1976d2',
                                },
                            }}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <GroupIcon sx={{ color: isDarkMode ? 'white' : 'inherit' }} />
                            <Typography sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{label}</Typography>
                        </Box>
                    }
                />
                
                {/* センシティブコンテンツオプション - dieterに投稿がチェックされた場合のみ表示 */}
                {showSensitiveOption && onSensitiveChange && isPublic && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSensitive}
                                onChange={(e) => onSensitiveChange(e.target.checked)}
                                color="warning"
                                sx={{
                                    color: isDarkMode ? 'white' : 'inherit',
                                    '&.Mui-checked': {
                                        color: isDarkMode ? '#ff9800' : '#ff9800',
                                    },
                                }}
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningIcon sx={{ color: isDarkMode ? '#ff9800' : '#ff9800', fontSize: '1rem' }} />
                                <Typography sx={{ 
                                    color: isDarkMode ? 'white' : 'inherit',
                                    fontSize: '0.9rem'
                                }}>
                                    センシティブ
                                </Typography>
                            </Box>
                        }
                    />
                )}
            </Box>
            
            {/* センシティブチェックボックスが表示されている場合の説明テキスト */}
            {showSensitiveOption && onSensitiveChange && isPublic && (
                <Typography variant="caption" sx={{ 
                    color: isDarkMode ? '#cccccc' : '#666666',
                    fontSize: '0.75rem',
                    display: 'block',
                    ml: 1,
                    mt: 0.5
                }}>
                    センシティブな内容を含む場合にチェックしてください
                </Typography>
            )}
        </Paper>
    );
};

export default PublicToggle;
