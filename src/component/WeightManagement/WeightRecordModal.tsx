import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';

interface WeightRecordModalProps {
  open: boolean;
  title: string;
  dateValue: string;
  weightValue: string;
  noteValue: string;
  isDateReadOnly?: boolean;
  onClose: () => void;
  onDateChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  submitButtonText: string;
  submitButtonColor?: 'success' | 'info';
}

const WeightRecordModal: React.FC<WeightRecordModalProps> = ({
  open,
  title,
  dateValue,
  weightValue,
  noteValue,
  isDateReadOnly = false,
  onClose,
  onDateChange,
  onWeightChange,
  onNoteChange,
  onSubmit,
  submitButtonText,
  submitButtonColor = 'success',
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="日付"
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            InputProps={{ readOnly: isDateReadOnly }}
            required={!isDateReadOnly}
            fullWidth
            variant="outlined"
          />
          
          <TextField
            label="体重 (kg)"
            type="number"
            inputProps={{ step: 0.1 }}
            value={weightValue}
            onChange={(e) => onWeightChange(e.target.value)}
            required
            fullWidth
            variant="outlined"
            helperText="体脂肪率は自動計算されます"
          />
          
          <TextField
            label="メモ"
            multiline
            rows={3}
            value={noteValue}
            onChange={(e) => onNoteChange(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          キャンセル
        </Button>
        <Button onClick={onSubmit} variant="contained" color={submitButtonColor}>
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WeightRecordModal;
