import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface OverwriteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: string;
  currentWeight?: number;
  newWeight: number;
}

const OverwriteConfirmDialog: React.FC<OverwriteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  date,
  currentWeight,
  newWeight,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('ja-JP');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color="warning" />
        体重記録の上書き確認
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {formattedDate}の体重記録を上書きしますか？
          </Typography>
          
          {currentWeight && (
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                現在の記録: {currentWeight}kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                新しい記録: {newWeight}kg
              </Typography>
            </Box>
          )}
          
          <Typography variant="body2" color="text.secondary">
            この操作は元に戻すことができません。
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          いいえ
        </Button>
        <Button onClick={onConfirm} variant="contained" color="warning">
          はい、上書きする
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OverwriteConfirmDialog;
