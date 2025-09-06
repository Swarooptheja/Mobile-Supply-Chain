import { useMemo } from 'react';
import { useActivityConsolidation } from './useActivityConsolidation';
import { IActivity } from '../types/activity';

/**
 * Consolidated hook for all activity-related data processing
 * This eliminates the need for multiple separate hooks and reduces redundant calculations
 * 
 * @param activities - Array of activities to process
 * @returns Object containing all processed activity data
 */
export const useActivityData = (activities: IActivity[]) => {
  // Call hooks first (Rules of Hooks requirement)
  const consolidated = useActivityConsolidation(activities);

  // Memoize computed values
  const computedValues = useMemo(() => ({
    hasErrors: consolidated.some(record => record.status === 'error'),
    hasFailures: consolidated.some(record => record.status === 'failure'),
    hasProcessing: consolidated.some(record => record.status === 'processing'),
    allSuccessful: consolidated.every(record => record.status === 'success'),
    failedCount: consolidated.filter(record => 
      record.status === 'error' || record.status === 'failure'
    ).length,
    processingCount: consolidated.filter(record => 
      record.status === 'processing'
    ).length,
    successCount: consolidated.filter(record => 
      record.status === 'success'
    ).length
  }), [consolidated]);

  return ({
    consolidated,
    ...computedValues
  });
};
