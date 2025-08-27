import { useState, useCallback, useMemo } from 'react';
import { ILoadToDockItem } from '../types/loadToDock.interface';

export interface ISortAndFilterState {
  sortBy: string | null;
  filters: string[];
}

export const useSortAndFilter = (initialData: ILoadToDockItem[] = []) => {
  const [sortAndFilterState, setSortAndFilterState] = useState<ISortAndFilterState>({
    sortBy: null,
    filters: []
  });

  const [originalData] = useState(initialData);

  // Apply sorting and filtering to data
  const filteredAndSortedData = useMemo(() => {
    let result = [...originalData];

    // Apply filters
    if (sortAndFilterState.filters.length > 0) {
      result = result.filter(item => {
        return sortAndFilterState.filters.every(filter => {
          switch (filter) {
            case 'pending':
              return item.status === 'pending';
            case 'in-progress':
              return item.status === 'in-progress';
            case 'completed':
              return item.status === 'completed';
            case 'dock-01':
              return item.dock === 'DOCK-01';
            case 'dock-02':
              return item.dock === 'DOCK-02';
            case 'ac-networks':
              return item.customerName === 'A. C. Networks';
            case 'today':
              // Filter for today's date (implement based on your date format)
              return true; // Placeholder
            case 'this-week':
              // Filter for this week (implement based on your date format)
              return true; // Placeholder
            case 'this-month':
              // Filter for this month (implement based on your date format)
              return true; // Placeholder
            case 'has-items':
              return item.itemCount > 0;
            case 'no-items':
              return item.itemCount === 0;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    if (sortAndFilterState.sortBy) {
      result.sort((a, b) => {
        switch (sortAndFilterState.sortBy) {
          case 'delivery-date-desc':
            return new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime();
          case 'delivery-date-asc':
            return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
          case 'delivery-id-asc':
            return a.deliveryId.localeCompare(b.deliveryId);
          case 'delivery-id-desc':
            return b.deliveryId.localeCompare(a.deliveryId);
          case 'customer-name-asc':
            return a.customerName.localeCompare(b.customerName);
          case 'customer-name-desc':
            return b.customerName.localeCompare(a.customerName);
          case 'dock-asc':
            return a.dock.localeCompare(b.dock);
          case 'items-count-asc':
            return a.itemCount - b.itemCount;
          case 'items-count-desc':
            return b.itemCount - a.itemCount;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [originalData, sortAndFilterState]);

  // Update sort and filter state
  const updateSortAndFilter = useCallback((sortBy: string | null, filters: string[]) => {
    setSortAndFilterState({ sortBy, filters });
  }, []);

  // Reset sort and filter
  const resetSortAndFilter = useCallback(() => {
    setSortAndFilterState({ sortBy: null, filters: [] });
  }, []);

  // Get current state
  const getCurrentState = useCallback(() => sortAndFilterState, [sortAndFilterState]);

  // Check if any filters or sorting is applied
  const hasActiveFilters = useMemo(() => {
    return sortAndFilterState.sortBy !== null || sortAndFilterState.filters.length > 0;
  }, [sortAndFilterState]);

  // Get filter count
  const getFilterCount = useMemo(() => {
    let count = 0;
    if (sortAndFilterState.sortBy) count++;
    count += sortAndFilterState.filters.length;
    return count;
  }, [sortAndFilterState]);

  return {
    // State
    sortAndFilterState,
    filteredAndSortedData,
    
    // Actions
    updateSortAndFilter,
    resetSortAndFilter,
    
    // Getters
    getCurrentState,
    hasActiveFilters,
    getFilterCount
  };
};
