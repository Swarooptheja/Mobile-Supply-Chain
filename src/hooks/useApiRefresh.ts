import { useState, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrganization } from '../context/OrganizationContext';
import { useUserResponsibilities } from './useUserResponsibilities';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTranslation } from './useTranslation';
import { 
  ApiRefreshService, 
  IRefreshResult, 
  IRefreshProgress, 
  IRefreshOptions,
  IRefreshSummary 
} from '../services/apiRefreshService';

interface UseApiRefreshOptions {
  timeout?: number;
  showNotifications?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
}

interface UseApiRefreshReturn {
  isRefreshing: boolean;
  refreshProgress: IRefreshProgress;
  lastRefreshResults: IRefreshResult[];
  refreshSummary: IRefreshSummary | null;
  refreshData: (responsibilities?: string[]) => Promise<void>;
  refreshSpecificApis: (apiNames: string[]) => Promise<void>;
  cancelRefresh: () => void;
  getRefreshSummary: () => IRefreshSummary | null;
  clearResults: () => void;
  retryFailedApis: () => Promise<void>;
}

/**
 * Generic API Refresh Hook
 * Provides reusable refresh functionality for any screen that needs to refresh API data
 */
export const useApiRefresh = (options: UseApiRefreshOptions = {}): UseApiRefreshReturn => {
  const {
    timeout = 30000,
    showNotifications = true,
    autoRetry = false,
    maxRetries = 3
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState<IRefreshProgress>({
    current: 0,
    total: 0,
    percentage: 0
  });
  const [lastRefreshResults, setLastRefreshResults] = useState<IRefreshResult[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  
  const { defaultOrgId } = useAuth();
  const { selectedOrgId } = useOrganization();
  const { responsibilities } = useUserResponsibilities();
  const { showSuccess, showError, showWarning } = useAttractiveNotification();
  const { t } = useTranslation();
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshStartTimeRef = useRef<number>(0);
  
  // Memoized refresh summary
  const refreshSummary = useMemo(() => {
    if (lastRefreshResults.length === 0) return null;
    return ApiRefreshService.getRefreshSummary(lastRefreshResults);
  }, [lastRefreshResults]);

  const showNotification = useCallback((type: 'success' | 'error' | 'warning', title: string, message: string) => {
    if (!showNotifications) return;
    
    switch (type) {
      case 'success':
        showSuccess(title, message);
        break;
      case 'error':
        showError(title, message);
        break;
      case 'warning':
        showWarning(title, message);
        break;
    }
  }, [showNotifications, showSuccess, showError, showWarning]);

  const handleRefreshComplete = useCallback((results: IRefreshResult[]) => {
    const summary = ApiRefreshService.getRefreshSummary(results);
    const duration = refreshStartTimeRef.current > 0 ? Date.now() - refreshStartTimeRef.current : 0;
    
    console.log('Refresh completed:', {
      summary,
      duration: `${duration}ms`,
      retryCount
    });

    if (summary.failedApis === 0) {
      showNotification(
        'success',
        t('notifications.refreshComplete'),
        t('notifications.refreshCompleteSuccess', { 
          apis: summary.successfulApis, 
          records: summary.totalInserted, 
          seconds: Math.round(duration / 1000) 
        })
      );
      setRetryCount(0); // Reset retry count on success
    } else if (summary.successfulApis > 0) {
      showNotification(
        'warning',
        t('notifications.refreshPartiallyComplete'),
        t('notifications.refreshPartiallyCompleteMessage', { 
          successful: summary.successfulApis, 
          total: summary.totalApis, 
          records: summary.totalInserted 
        })
      );
    } else {
      showNotification(
        'error',
        t('notifications.refreshFailed'),
        t('notifications.refreshFailedAllApis')
      );
    }
  }, [showNotification, retryCount]);

  const refreshData = useCallback(async (specificResponsibilities?: string[]) => {
    if (isRefreshing) {
      showNotification('warning', t('notifications.refreshAlreadyRunning'), t('notifications.refreshAlreadyRunningMessage'));
      return;
    }
    
    if (!defaultOrgId) {
      showNotification('error', t('notifications.refreshFailed'), t('notifications.organizationIdNotAvailable'));
      return;
    }
    
    try {
      setIsRefreshing(true);
      setRefreshProgress({ current: 0, total: 0, percentage: 0 });
      refreshStartTimeRef.current = Date.now();
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      // Use specific responsibilities or all user responsibilities
      const responsibilitiesToRefresh = specificResponsibilities || responsibilities;
      
      if (!responsibilitiesToRefresh.length) {
        showNotification('warning', t('notifications.noResponsibilities'), t('notifications.noResponsibilitiesMessage'));
        return;
      }
      
      console.log('Starting refresh for responsibilities:', responsibilitiesToRefresh);
      
      const refreshOptions: IRefreshOptions = {
        orgId: selectedOrgId || defaultOrgId || '',
        defaultOrgId: defaultOrgId,
        responsibilities: responsibilitiesToRefresh,
        onProgress: (progress) => {
          setRefreshProgress(progress);
        },
        abortSignal: abortControllerRef.current.signal,
        timeout
      };
      
      // Call the refresh service
      const results = await ApiRefreshService.refreshDataForResponsibilities(refreshOptions);
      
      // Store results
      setLastRefreshResults(results);
      
      // Handle completion
      handleRefreshComplete(results);
      
    } catch (error) {
      console.error('Error during refresh:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        showNotification('warning', t('notifications.refreshCancelled'), t('notifications.refreshCancelledMessage'));
      } else {
        const errorMessage = error instanceof Error ? error.message : t('notifications.unknownErrorOccurred');
        showNotification('error', t('notifications.refreshFailed'), errorMessage);
        
        // Auto retry logic
        if (autoRetry && retryCount < maxRetries) {
          console.log(`Auto retrying refresh (${retryCount + 1}/${maxRetries})...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            refreshData(specificResponsibilities);
          }, 2000 * (retryCount + 1)); // Exponential backoff
        }
      }
    } finally {
      setIsRefreshing(false);
      abortControllerRef.current = null;
    }
  }, [
    isRefreshing, 
    defaultOrgId,
    selectedOrgId,
    responsibilities, 
    timeout,
    autoRetry,
    maxRetries,
    retryCount,
    showNotification,
    handleRefreshComplete
  ]);

  const refreshSpecificApis = useCallback(async (apiNames: string[]) => {
    if (isRefreshing) {
      showNotification('warning', t('notifications.refreshAlreadyRunning'), t('notifications.refreshAlreadyRunningMessage'));
      return;
    }
    
    if (!defaultOrgId) {
      showNotification('error', t('notifications.refreshFailed'), t('notifications.organizationIdNotAvailable'));
      return;
    }
    
    if (!apiNames.length) {
      showNotification('warning', t('notifications.noApisSelected'), t('notifications.noApisSelectedMessage'));
      return;
    }
    
    try {
      setIsRefreshing(true);
      setRefreshProgress({ current: 0, total: 0, percentage: 0 });
      refreshStartTimeRef.current = Date.now();
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      console.log('Starting refresh for specific APIs:', apiNames);
      
      const refreshOptions: IRefreshOptions = {
        orgId: selectedOrgId || defaultOrgId || '',
        defaultOrgId: defaultOrgId,
        responsibilities: apiNames,
        onProgress: (progress) => {
          setRefreshProgress(progress);
        },
        abortSignal: abortControllerRef.current.signal,
        timeout
      };
      
      // Call the refresh service
      const results = await ApiRefreshService.refreshDataForResponsibilities(refreshOptions);
      
      // Store results
      setLastRefreshResults(results);
      
      // Handle completion
      handleRefreshComplete(results);
      
    } catch (error) {
      console.error('Error during specific API refresh:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        showNotification('warning', 'Refresh Cancelled', 'Data refresh was cancelled');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        showNotification('error', 'Refresh Failed', errorMessage);
      }
    } finally {
      setIsRefreshing(false);
      abortControllerRef.current = null;
    }
  }, [
    isRefreshing,
    defaultOrgId,
    selectedOrgId,
    timeout,
    showNotification,
    handleRefreshComplete
  ]);

  const retryFailedApis = useCallback(async () => {
    if (lastRefreshResults.length === 0) {
      showNotification('warning', 'No Results', 'No previous refresh results to retry');
      return;
    }
    
    const failedApis = lastRefreshResults
      .filter(result => !result.success)
      .map(result => result.apiName);
    
    if (failedApis.length === 0) {
      showNotification('success', 'No Failed APIs', 'All APIs succeeded in the last refresh');
      return;
    }
    
    console.log('Retrying failed APIs:', failedApis);
    await refreshSpecificApis(failedApis);
  }, [lastRefreshResults, refreshSpecificApis, showNotification]);

  const cancelRefresh = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsRefreshing(false);
    showNotification('warning', 'Refresh Cancelled', 'Data refresh was cancelled');
  }, [showNotification]);

  const getRefreshSummary = useCallback((): IRefreshSummary | null => {
    return refreshSummary;
  }, [refreshSummary]);

  const clearResults = useCallback(() => {
    setLastRefreshResults([]);
    setRetryCount(0);
    setRefreshProgress({ current: 0, total: 0, percentage: 0 });
  }, []);

  return {
    isRefreshing,
    refreshProgress,
    lastRefreshResults,
    refreshSummary,
    refreshData,
    refreshSpecificApis,
    cancelRefresh,
    getRefreshSummary,
    clearResults,
    retryFailedApis
  };
};
