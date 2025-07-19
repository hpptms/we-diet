import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBackIos, Scale } from '@mui/icons-material';

interface WeightManagementHeaderProps {
  onBack?: () => void;
}

const WeightManagementHeader: React.FC<WeightManagementHeaderProps> = ({ onBack }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Scale color="primary" />
        体重の管理
      </Typography>
      {onBack && (
        <Button
          onClick={onBack}
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIos />}
          sx={{ minWidth: 120 }}
        >
          戻る
        </Button>
      )}
    </Box>
  );
};

export default WeightManagementHeader;
