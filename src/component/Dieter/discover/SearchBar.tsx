import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { useTranslation } from '../../../hooks/useTranslation';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isDarkMode = useRecoilValue(darkModeState);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // 既存のタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    // 空の文字列の場合は即座に検索をクリア
    if (value.trim() === '') {
      onSearch?.('');
    } else {
      // そうでなければ500msのデバウンス
      debounceTimerRef.current = setTimeout(() => {
        onSearch?.(value);
      }, 500);
    }
  }, [onSearch]);

  return (
    <Box sx={{ p: 2, mb: 2 }}>
      <TextField
        fullWidth
        placeholder={t('dieter', 'searchPlaceholder', {}, 'Dieterを検索')}
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#29b6f6' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            backgroundColor: isDarkMode ? '#000000' : 'white',
            border: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
            fontSize: '0.95rem',
            color: isDarkMode ? '#ffffff' : '#000000',
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(41, 182, 246, 0.1)' 
              : '0 4px 12px rgba(41, 182, 246, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#29b6f6',
              boxShadow: isDarkMode 
                ? '0 6px 20px rgba(41, 182, 246, 0.2)' 
                : '0 6px 20px rgba(41, 182, 246, 0.2)',
              transform: 'translateY(-2px)'
            },
            '&.Mui-focused': {
              borderColor: '#29b6f6',
              boxShadow: isDarkMode 
                ? '0 8px 25px rgba(41, 182, 246, 0.3)' 
                : '0 8px 25px rgba(41, 182, 246, 0.3)',
              backgroundColor: isDarkMode 
                ? 'rgba(41, 182, 246, 0.1)' 
                : 'rgba(227, 242, 253, 0.1)'
            },
            // MUIデフォルトのアウトラインを無効化
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: isDarkMode ? '#bbbbbb' : '#90a4ae',
            opacity: 1,
            fontSize: '0.95rem'
          }
        }}
      />
    </Box>
  );
};

export default React.memo(SearchBar);
