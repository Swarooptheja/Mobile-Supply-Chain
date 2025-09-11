import { useState, useCallback, useRef, useEffect } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';
import { loadToDockService } from '../services/loadToDockService';
import { ILoadToDockItem } from '../types/loadToDock.interface';
import { BUSINESS_CONFIG } from '../config';

interface UseLoadToDockSearchOptions {
  pageSize?: number;
  searchDebounceMs?: number;
}

interface UseLoadToDockSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  data: ILoadToDockItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for LoadToDock search functionality with optimized performance
 */
export const useLoadToDockSearch = ({
  pageSize = BUSINESS_CONFIG.PAGINATION.LOAD_TO_DOCK_PAGE_SIZE,
  searchDebounceMs = BUSINESS_CONFIG.PAGINATION.LOAD_TO_DOCK_SEARCH_DEBOUNCE_MS
}: UseLoadToDockSearchOptions = {}): UseLoadToDockSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSearchingRef = useRef(false);

  // Create the load more function with proper memoization
  const createLoadMoreFunction = useCallback((query: string) => {
    return async (page: number, pageSize: number) => {
      if (query.trim()) {
        return await loadToDockService.searchLoadToDockItemsPaginated(query, page, pageSize);
      } else {
        return await loadToDockService.getLoadToDockItemsPaginated(page, pageSize);
      }
    };
  }, []);

  // Initialize with empty search
  const loadMoreFunction = createLoadMoreFunction(searchQuery);

  const {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset
  } = useInfiniteScroll({
    pageSize,
    onLoadMore: loadMoreFunction,
    onError: useCallback((error: Error) => {
      console.error('LoadToDock search error:', error);
    }, [])
  });

  // Optimized search query handler with debouncing
  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for debounced search
    debounceTimeoutRef.current = setTimeout(() => {
      isSearchingRef.current = true;
      reset();
      refresh();
    }, searchDebounceMs);
  }, [reset, refresh, searchDebounceMs]);

  // Update load more function when search query changes
  useEffect(() => {
    if (isSearchingRef.current) {
      isSearchingRef.current = false;
    }
  }, [data]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset
  };
};
