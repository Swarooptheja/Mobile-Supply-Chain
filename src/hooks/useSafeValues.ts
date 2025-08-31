import { useMemo } from 'react';

/**
 * Custom hook to provide safe fallback values for route parameters and data
 * This eliminates the need for multiple useMemo calls in the main component
 * 
 * @param routeParams - Route parameters from navigation
 * @param data - Data objects that might be null/undefined
 * @returns Object with safe fallback values
 */
export const useSafeValues = (
  routeParams: {
    selectedOrgId?: string;
    responsibilities?: any[];
    defaultOrgId?: string | null;
  },
  data: {
    overallProgress?: { percentage: number };
    statistics?: { completed: number; failed: number; total: number; processing: number };
    totalRecordsCount?: number;
    consolidatedApiRecords?: any[];
  }
) => {
  return useMemo(() => ({
    // Route parameters with safe fallbacks
    selectedOrgId: routeParams.selectedOrgId || '',
    responsibilities: Array.isArray(routeParams.responsibilities) ? routeParams.responsibilities : [],
    defaultOrgId: routeParams.defaultOrgId || null,
    
    // Data with safe fallbacks
    overallProgress: data.overallProgress || { percentage: 0 },
    statistics: data.statistics || { completed: 0, failed: 0, total: 0, processing: 0 },
    totalRecordsCount: data.totalRecordsCount || 0,
    consolidatedApiRecords: data.consolidatedApiRecords || [],
  }), [routeParams, data]);
};
