import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search,
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <Box sx={{ p: 3, mb: 4 }}>
      <TextField
        fullWidth
        placeholder="Dieterを検索"
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
            backgroundColor: 'white',
            border: '2px solid #e1f5fe',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(41, 182, 246, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#29b6f6',
              boxShadow: '0 6px 20px rgba(41, 182, 246, 0.2)',
              transform: 'translateY(-2px)'
            },
            '&.Mui-focused': {
              borderColor: '#29b6f6',
              boxShadow: '0 8px 25px rgba(41, 182, 246, 0.3)',
              backgroundColor: 'rgba(227, 242, 253, 0.1)'
            }
          },
          '& .MuiInputBase-input::placeholder': {
            color: '#90a4ae',
            opacity: 1,
            fontSize: '1.1rem'
          }
        }}
      />
    </Box>
  );
};

export default SearchBar;
