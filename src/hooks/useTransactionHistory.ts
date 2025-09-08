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
  
  // Filtering
  currentFilter: TransactionHistoryFilter;
  searchTerm: string;
  
  // Actions
  refreshTransactions: () => Promise<void>;
  filterTransactions: (filter: TransactionHistoryFilter) => Promise<void>;
  searchTransactions: (searchTerm: string) => Promise<void>;
  
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
  
  // Filtering
  const [currentFilter, setCurrentFilter] = useState<TransactionHistoryFilter>(initialFilter);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Apply filter to transactions
  const applyFilter = useCallback((transactionsToFilter: TransactionHistoryItem[]) => {
    let filtered = transactionsToFilter;
    
    if (currentFilter.status && currentFilter.status !== 'all') {
      filtered = filtered.filter(t => t.sharePointTransactionStatus === currentFilter.status);
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

  // Load transactions
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await transactionHistoryService.getTransactionsPaginated(1, pageSize);
      setTransactions(result.transactions);
      
      // Apply current filter
      applyFilter(result.transactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, applyFilter]);

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const result = await transactionHistoryService.getTransactionsPaginated(1, pageSize);
      setTransactions(result.transactions);
      
      // Apply current filter
      applyFilter(result.transactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh transactions';
      setError(errorMessage);
      console.error('Error refreshing transactions:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [pageSize, applyFilter]);

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
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to filter transactions';
      setError(errorMessage);
      console.error('Error filtering transactions:', err);
    }
  }, [loadTransactions]);

  // Search transactions
  const searchTransactions = useCallback(async (searchText: string) => {
    try {
      setError(null);
      setSearchTerm(searchText);
      
      if (!searchText.trim()) {
        await loadTransactions();
        return;
      }
      
      const results = await transactionHistoryService.searchTransactions(searchText);
      setTransactions(results);
      setFilteredTransactions(results);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search transactions';
      setError(errorMessage);
      console.error('Error searching transactions:', err);
    }
  }, [loadTransactions]);

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
    
    // Filtering
    currentFilter,
    searchTerm,
    
    // Actions
    refreshTransactions,
    filterTransactions,
    searchTransactions,
    
    // Error handling
    error,
    clearError
  };
};
