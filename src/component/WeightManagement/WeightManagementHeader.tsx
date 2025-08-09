import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBackIos, Scale } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { useTranslation } from '../../hooks/useTranslation';

interface WeightManagementHeaderProps {
  onBack?: () => void;
}

const WeightManagementHeader: React.FC<WeightManagementHeaderProps> = ({ onBack }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Scale color="primary" />
        {t('weight', 'title', {}, '体重の管理')}
      </Typography>
      {onBack && (
        <Button
          onClick={onBack}
          variant="outlined"
          startIcon={<ArrowBackIos />}
          sx={{ 
            minWidth: 120,
            ...(isDarkMode && {
              borderColor: '#00bcd4',
              color: '#00bcd4',
              '&:hover': {
                borderColor: '#26c6da',
                backgroundColor: 'rgba(0, 188, 212, 0.04)',
              }
            })
          }}
        >
          {t('weight', 'backButton', {}, '戻る')}
        </Button>
      )}
    </Box>
  );
};

export default WeightManagementHeader;
