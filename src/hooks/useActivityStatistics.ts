import { useMemo } from 'react';
import { ConsolidatedApiRecord } from './useActivityConsolidation';

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
