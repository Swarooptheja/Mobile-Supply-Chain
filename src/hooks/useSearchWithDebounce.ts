import { useCallback, useEffect, useRef } from 'react';

interface UseSearchWithDebounceProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  delay?: number;
}

export function useSearchWithDebounce({ 
  searchQuery, 
  onSearch, 
  delay = 300 
}: UseSearchWithDebounceProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSearch(searchQuery);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, onSearch, delay]);

  // Manual search trigger (for immediate search)
  const triggerSearch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

  return { triggerSearch };
}
