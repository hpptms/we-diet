import React from 'react';
import { Stack, Button, ButtonGroup, Box, Typography, IconButton } from '@mui/material';
import { Today, History, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation';

interface WeightActionButtonsProps {
  viewPeriod: 'month' | 'year';
  currentPeriod: string;
  isCurrentPeriod: boolean;
  onAddTodayWeight: () => void;
  onAddPastWeight: () => void;
  onViewPeriodChange: (period: 'month' | 'year') => void;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

const WeightActionButtons: React.FC<WeightActionButtonsProps> = ({
  viewPeriod,
  currentPeriod,
  isCurrentPeriod,
  onAddTodayWeight,
  onAddPastWeight,
  onViewPeriodChange,
  onNavigatePrevious,
  onNavigateNext,
}) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
      {/* 体重記録ボタン */}
      <Stack direction="row" spacing={1}>
        <Button
          onClick={onAddTodayWeight}
          variant="contained"
          color="success"
          startIcon={<Today />}
          sx={{ px: 3 }}
        >
          {t('weight', 'addTodayWeight', {}, '今日の体重を記録')}
        </Button>
        <Button
          onClick={onAddPastWeight}
          variant="contained"
          color="info"
          startIcon={<History />}
          sx={{ px: 3 }}
        >
          {t('weight', 'addPastWeight', {}, '過去の体重を記録')}
        </Button>
      </Stack>

      {/* 期間選択ボタン */}
      <ButtonGroup variant="outlined" color="primary">
        <Button
          onClick={() => onViewPeriodChange('month')}
          variant={viewPeriod === 'month' ? 'contained' : 'outlined'}
        >
          {t('weight', 'monthView', {}, '1か月')}
        </Button>
        <Button
          onClick={() => onViewPeriodChange('year')}
          variant={viewPeriod === 'year' ? 'contained' : 'outlined'}
        >
          {t('weight', 'yearView', {}, '1年')}
        </Button>
      </ButtonGroup>

      {/* ナビゲーションボタン */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={onNavigatePrevious}
          color="primary"
          size="small"
        >
          <ArrowBackIos />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', minWidth: 150, textAlign: 'center' }}>
          {currentPeriod}
        </Typography>
        {!isCurrentPeriod && (
          <IconButton
            onClick={onNavigateNext}
            color="primary"
            size="small"
          >
            <ArrowForwardIos />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};

export default WeightActionButtons;
