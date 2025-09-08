import { useState, useCallback, useEffect } from 'react';
import { realTimeSyncTransactionService } from '../services/realTimeSyncTransactionService';
import { transactionHistoryService } from '../services/transactionHistoryService';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { networkService } from '../services/networkService';
import { RESPONSIBILITIES } from '../config/api';

interface UseTransactionSyncReturn {
  // Sync state
  isSyncing: boolean;
  hasPendingTransactions: boolean;
  pendingCount: number;
  
  // Actions
  syncAllPendingTransactions: () => Promise<void>;
  refreshPendingStatus: () => Promise<void>;
  
  // Error handling
  syncError: string | null;
  clearSyncError: () => void;
}

export const useTransactionSync = (): UseTransactionSyncReturn => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasPendingTransactions, setHasPendingTransactions] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  
//   const { responsibilities, loading: responsibilitiesLoading } = useUserResponsibilities();
  const responsibilities = RESPONSIBILITIES;
  const { showSuccess, showError, showInfo } = useAttractiveNotification();

  // Check for pending transactions
  const checkPendingTransactions = useCallback(async () => {
    try {
      const pendingTransactions = await transactionHistoryService.getPendingTransactions();
      const count = pendingTransactions.length;
      
      setHasPendingTransactions(count > 0);
      setPendingCount(count);
      
      if (__DEV__) {
        console.log(`📊 Pending transactions check: ${count} found`);
      }
    } catch (error) {
      console.error('Error checking pending transactions:', error);
      setHasPendingTransactions(false);
      setPendingCount(0);
    }
  }, []);

  // Sync all pending transactions
  const syncAllPendingTransactions = useCallback(async () => {
    if (isSyncing || !Object.keys(responsibilities).length) {
      return;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      // Check network connectivity
      const isOnline = await networkService.isOnline();
      if (!isOnline) {
        showInfo('No Internet Connection', 'Please check your network and try again.');
        return;
      }

      // Show initial sync message
      showInfo('Sync Started', 'Starting sync process...');

      let totalSynced = 0;
      let totalErrors = 0;
      const errors: string[] = [];

      // Sync each responsibility
      for (const [_, responsibility] of Object.entries(responsibilities)) {
        try {
          console.log(`🔄 Syncing transactions for responsibility: ${responsibility}`);
          
          const result = await realTimeSyncTransactionService.syncTransaction(responsibility);
          
          if (result.success) {
            if (result.offline) {
              showInfo('Offline Mode', result.error || 'Data saved locally. Will sync when online.');
              return;
            }
            totalSynced++;
            console.log(`✅ Successfully synced responsibility: ${responsibility}`);
          } else {
            totalErrors++;
            const errorMsg = `Failed to sync ${responsibility}: ${result.error}`;
            errors.push(errorMsg);
            console.error(`❌ ${errorMsg}`);
          }
        } catch (error) {
          totalErrors++;
          const errorMsg = `Error syncing ${responsibility}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      // Refresh pending status after sync
      await checkPendingTransactions();

      // Show final result
      if (totalErrors === 0) {
        showSuccess('Sync Complete', `Successfully synced ${totalSynced} transaction(s)!`);
      } else if (totalSynced > 0) {
        showError('Partial Sync', `Synced ${totalSynced} transaction(s), but ${totalErrors} failed. Check logs for details.`);
      } else {
        showError('Sync Failed', 'Please try again or contact support.');
      }

      // Log detailed errors if any
      if (errors.length > 0) {
        console.error('Sync errors:', errors);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed unexpectedly';
      setSyncError(errorMessage);
      showError('Sync Error', errorMessage);
      console.error('Error during sync process:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, responsibilities, showSuccess, showError, showInfo, checkPendingTransactions]);

  // Refresh pending status
  const refreshPendingStatus = useCallback(async () => {
    await checkPendingTransactions();
  }, [checkPendingTransactions]);

  // Clear sync error
  const clearSyncError = useCallback(() => {
    setSyncError(null);
  }, []);

  // Check pending transactions on mount and when responsibilities change
  useEffect(() => {
    if (Object.keys(responsibilities).length > 0) {
      checkPendingTransactions();
    }
  }, [responsibilities, checkPendingTransactions]);

  return {
    // Sync state
    isSyncing,
    hasPendingTransactions,
    pendingCount,
    
    // Actions
    syncAllPendingTransactions,
    refreshPendingStatus,
    
    // Error handling
    syncError,
    clearSyncError,
  };
};
