import { useCallback, useState } from 'react';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';

export interface RefreshOptions {
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useRefreshData = (options: RefreshOptions = {}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useAttractiveNotification();

  const refreshData = useCallback(async (
    refreshFunction: () => Promise<void>,
    customOptions?: Partial<RefreshOptions>
  ) => {
    const finalOptions = { ...options, ...customOptions };
    
    setRefreshing(true);
    
    try {
      await refreshFunction();
      
      if (finalOptions.showToast !== false) {
        showSuccess(
          'Success', 
          finalOptions.successMessage || 'Data refreshed successfully'
        );
      }
      
      finalOptions.onSuccess?.();
    } catch (error) {
      console.error('Refresh failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : (finalOptions.errorMessage || 'Refresh failed');
      
      if (finalOptions.showToast !== false) {
        showError('Refresh Failed', errorMessage);
      }
      
      finalOptions.onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setRefreshing(false);
    }
  }, [options, showSuccess, showError]);

  return {
    refreshing,
    refreshData,
    setRefreshing,
  };
};

// Specialized hook for organization refresh
export const useOrganizationRefresh = () => {
  const { refreshData, refreshing } = useRefreshData({
    successMessage: 'Organizations refreshed successfully',
    errorMessage: 'Failed to refresh organizations',
  });

  return {
    refreshing,
    refreshData,
  };
};

// Specialized hook for dashboard refresh
export const useDashboardRefresh = () => {
  const { refreshData, refreshing } = useRefreshData({
    successMessage: 'Dashboard data refreshed successfully',
    errorMessage: 'Failed to refresh dashboard data',
  });

  return {
    refreshing,
    refreshData,
  };
};
