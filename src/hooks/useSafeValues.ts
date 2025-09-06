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
    consolidatedApiRecords?: any[];
  }
) => {
  // Destructure to get primitive values for stable dependencies
  const selectedOrgId = routeParams.selectedOrgId;
  const responsibilities = routeParams.responsibilities;
  const defaultOrgId = routeParams.defaultOrgId;
  const overallProgress = data.overallProgress;
  const consolidatedApiRecords = data.consolidatedApiRecords;

  return useMemo(() => ({
    // Route parameters with safe fallbacks
    selectedOrgId: selectedOrgId || '',
    responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
    defaultOrgId: defaultOrgId || null,
    
    // Data with safe fallbacks
    overallProgress: overallProgress || { percentage: 0 },
    consolidatedApiRecords: consolidatedApiRecords || [],
  }), [
    selectedOrgId,
    responsibilities,
    defaultOrgId,
    overallProgress,
    consolidatedApiRecords
  ]);
};
