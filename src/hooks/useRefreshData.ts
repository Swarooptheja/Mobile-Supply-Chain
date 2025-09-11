import { useCallback, useState } from 'react';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { useTranslation } from './useTranslation';

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
  const { t } = useTranslation();

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
          t('ui.success'), 
          finalOptions.successMessage || t('notifications.dataRefreshedSuccessfully')
        );
      }
      
      finalOptions.onSuccess?.();
    } catch (error) {
      console.error('Refresh failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : (finalOptions.errorMessage || t('notifications.refreshFailed'));
      
      if (finalOptions.showToast !== false) {
        showError(t('notifications.refreshFailed'), errorMessage);
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
  const { t } = useTranslation();
  const { refreshData, refreshing } = useRefreshData({
    successMessage: t('notifications.organizationsRefreshedSuccessfully'),
    errorMessage: t('notifications.failedToRefreshOrganizations'),
  });

  return {
    refreshing,
    refreshData,
  };
};

// Specialized hook for dashboard refresh
export const useDashboardRefresh = () => {
  const { t } = useTranslation();
  const { refreshData, refreshing } = useRefreshData({
    successMessage: t('notifications.dashboardDataRefreshedSuccessfully'),
    errorMessage: t('notifications.failedToRefreshDashboardData'),
  });

  return {
    refreshing,
    refreshData,
  };
};
