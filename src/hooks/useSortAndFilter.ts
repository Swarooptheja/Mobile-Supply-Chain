import { useState, useCallback, useMemo } from 'react';
import { ILoadToDockItem } from '../types/loadToDock.interface';

export interface ISortState {
  sortBy: string | null;
}

export interface ISortOptions {
  sortBy?: string | null;
}

export const useSortAndFilter = (initialData: ILoadToDockItem[] = []) => {
  const [sortState, setSortState] = useState<ISortState>({
    sortBy: null
  });

  const [originalData] = useState(initialData);

  // No filtering or sorting applied client-side (all handled at SQL level)
  const filteredData = useMemo(() => {
    return [...originalData];
  }, [originalData]);

  // Update sort state
  const updateSortAndFilter = useCallback((sortBy: string | null, _filters: string[] = []) => {
    // Ignore filters parameter, only handle sorting
    setSortState({ sortBy });
  }, []);

  // Reset sort
  const resetSortAndFilter = useCallback(() => {
    setSortState({ sortBy: null });
  }, []);

  // Get current state
  const getCurrentState = useCallback(() => sortState, [sortState]);

  // Check if any sorting is applied
  const hasActiveFilters = useMemo(() => {
    return sortState.sortBy !== null;
  }, [sortState]);

  // Get filter count (only sorting count)
  const getFilterCount = useMemo(() => {
    return sortState.sortBy ? 1 : 0;
  }, [sortState]);

  // Get sorting options for SQL queries
  const getSortOptions = useCallback(() => {
    return {
      sortBy: sortState.sortBy,
      filters: [] // No filters for Load to Dock
    };
  }, [sortState]);

  return {
    // State
    sortAndFilterState: {
      sortBy: sortState.sortBy,
      filters: [] // Always empty for Load to Dock
    },
    filteredAndSortedData: filteredData, // Keep the same name for backward compatibility
    
    // Actions
    updateSortAndFilter,
    resetSortAndFilter,
    
    // Getters
    getCurrentState,
    hasActiveFilters,
    getFilterCount,
    getSortOptions
  };
};
