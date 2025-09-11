import { useCallback } from 'react';
import { useApiRefresh, UseApiRefreshOptions } from './useApiRefresh';
import { IRefreshResult, IRefreshProgress, IRefreshSummary } from '../services/apiRefreshService';

interface UseLoadToDockRefreshOptions extends UseApiRefreshOptions {
  enableShipConfirmOnly?: boolean;
}

interface UseLoadToDockRefreshReturn {
  isRefreshing: boolean;
  refreshProgress: IRefreshProgress;
  lastRefreshResults: IRefreshResult[];
  refreshSummary: IRefreshSummary | null;
  refreshShipConfirmData: () => Promise<void>;
  refreshAllLoadToDockData: () => Promise<void>;
  refreshSpecificLoadToDockData: (responsibilities: string[]) => Promise<void>;
  cancelRefresh: () => void;
  getRefreshSummary: () => IRefreshSummary | null;
  clearResults: () => void;
  retryFailedApis: () => Promise<void>;
}

/**
 * Specialized LoadToDock Refresh Hook
 * Provides LoadToDock-specific refresh functionality with predefined responsibilities
 */
export const useLoadToDockRefresh = (options: UseLoadToDockRefreshOptions = {}): UseLoadToDockRefreshReturn => {
  const {
    enableShipConfirmOnly = true,
    ...apiRefreshOptions
  } = options;

  // Use the generic API refresh hook
  const {
    isRefreshing,
    refreshProgress,
    lastRefreshResults,
    refreshSummary,
    refreshSpecificApis,
    cancelRefresh,
    getRefreshSummary,
    clearResults,
    retryFailedApis
  } = useApiRefresh(apiRefreshOptions);

  /**
   * Refresh only SHIP_CONFIRM data for LoadToDock
   */
  const refreshShipConfirmData = useCallback(async () => {
    console.log('Refreshing SHIP_CONFIRM data for LoadToDock');
    await refreshSpecificApis(['SHIP_CONFIRM']);
  }, [refreshSpecificApis]);

  /**
   * Refresh all LoadToDock related data
   * This includes SHIP_CONFIRM and any other responsibilities the user has
   */
  const refreshAllLoadToDockData = useCallback(async () => {
    console.log('Refreshing all LoadToDock data');
    
    // Define LoadToDock specific responsibilities
    const loadToDockResponsibilities = ['SHIP_CONFIRM'];
    
    // If ship confirm only is disabled, we can add more responsibilities here
    if (!enableShipConfirmOnly) {
      // Add other LoadToDock related responsibilities as needed
      // loadToDockResponsibilities.push('OTHER_LOAD_TO_DOCK_API');
    }
    
    await refreshSpecificApis(loadToDockResponsibilities);
  }, [refreshSpecificApis, enableShipConfirmOnly]);

  /**
   * Refresh specific LoadToDock responsibilities
   */
  const refreshSpecificLoadToDockData = useCallback(async (responsibilities: string[]) => {
    console.log('Refreshing specific LoadToDock data:', responsibilities);
    await refreshSpecificApis(responsibilities);
  }, [refreshSpecificApis]);

  return {
    isRefreshing,
    refreshProgress,
    lastRefreshResults,
    refreshSummary,
    refreshShipConfirmData,
    refreshAllLoadToDockData,
    refreshSpecificLoadToDockData,
    cancelRefresh,
    getRefreshSummary,
    clearResults,
    retryFailedApis
  };
};
