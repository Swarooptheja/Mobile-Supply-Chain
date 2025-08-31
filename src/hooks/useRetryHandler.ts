import { useCallback } from 'react';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';

/**
 * Custom hook to handle retry operations for failed APIs
 * This consolidates retry logic and error handling that was duplicated
 * 
 * @param addApiAttempt - Function to track retry attempts
 * @param removeApiAttempt - Function to clear retry tracking
 * @param retryFailedApis - Function to retry failed APIs
 * @returns Object with retry handler functions
 */
export const useRetryHandler = (
  addApiAttempt: (id: string) => void,
  removeApiAttempt: (id: string) => void,
  retryFailedApis: (activityIds?: string[]) => Promise<void>
) => {
  const { showError, showWarning } = useAttractiveNotification();

  /**
   * Retry all failed APIs
   * @param failedRecords - Array of failed API records
   */
  const handleRetryAllFailed = useCallback(async (failedRecords: any[]) => {
    if (failedRecords.length === 0) {
      showWarning('No Failed APIs', 'No APIs are currently in failed state');
      return;
    }

    try {
      // Get all activity IDs from failed records
      const failedActivityIds = failedRecords.flatMap(record => 
        record.activities.map((a: any) => a.id)
      );

      // Track retry attempts to prevent multiple calls
      failedActivityIds.forEach(id => addApiAttempt(id));

      await retryFailedApis();
      
      // Clear retry tracking after successful retry
      setTimeout(() => {
        failedActivityIds.forEach(id => removeApiAttempt(id));
      }, 1000);

    } catch (error) {
      showError('Retry Failed', 'Failed to retry failed APIs');
    }
  }, [addApiAttempt, removeApiAttempt, retryFailedApis, showError, showWarning]);

  /**
   * Retry a specific API record
   * @param record - The API record to retry
   * @param isApiAttempting - Function to check if API is already being retried
   */
  const handleIndividualRetry = useCallback(async (
    record: any, 
    isApiAttempting: (id: string) => boolean
  ) => {
    // Prevent multiple retry attempts for the same API
    if (isApiAttempting(record.id)) {
      showWarning('Retry in Progress', 'This API is already being retried. Please wait.');
      return;
    }

    try {
      // Track this retry attempt
      addApiAttempt(record.id);

      // Retry all activities for this API
      const activityIds = record.activities.map((a: any) => a.id);
      await retryFailedApis(activityIds);
      
      // Clear retry tracking after successful retry
      setTimeout(() => {
        removeApiAttempt(record.id);
      }, 1000);

    } catch (error) {
      showError('Retry Failed', 'Failed to retry this API');
      // Clear retry tracking on error
      removeApiAttempt(record.id);
    }
  }, [addApiAttempt, removeApiAttempt, retryFailedApis, showError, showWarning]);

  return {
    handleRetryAllFailed,
    handleIndividualRetry,
  };
};
