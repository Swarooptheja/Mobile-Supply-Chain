import { useCallback, useEffect, useState } from 'react';
import { transactionHistoryService, TransactionHistoryItem, TransactionHistoryFilter, TransactionHistoryStats } from '../services/transactionHistoryService';

interface UseTransactionHistoryOptions {
  autoLoad?: boolean;
  initialFilter?: TransactionHistoryFilter;
  pageSize?: number;
}

interface UseTransactionHistoryReturn {
  // Data
  transactions: TransactionHistoryItem[];
  filteredTransactions: TransactionHistoryItem[];
  stats: TransactionHistoryStats | null;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  
  // Filtering
  currentFilter: TransactionHistoryFilter;
  
  // Actions
  loadTransactions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  loadMoreTransactions: () => Promise<void>;
  filterTransactions: (filter: TransactionHistoryFilter) => Promise<void>;
  searchTransactions: (searchTerm: string) => Promise<void>;
  getTransactionById: (id: string) => Promise<TransactionHistoryItem | null>;
  updateTransactionStatus: (id: string, status: 'pending' | 'success' | 'failed', message?: string) => Promise<void>;
  exportTransactions: (filter?: TransactionHistoryFilter) => Promise<string>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useTransactionHistory = (options: UseTransactionHistoryOptions = {}): UseTransactionHistoryReturn => {
  const {
    autoLoad = true,
    initialFilter = { status: 'all' },
    pageSize = 20
  } = options;

  // State management
  const [transactions, setTransactions] = useState<TransactionHistoryItem[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionHistoryItem[]>([]);
  const [stats, setStats] = useState<TransactionHistoryStats | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtering
  const [currentFilter, setCurrentFilter] = useState<TransactionHistoryFilter>(initialFilter);
  
  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await transactionHistoryService.getTransactionsPaginated(currentPage, pageSize);
      
      if (currentPage === 1) {
        setTransactions(result.transactions);
      } else {
        setTransactions(prev => [...prev, ...result.transactions]);
      }
      
      setTotalPages(result.totalPages);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
      setTotalCount(result.totalCount);
      
      // Apply current filter
      applyFilter(result.transactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      setCurrentPage(1);
      
      const result = await transactionHistoryService.getTransactionsPaginated(1, pageSize);
      setTransactions(result.transactions);
      setTotalPages(result.totalPages);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
      setTotalCount(result.totalCount);
      
      // Apply current filter
      applyFilter(result.transactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh transactions';
      setError(errorMessage);
      console.error('Error refreshing transactions:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [pageSize]);

  // Load more transactions (pagination)
  const loadMoreTransactions = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    try {
      setIsLoadingMore(true);
      setError(null);
      
      const nextPage = currentPage + 1;
      const result = await transactionHistoryService.getTransactionsPaginated(nextPage, pageSize);
      
      setTransactions(prev => [...prev, ...result.transactions]);
      setCurrentPage(nextPage);
      setTotalPages(result.totalPages);
      setHasNextPage(result.hasNextPage);
      setHasPreviousPage(result.hasPreviousPage);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more transactions';
      setError(errorMessage);
      console.error('Error loading more transactions:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, pageSize, hasNextPage, isLoadingMore]);

  // Apply filter to transactions
  const applyFilter = useCallback((transactionsToFilter: TransactionHistoryItem[]) => {
    let filtered = transactionsToFilter;
    
    if (currentFilter.status && currentFilter.status !== 'all') {
      filtered = filtered.filter(t => t.EBSTransactionStatus === currentFilter.status);
    }
    
    if (currentFilter.dateFrom) {
      filtered = filtered.filter(t => t.CreatedAt >= currentFilter.dateFrom!);
    }
    
    if (currentFilter.dateTo) {
      filtered = filtered.filter(t => t.CreatedAt <= currentFilter.dateTo!);
    }
    
    if (currentFilter.deliveryId) {
      filtered = filtered.filter(t => 
        t.DeliveryLineId.toLowerCase().includes(currentFilter.deliveryId!.toLowerCase())
      );
    }
    
    if (currentFilter.vehicleNumber) {
      filtered = filtered.filter(t => 
        t.VehicleNumber.toLowerCase().includes(currentFilter.vehicleNumber!.toLowerCase())
      );
    }
    
    if (currentFilter.userId) {
      filtered = filtered.filter(t => t.UserId === currentFilter.userId);
    }
    
    setFilteredTransactions(filtered);
  }, [currentFilter]);

  // Filter transactions
  const filterTransactions = useCallback(async (filter: TransactionHistoryFilter) => {
    try {
      setError(null);
      setCurrentFilter(filter);
      
      if (filter.status === 'all' && !filter.dateFrom && !filter.dateTo && !filter.deliveryId && !filter.vehicleNumber && !filter.userId) {
        // No specific filter, load all transactions
        await loadTransactions();
      } else {
        // Apply specific filter
        const filtered = await transactionHistoryService.getTransactionsWithFilter(filter);
        setTransactions(filtered);
        setFilteredTransactions(filtered);
        setTotalCount(filtered.length);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPreviousPage(false);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter transactions';
      setError(errorMessage);
      console.error('Error filtering transactions:', err);
    }
  }, [loadTransactions]);

  // Search transactions
  const searchTransactions = useCallback(async (searchTerm: string) => {
    try {
      setError(null);
      
      if (!searchTerm.trim()) {
        await loadTransactions();
        return;
      }
      
      const results = await transactionHistoryService.searchTransactions(searchTerm);
      setTransactions(results);
      setFilteredTransactions(results);
      setTotalCount(results.length);
      setTotalPages(1);
      setHasNextPage(false);
      setHasPreviousPage(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search transactions';
      setError(errorMessage);
      console.error('Error searching transactions:', err);
    }
  }, [loadTransactions]);

  // Get transaction by ID
  const getTransactionById = useCallback(async (id: string): Promise<TransactionHistoryItem | null> => {
    try {
      setError(null);
      return await transactionHistoryService.getTransactionById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get transaction';
      setError(errorMessage);
      console.error('Error getting transaction by ID:', err);
      return null;
    }
  }, []);

  // Update transaction status
  const updateTransactionStatus = useCallback(async (id: string, status: 'pending' | 'success' | 'failed', message?: string) => {
    try {
      setError(null);
      await transactionHistoryService.updateTransactionStatus(id, status, message);
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => 
          t.MobileTransactionId === id 
            ? { ...t, EBSTransactionStatus: status, Message: message }
            : t
        )
      );
      
      setFilteredTransactions(prev => 
        prev.map(t => 
          t.MobileTransactionId === id 
            ? { ...t, EBSTransactionStatus: status, Message: message }
            : t
        )
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction status';
      setError(errorMessage);
      console.error('Error updating transaction status:', err);
    }
  }, []);

  // Export transactions
  const exportTransactions = useCallback(async (filter?: TransactionHistoryFilter): Promise<string> => {
    try {
      setError(null);
      return await transactionHistoryService.exportTransactionsToCSV(filter);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export transactions';
      setError(errorMessage);
      console.error('Error exporting transactions:', err);
      throw err;
    }
  }, []);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const statsData = await transactionHistoryService.getTransactionStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading transaction stats:', err);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadTransactions();
      loadStats();
    }
  }, [autoLoad, loadTransactions, loadStats]);

  // Apply filter when transactions change
  useEffect(() => {
    applyFilter(transactions);
  }, [transactions, applyFilter]);

  return {
    // Data
    transactions,
    filteredTransactions,
    stats,
    
    // Loading states
    isLoading,
    isRefreshing,
    isLoadingMore,
    
    // Pagination
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    totalCount,
    
    // Filtering
    currentFilter,
    
    // Actions
    loadTransactions,
    refreshTransactions,
    loadMoreTransactions,
    filterTransactions,
    searchTransactions,
    getTransactionById,
    updateTransactionStatus,
    exportTransactions,
    
    // Error handling
    error,
    clearError
  };
};
