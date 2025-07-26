import React from 'react';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { Public, Lock } from '@mui/icons-material';

interface PublicToggleProps {
    isPublic: boolean;
    onChange: (isPublic: boolean) => void;
    label?: string;
}

const PublicToggle: React.FC<PublicToggleProps> = ({ 
    isPublic, 
    onChange, 
    label = 'dieterに投稿' 
}) => {
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                {isPublic ? <Public sx={{ mr: 1 }} /> : <Lock sx={{ mr: 1 }} />}
                公開設定
            </Typography>
            <FormControlLabel
                control={
                    <Switch
                        checked={isPublic}
                        onChange={(e) => onChange(e.target.checked)}
                        color="primary"
                    />
                }
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">
                            {label}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                            {isPublic ? '（公開）' : '（非公開）'}
                        </Typography>
                    </Box>
                }
            />
        </Box>
    );
};

export default PublicToggle;
