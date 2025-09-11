import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { LOGIN_QUERIES } from '../constants/queries';
import { getDataFromResultSet } from '../../services/sharedService';

interface UseUserResponsibilitiesReturn {
  responsibilities: string[];
  loading: boolean;
  error: string | null;
  refreshResponsibilities: () => Promise<void>;
}

export const useUserResponsibilities = (): UseUserResponsibilitiesReturn => {
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { defaultOrgId } = useAuth();

  const fetchResponsibilities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!defaultOrgId) {
        setError('Default organization ID not available');
        return;
      }

      // Query to get user responsibilities from login table
      const result = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_USER_RESPONSIBILITIES);
      
      if (!result) {
        setError('Failed to fetch user responsibilities');
        return;
      }

      const dataArray = getDataFromResultSet(result);
      
      if (!dataArray || !dataArray.length) {
        setError('No user responsibilities found');
        return;
      }

      // Extract responsibilities from the result
      const userResponsibilities = dataArray
        .map(row => row.RESPONSIBILITY)
        .filter(Boolean) // Remove null/undefined values
        .map(resp => {
          // Map responsibility names to API keys
          const responsibilityMap: Record<string, string> = {
            'SHIP CONFIRM': 'SHIP_CONFIRM',
          };
          
          return responsibilityMap[resp] || resp;
        });

      // Only log in development mode
      if (__DEV__) {
        console.log('User responsibilities loaded:', userResponsibilities.length, 'responsibilities');
      }
      setResponsibilities(userResponsibilities);
    } catch (err) {
      console.error('Error fetching user responsibilities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch responsibilities');
    } finally {
      setLoading(false);
    }
  }, [defaultOrgId]);

  const refreshResponsibilities = useCallback(async () => {
    await fetchResponsibilities();
  }, [fetchResponsibilities]);

  useEffect(() => {
    fetchResponsibilities();
  }, [fetchResponsibilities]);

  return {
    responsibilities,
    loading,
    error,
    refreshResponsibilities,
  };
};
