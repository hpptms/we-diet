import { useState, useCallback, useRef, useEffect } from 'react';
import { dieterApi } from '../api/dieterApi';

export interface HashtagItem {
  hashtag: string;
  posts: number;
}

interface UseHashtagSuggestionReturn {
  // State
  suggestions: HashtagItem[];
  isLoading: boolean;
  showSuggestions: boolean;
  selectedIndex: number;
  hashtagQuery: string;
  hashtagStartIndex: number;

  // Actions
  handleInputChange: (text: string, cursorPosition: number) => void;
  selectSuggestion: (hashtag: HashtagItem) => string;
  closeSuggestions: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
  moveSelection: (direction: 'up' | 'down') => void;
}

export const useHashtagSuggestion = (): UseHashtagSuggestionReturn => {
  const [suggestions, setSuggestions] = useState<HashtagItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hashtagQuery, setHashtagQuery] = useState('');
  const [hashtagStartIndex, setHashtagStartIndex] = useState(-1);
  const [currentText, setCurrentText] = useState('');

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Search hashtags with debounce
  const searchHashtags = useCallback(async (query: string) => {
    if (query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await dieterApi.searchHashtags(query, 8);
      setSuggestions(response.hashtags);
      setShowSuggestions(response.hashtags.length > 0);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Failed to search hashtags:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change to detect #hashtag
  const handleInputChange = useCallback((text: string, cursorPosition: number) => {
    setCurrentText(text);

    // Find the # symbol before cursor
    let hashIndex = -1;
    for (let i = cursorPosition - 1; i >= 0; i--) {
      const char = text[i];
      // Stop if we hit a space or newline
      if (char === ' ' || char === '\n' || char === '\r') {
        break;
      }
      // Found # symbol
      if (char === '#') {
        hashIndex = i;
        break;
      }
    }

    if (hashIndex === -1) {
      // No # found, close suggestions
      setShowSuggestions(false);
      setHashtagQuery('');
      setHashtagStartIndex(-1);
      return;
    }

    // Extract the query after #
    const query = text.substring(hashIndex + 1, cursorPosition);

    // Only search if query is valid (alphanumeric, Japanese characters)
    const validQuery = /^[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]*$/.test(query);
    if (!validQuery) {
      setShowSuggestions(false);
      setHashtagQuery('');
      setHashtagStartIndex(-1);
      return;
    }

    setHashtagStartIndex(hashIndex);
    setHashtagQuery(query);

    // Debounce the search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchHashtags(query);
    }, 200);
  }, [searchHashtags]);

  // Select a suggestion and return the new text
  const selectSuggestion = useCallback((hashtag: HashtagItem): string => {
    if (hashtagStartIndex === -1) return currentText;

    // Replace #query with #hashtag
    const beforeHashtag = currentText.substring(0, hashtagStartIndex);
    const afterHashtag = currentText.substring(hashtagStartIndex + hashtagQuery.length + 1);
    const newText = `${beforeHashtag}${hashtag.hashtag} ${afterHashtag}`;

    // Reset state
    setShowSuggestions(false);
    setSuggestions([]);
    setHashtagQuery('');
    setHashtagStartIndex(-1);
    setSelectedIndex(0);

    return newText;
  }, [currentText, hashtagStartIndex, hashtagQuery]);

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    setHashtagQuery('');
    setSelectedIndex(0);
  }, []);

  // Move selection up or down
  const moveSelection = useCallback((direction: 'up' | 'down') => {
    if (!showSuggestions || suggestions.length === 0) return;

    setSelectedIndex(prev => {
      if (direction === 'up') {
        return prev <= 0 ? suggestions.length - 1 : prev - 1;
      } else {
        return prev >= suggestions.length - 1 ? 0 : prev + 1;
      }
    });
  }, [showSuggestions, suggestions.length]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent): boolean => {
    if (!showSuggestions || suggestions.length === 0) {
      return false;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        moveSelection('up');
        return true;

      case 'ArrowDown':
        e.preventDefault();
        moveSelection('down');
        return true;

      case 'Enter':
      case 'Tab':
        if (suggestions[selectedIndex]) {
          e.preventDefault();
          return true; // Caller should handle selection
        }
        return false;

      case 'Escape':
        e.preventDefault();
        closeSuggestions();
        return true;

      default:
        return false;
    }
  }, [showSuggestions, suggestions, selectedIndex, moveSelection, closeSuggestions]);

  return {
    suggestions,
    isLoading,
    showSuggestions,
    selectedIndex,
    hashtagQuery,
    hashtagStartIndex,
    handleInputChange,
    selectSuggestion,
    closeSuggestions,
    handleKeyDown,
    moveSelection,
  };
};
