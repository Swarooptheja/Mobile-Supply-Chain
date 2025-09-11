import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';
import { loadToDockService } from '../services/loadToDockService';
import { ILoadToDockItem } from '../types/loadToDock.interface';
import { BUSINESS_CONFIG } from '../config';

interface UseLoadToDockSearchOptions {
  pageSize?: number;
  searchDebounceMs?: number;
  sortBy?: string | null;
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
  searchDebounceMs = BUSINESS_CONFIG.PAGINATION.LOAD_TO_DOCK_SEARCH_DEBOUNCE_MS,
  sortBy = null
}: UseLoadToDockSearchOptions = {}): UseLoadToDockSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSearchingRef = useRef(false);
  const isInitialLoadRef = useRef(true);

  // Create the load more function with proper memoization
  const createLoadMoreFunction = useCallback((query: string, sortBy: string | null) => {
    return async (page: number, pageSize: number) => {
      if (query.trim()) {
        return await loadToDockService.searchLoadToDockItemsPaginated(query, page, pageSize, sortBy);
      } else {
        return await loadToDockService.getLoadToDockItemsPaginated(page, pageSize, sortBy);
      }
    };
  }, []);

  // Create load more function that updates when sortBy changes
  const loadMoreFunction = useMemo(() => 
    createLoadMoreFunction(searchQuery, sortBy), 
    [createLoadMoreFunction, searchQuery, sortBy]
  );

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

  // Update load more function when search query or sortBy changes
  useEffect(() => {
    if (isSearchingRef.current) {
      isSearchingRef.current = false;
    }
  }, [data]);

  // Watch for sortBy changes and trigger refresh
  useEffect(() => {
    // Skip initial load, only trigger refresh on actual sortBy changes
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }
    
    if (sortBy !== null) {
      reset();
      refresh();
    }
  }, [sortBy, reset, refresh]);


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
