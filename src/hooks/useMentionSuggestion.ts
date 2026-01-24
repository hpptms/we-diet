import { useState, useCallback, useRef, useEffect } from 'react';
import { dieterApi } from '../api/dieterApi';

export interface MentionUser {
  id: number;
  username: string;
  avatar: string;
}

interface UseMentionSuggestionReturn {
  // State
  suggestions: MentionUser[];
  isLoading: boolean;
  showSuggestions: boolean;
  selectedIndex: number;
  mentionQuery: string;
  mentionStartIndex: number;

  // Actions
  handleInputChange: (text: string, cursorPosition: number) => void;
  selectSuggestion: (user: MentionUser) => string;
  closeSuggestions: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
  moveSelection: (direction: 'up' | 'down') => void;
}

export const useMentionSuggestion = (): UseMentionSuggestionReturn => {
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
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

  // Search users with debounce
  const searchUsers = useCallback(async (query: string) => {
    if (query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await dieterApi.searchUsers(query, 8);
      setSuggestions(response.users);
      setShowSuggestions(response.users.length > 0);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Failed to search users for mention:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change to detect @mention
  const handleInputChange = useCallback((text: string, cursorPosition: number) => {
    setCurrentText(text);

    // Find the @ symbol before cursor
    let atIndex = -1;
    for (let i = cursorPosition - 1; i >= 0; i--) {
      const char = text[i];
      // Stop if we hit a space or newline
      if (char === ' ' || char === '\n' || char === '\r') {
        break;
      }
      // Found @ symbol
      if (char === '@') {
        atIndex = i;
        break;
      }
    }

    if (atIndex === -1) {
      // No @ found, close suggestions
      setShowSuggestions(false);
      setMentionQuery('');
      setMentionStartIndex(-1);
      return;
    }

    // Extract the query after @
    const query = text.substring(atIndex + 1, cursorPosition);

    // Only search if query is valid (alphanumeric, underscore, hyphen)
    const validQuery = /^[a-zA-Z0-9_-]*$/.test(query);
    if (!validQuery) {
      setShowSuggestions(false);
      setMentionQuery('');
      setMentionStartIndex(-1);
      return;
    }

    setMentionStartIndex(atIndex);
    setMentionQuery(query);

    // Debounce the search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchUsers(query);
    }, 200);
  }, [searchUsers]);

  // Select a suggestion and return the new text
  const selectSuggestion = useCallback((user: MentionUser): string => {
    if (mentionStartIndex === -1) return currentText;

    // Replace @query with @username
    const beforeMention = currentText.substring(0, mentionStartIndex);
    const afterMention = currentText.substring(mentionStartIndex + mentionQuery.length + 1);
    const newText = `${beforeMention}@${user.username} ${afterMention}`;

    // Reset state
    setShowSuggestions(false);
    setSuggestions([]);
    setMentionQuery('');
    setMentionStartIndex(-1);
    setSelectedIndex(0);

    return newText;
  }, [currentText, mentionStartIndex, mentionQuery]);

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    setMentionQuery('');
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
    mentionQuery,
    mentionStartIndex,
    handleInputChange,
    selectSuggestion,
    closeSuggestions,
    handleKeyDown,
    moveSelection,
  };
};
