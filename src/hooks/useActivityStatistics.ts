import { useMemo } from 'react';
import { ConsolidatedApiRecord } from './useActivityConsolidation';

export interface ActivityStatistics {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  processing: number;
}

export const useActivityStatistics = (consolidatedApiRecords: ConsolidatedApiRecord[]): ActivityStatistics => {
  return useMemo((): ActivityStatistics => {
    // Safety check: ensure consolidatedApiRecords is defined and is an array
    if (!consolidatedApiRecords || !Array.isArray(consolidatedApiRecords)) {
      return { total: 0, completed: 0, failed: 0, pending: 0, processing: 0 };
    }

    const total = consolidatedApiRecords.length;
    const completed = consolidatedApiRecords.filter(a => a.status === 'success').length;
    const failed = consolidatedApiRecords.filter(a => a.status === 'error' || a.status === 'failure').length;
    const pending = consolidatedApiRecords.filter(a => a.status === 'pending').length;
    const processing = consolidatedApiRecords.filter(a => a.status === 'processing').length;

    return { 
      total: total ?? 0, 
      completed: completed ?? 0, 
      failed: failed ?? 0, 
      pending: pending ?? 0, 
      processing: processing ?? 0 
    };
  }, [consolidatedApiRecords]);
};

/**
 * Calculate total records count across all APIs
 */
export const useTotalRecordsCount = (consolidatedApiRecords: ConsolidatedApiRecord[]): number => {
  return useMemo(() => {
    if (!consolidatedApiRecords || !Array.isArray(consolidatedApiRecords)) return 0;
    return consolidatedApiRecords.reduce((total, record) => total + (record.insertedRecords ?? 0), 0);
  }, [consolidatedApiRecords]);
};

/**
 * Get the most recent sync time for subtitle display
 */
export const useLastSyncTimeForSubtitle = (consolidatedApiRecords: ConsolidatedApiRecord[]): Date | null => {
  return useMemo(() => {
    if (!consolidatedApiRecords || !Array.isArray(consolidatedApiRecords)) return null;
    
    const allSyncTimes = consolidatedApiRecords
      .filter(record => record.lastSyncTime)
      .map(record => record.lastSyncTime!)
      .sort((a, b) => b.getTime() - a.getTime());
    
    return allSyncTimes[0] || null;
  }, [consolidatedApiRecords]);
};
