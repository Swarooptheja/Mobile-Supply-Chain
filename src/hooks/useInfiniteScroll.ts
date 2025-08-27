import { useState, useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
  pageSize: number;
  initialData?: T[];
  onLoadMore: (page: number, pageSize: number) => Promise<T[]>;
  onError?: (error: Error) => void;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  pageSize,
  initialData = [],
  onLoadMore,
  onError
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const onErrorRef = useRef(onError);
  const isRefreshingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
    onErrorRef.current = onError;
  }, [onLoadMore, onError]);

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMore) {
      console.log('useInfiniteScroll: LoadMore skipped - loading:', isLoadingMoreRef.current, 'hasMore:', hasMore);
      return;
    }

    try {
      console.log('useInfiniteScroll: Starting loadMore, page:', currentPage);
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      setError(null);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const newData = await onLoadMoreRef.current(currentPage, pageSize);
      console.log('useInfiniteScroll: LoadMore completed, got', newData.length, 'items');
      
      if (newData.length < pageSize) {
        setHasMore(false);
      }

      if (newData.length > 0) {
        setData(prevData => [...prevData, ...newData]);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('useInfiniteScroll: LoadMore error:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
        setError(errorObj);
        onErrorRef.current?.(errorObj);
      }
    } finally {
      setIsLoadingMore(false);
      isLoadingMoreRef.current = false;
      console.log('useInfiniteScroll: LoadMore finished');
    }
  }, [currentPage, pageSize, hasMore]);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      console.log('useInfiniteScroll: Refresh already in progress, skipping');
      return;
    }
    
    try {
      console.log('useInfiniteScroll: Starting refresh');
      isRefreshingRef.current = true;
      setIsLoading(true);
      setError(null);
      setHasMore(true);
      setCurrentPage(1);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      const newData = await onLoadMoreRef.current(1, pageSize);
      console.log('useInfiniteScroll: Refresh completed, got', newData.length, 'items');
      
      if (newData.length < pageSize) {
        setHasMore(false);
      }

      setData(newData);
    } catch (error) {
      console.error('useInfiniteScroll: Refresh error:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        const errorObj = error instanceof Error ? error : new Error('Unknown error occurred');
        setError(errorObj);
        onErrorRef.current?.(errorObj);
      }
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
      console.log('useInfiniteScroll: Refresh finished');
    }
  }, [pageSize]);

  const reset = useCallback(() => {
    setData([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    reset
  };
}
