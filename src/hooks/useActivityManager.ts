import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { ActivityService } from '../services/activityService';
import { IActivity, IActivityStatus, IApiType, IActivityProgress, IActivityBatchResult } from '../types/activity';
import { ACTIVITY_CONSTANTS } from '../constants/activityConstants';

interface UseActivityManagerReturn {
  activities: IActivity[];
  isProcessing: boolean;
  overallProgress: IActivityProgress;
  canProceedToDashboard: boolean;
  startActivityProcess: (orgId: string, responsibilities: string[], defaultOrgId: string | null) => Promise<void>;
  retryFailedApis: (activityIds?: string[]) => Promise<void>;
  clearErrors: () => void;
  cancelProcess: () => void;
  getBatchResult: () => IActivityBatchResult;
  updateActivityStatus: (activityId: string, updates: Partial<IActivity>) => void;
  updateMultipleActivityStatuses: (updates: Array<{ id: string; updates: Partial<IActivity> }>) => void;
}

const { MAX_RETRY_ATTEMPTS, RETRY_DELAY_MS, API_TIMEOUT_MS } = ACTIVITY_CONSTANTS;

export const useActivityManager = (): UseActivityManagerReturn => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showError, showSuccess, showWarning } = useAttractiveNotification();
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Track which APIs have been called to ensure single calls
  const calledApis = useRef<Set<string>>(new Set());

  // Memoized computed values for performance
  const overallProgress = useMemo((): IActivityProgress => {
    if (!activities || activities.length === 0) {
      return { current: 0, total: 0, percentage: 0 };
    }

    const total = activities.length;
    const current = activities.filter(activity => 
      activity.status === 'success' || activity.status === 'error' || activity.status === 'failure'
    ).length;

    // Ensure we don't get NaN or invalid values
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    
    // Ensure percentage is within valid bounds
    const safePercentage = Math.max(0, Math.min(100, percentage));

    return {
      current: current ?? 0,
      total: total ?? 0,
      percentage: safePercentage,
    };
  }, [activities]);

  // Check if user can proceed to dashboard based on dependency rules
  const canProceedToDashboard = useMemo(() => {
    return ActivityService.canProceedToDashboard(activities);
  }, [activities]);

  const updateActivityStatus = useCallback((
    activityId: string, 
    updates: Partial<IActivity>
  ) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        // Ensure critical fields are never null/undefined and are safe for rendering
        const safeUpdates = {
          ...updates,
          name: updates.name || activity.name || 'Unknown API',
          type: updates.type || activity.type || 'unknown',
          status: updates.status || activity.status || 'pending',
          error: updates.error !== undefined ? (updates.error || 'Unknown error') : activity.error,
          // Only update records if explicitly provided, preserve existing values otherwise
          recordsTotal: updates.recordsTotal !== undefined ? updates.recordsTotal : activity.recordsTotal,
          recordsInserted: updates.recordsInserted !== undefined ? updates.recordsInserted : activity.recordsInserted,
          progress: updates.progress !== undefined ? Math.max(0, Math.min(100, updates.progress || 0)) : (activity.progress || 0),
          retryCount: updates.retryCount !== undefined ? (updates.retryCount || 0) : (activity.retryCount || 0),
          startTime: updates.startTime || activity.startTime,
          endTime: updates.endTime || activity.endTime,
          lastRetryTime: updates.lastRetryTime || activity.lastRetryTime,
          canExpand: updates.canExpand !== undefined ? updates.canExpand : activity.canExpand,
          orgId: updates.orgId || activity.orgId,
          defaultOrgId: updates.defaultOrgId || activity.defaultOrgId,
          apiName: updates.apiName || activity.apiName,
        };
        return { ...activity, ...safeUpdates };
      }
      return activity;
    }));
  }, []);

  /**
   * Batch update multiple activities at once to reduce re-renders
   * This is more efficient than calling updateActivityStatus multiple times
   */
  const updateMultipleActivityStatuses = useCallback((
    updates: Array<{ id: string; updates: Partial<IActivity> }>
  ) => {
    if (updates.length === 0) return;
    
    setActivities(prev => {
      const updatesMap = new Map(updates.map(u => [u.id, u.updates]));
      return prev.map(activity => {
        if (updatesMap.has(activity.id)) {
          const update = updatesMap.get(activity.id)!;
          // Apply the same safety logic as single update
          const safeUpdates = {
            ...update,
            name: update.name || activity.name || 'Unknown API',
            type: update.type || activity.type || 'unknown',
            status: update.status || activity.status || 'pending',
            error: update.error !== undefined ? (update.error || 'Unknown error') : activity.error,
            recordsTotal: update.recordsTotal !== undefined ? update.recordsTotal : activity.recordsTotal,
            recordsInserted: update.recordsInserted !== undefined ? update.recordsInserted : activity.recordsInserted,
            progress: update.progress !== undefined ? Math.max(0, Math.min(100, update.progress || 0)) : (activity.progress || 0),
            retryCount: update.retryCount !== undefined ? (update.retryCount || 0) : (activity.retryCount || 0),
            startTime: update.startTime || activity.startTime,
            endTime: update.endTime || activity.endTime,
            lastRetryTime: update.lastRetryTime || activity.lastRetryTime,
            canExpand: update.canExpand !== undefined ? update.canExpand : activity.canExpand,
            orgId: update.orgId || activity.orgId,
            defaultOrgId: update.defaultOrgId || activity.defaultOrgId,
          };
          return { ...activity, ...safeUpdates };
        }
        return activity;
      });
    });
  }, []);

  const createActivitiesFromResponsibilities = useCallback((
    responsibilities: string[]
  ): IActivity[] => {
    console.log('Creating activities from responsibilities:', responsibilities);
    
    if (!responsibilities || responsibilities.length === 0) {
      console.warn('No responsibilities provided, returning empty activities array');
      return [];
    }

    // Get API configurations
    const masterApis = ActivityService.getMasterApis(responsibilities);
    const configApis = ActivityService.getConfigApis(responsibilities);
    const transactionalApis = ActivityService.getTransactionalApis(responsibilities);

    console.log('API configurations:', {
      master: masterApis.length,
      config: configApis.length,
      transactional: transactionalApis.length
    });

    // Create activities with safe default values
    return [
      ...masterApis.map((api, index) => ({
        id: `master_${api.responsibility || 'unknown'}_${index}`,
        name: api.responsibility || 'Unknown Master API',
        type: 'master' as IApiType,
        url: api.url || '',
        status: 'pending' as IActivityStatus,
        progress: 0,
        recordsTotal: 0, // Start as 0, will be updated when API returns data
        recordsInserted: 0, // Start as 0, will be updated when API returns data
        error: null,
        startTime: null,
        endTime: null,
        canExpand: false,
        retryCount: 0,
        lastRetryTime: undefined,
        orgId: api.requiresOrgId ? 'pending' : undefined,
        defaultOrgId: api.requiresDefaultOrgId ? 'pending' : undefined,
        apiName: api.apiName,
      })),
      ...configApis.map((api, index) => ({
        id: `config_${api.responsibility || 'unknown'}_${index}`,
        name: api.responsibility || 'Unknown Config API',
        type: 'config' as IApiType,
        url: api.url || '',
        status: 'pending' as IActivityStatus,
        progress: 0,
        recordsTotal: 0, // Start as 0, will be updated when API returns data
        recordsInserted: 0, // Start as 0, will be updated when API returns data
        error: null,
        startTime: null,
        endTime: null,
        canExpand: false,
        retryCount: 0,
        lastRetryTime: undefined,
        orgId: api.requiresOrgId ? 'pending' : undefined,
        defaultOrgId: api.requiresDefaultOrgId ? 'pending' : undefined,
        apiName: api.apiName,
      })),
      ...transactionalApis.map((api, index) => ({
        id: `transactional_${api.responsibility || 'unknown'}_${index}`,
        name: api.responsibility || 'Unknown Transactional API',
        type: 'transactional' as IApiType,
        url: api.url || '',
        status: 'pending' as IActivityStatus,
        progress: 0,
        recordsTotal: 0, // Start as 0, will be updated when API returns data
        recordsInserted: 0, // Start as 0, will be updated when API returns data
        error: null,
        startTime: null,
        endTime: null,
        canExpand: false,
        retryCount: 0,
        lastRetryTime: undefined,
        orgId: api.requiresOrgId ? 'pending' : undefined,
        defaultOrgId: api.requiresDefaultOrgId ? 'pending' : undefined,
        apiName: api.apiName,
      })),
    ];
  }, []);

  const processApiGroup = useCallback(async (
    groupActivities: IActivity[], 
    orgId: string, 
    defaultOrgId: string | null
  ): Promise<void> => {
    console.log('Processing API group concurrently:', {
      count: groupActivities.length,
      orgId,
      defaultOrgId,
      activities: groupActivities.map(a => ({ name: a.name, type: a.type }))
    });
    
    // Filter out already called APIs
    const uncalledActivities = groupActivities.filter(activity => 
      !calledApis.current.has(activity.id)
    );

    if (!uncalledActivities.length) {
      console.log('All APIs in this group have already been called');
      return;
    }

    // Mark all APIs as called upfront to prevent duplicate calls
    uncalledActivities.forEach(activity => {
      calledApis.current.add(activity.id);
    });

    // Update all activities to processing status
    uncalledActivities.forEach(activity => {
      updateActivityStatus(activity.id, { 
        status: 'processing', 
        startTime: new Date(),
        progress: 0,
        error: null,
        orgId: orgId,
        defaultOrgId: defaultOrgId,
      });
    });

    try {
      // Process all APIs concurrently using Promise.all
      const apiPromises = uncalledActivities.map(async (activity) => {
        // Ensure activity has valid values before processing
        if (!activity.name || !activity.url) {
          console.error(`Invalid activity data:`, activity);
          return {
            activityId: activity.id,
            success: false,
            error: 'Invalid activity configuration',
            recordsTotal: 0,
            recordsInserted: 0
          };
        }

        try {
          // Process the API with timeout
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('API request timed out')), API_TIMEOUT_MS);
          });

          const apiPromise = ActivityService.processApi(
            activity.name,
            orgId,
            defaultOrgId,
            abortControllerRef.current?.signal
          );

          const result = await Promise.race([apiPromise, timeoutPromise]);

          if (result.success) {
            console.log(`API ${activity.name} succeeded:`, {
              recordsTotal: result.recordsTotal,
              recordsInserted: result.recordsInserted,
              type: activity.type
            });
            
            return {
              activityId: activity.id,
              success: true,
              error: null,
              recordsTotal: result.recordsTotal,
              recordsInserted: result.recordsInserted
            };
          } else {
            return {
              activityId: activity.id,
              success: false,
              error: result.error || 'API processing failed',
              recordsTotal: 0,
              recordsInserted: 0
            };
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error processing API ${activity.name}:`, error);
          
          // Check if it's a timeout error
          if (errorMessage.includes('timed out')) {
            return {
              activityId: activity.id,
              success: false,
              error: `API request timed out after ${API_TIMEOUT_MS / 1000} seconds. Please check your connection and try again.`,
              recordsTotal: 0,
              recordsInserted: 0
            };
          } else if (errorMessage.includes('Network request failed') || errorMessage.includes('fetch')) {
            return {
              activityId: activity.id,
              success: false,
              error: 'Network connection failed. Please check your internet connection and try again.',
              recordsTotal: 0,
              recordsInserted: 0
            };
          } else {
            return {
              activityId: activity.id,
              success: false,
              error: errorMessage,
              recordsTotal: 0,
              recordsInserted: 0
            };
          }
        }
      });

      // Wait for all APIs to complete
      const results = await Promise.all(apiPromises);

      // Update all activities with their results
      results.forEach(result => {
        if (result.success) {
          updateActivityStatus(result.activityId, {
            status: 'success',
            progress: 100,
            recordsTotal: result.recordsTotal,
            recordsInserted: result.recordsInserted,
            endTime: new Date(),
            canExpand: false,
          });
        } else {
          updateActivityStatus(result.activityId, {
            status: 'error',
            progress: 0,
            error: result.error,
            endTime: new Date(),
            canExpand: true,
          });
        }
      });

      console.log(`Completed processing ${results.length} APIs concurrently`);

    } catch (error) {
      console.error('Error in concurrent API processing:', error);
      // If there's a catastrophic error, mark all processing activities as failed
      uncalledActivities.forEach(activity => {
        updateActivityStatus(activity.id, {
          status: 'error',
          progress: 0,
          error: 'Concurrent processing failed',
          endTime: new Date(),
          canExpand: true,
        });
      });
    }
  }, [updateActivityStatus]);

  const startActivityProcess = useCallback(async (
    orgId: string, 
    responsibilities: string[], 
    defaultOrgId: string | null
  ): Promise<void> => {
    console.log('Starting activity process with:', { orgId, responsibilities, defaultOrgId });
    
    if (isProcessing) {
      showWarning('Process Already Running', 'Another synchronization process is already in progress');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Reset called APIs tracking
      calledApis.current.clear();
      
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();
      
      // Initialize activities
      const initialActivities = createActivitiesFromResponsibilities(responsibilities);
      setActivities(initialActivities);

      if (!initialActivities.length) {
        showWarning('No APIs to Process', 'No APIs found for the selected responsibilities');
        return;
      }

      // showSuccess('Starting Synchronization', `Processing ${initialActivities.length} APIs`);

      // Log activity details for debugging
      console.log('Activities to process:', initialActivities.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        url: a.url,
        requiresOrgId: a.orgId === 'pending',
        requiresDefaultOrgId: a.defaultOrgId === 'pending'
      })));

      // Process master APIs first
      const masterActivities = initialActivities.filter(a => a.type === 'master');
      if (masterActivities.length) {
        console.log(`Processing ${masterActivities.length} master APIs...`);
        await processApiGroup(masterActivities, orgId, defaultOrgId);
        
        // Check if any master APIs failed - if so, stop the process
        const masterFailed = masterActivities.some(a => a.status === 'error' || a.status === 'failure');
        if (masterFailed) {
          const failedApis = masterActivities.filter(a => a.status === 'error' || a.status === 'failure');
          console.error('Master APIs failed:', failedApis.map(a => ({ name: a.name, error: a.error })));
          showWarning('Master APIs Failed', 'Some master APIs failed. Process stopped. Please retry failed APIs.');
          return;
        }
      }
      
      // Process config APIs
      const configActivities = initialActivities.filter(a => a.type === 'config');
      if (configActivities.length) {
        console.log(`Processing ${configActivities.length} config APIs...`);
        await processApiGroup(configActivities, orgId, defaultOrgId);
        
        // Check if any config APIs failed - if so, stop the process
        const configFailed = configActivities.some(a => a.status === 'error' || a.status === 'failure');
        if (configFailed) {
          const failedApis = configActivities.filter(a => a.status === 'error' || a.status === 'failure');
          console.error('Config APIs failed:', failedApis.map(a => ({ name: a.name, error: a.error })));
          showWarning('Config APIs Failed', 'Some config APIs failed. Process stopped. Please retry failed APIs.');
          return;
        }
      }
      
      // Process transactional APIs only if all master and config APIs succeeded
      const transactionalActivities = initialActivities.filter(a => a.type === 'transactional');
      if (transactionalActivities.length > 0) {
        console.log(`Processing ${transactionalActivities.length} transactional APIs...`);
        await processApiGroup(transactionalActivities, orgId, defaultOrgId);
      }

      // Check final status
      const currentActivities = activities.length > 0 ? activities : initialActivities;
      const allSuccessful = currentActivities.every(activity => activity.status === 'success');
      const hasErrors = currentActivities.some(activity => activity.status === 'error');
      const hasFailures = currentActivities.some(activity => activity.status === 'failure');

      if (allSuccessful) {
        showSuccess('Synchronization Complete', 'All APIs processed successfully');
      } else if (hasErrors || hasFailures) {
        const failedActivities = currentActivities.filter(a => 
          a.status === 'error' || a.status === 'failure'
        );
        const failedCount = failedActivities.length;
        
        // Check if any failed due to timeout
        const timeoutErrors = failedActivities.filter(a => 
          a.error && a.error.includes('timed out')
        );
        
        if (timeoutErrors.length > 0) {
          showWarning(
            'Synchronization Incomplete', 
            `${failedCount} APIs failed (${timeoutErrors.length} due to timeout). Please check your connection and retry.`
          );
        } else {
          showWarning('Synchronization Incomplete', `${failedCount} APIs failed. You can retry them.`);
        }
      }

    } catch (error) {
      console.error('Activity process failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showError('Synchronization Failed', `Failed to complete data synchronization: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isProcessing, 
    createActivitiesFromResponsibilities, 
    processApiGroup, 
    activities,
    showWarning,
    showSuccess,
    showError
  ]);

  const retryFailedApis = useCallback(async (activityIds?: string[]) => {
    const failedActivities = activities.filter(activity => 
      (activityIds ? activityIds.includes(activity.id) : true) && 
      (activity.status === 'error' || activity.status === 'failure')
    );

    if (failedActivities.length === 0) {
      showWarning('No Failed APIs', 'No APIs are currently in failed state');
      return;
    }

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Add delay before retry to prevent rapid retries
    await new Promise<void>(resolve => {
      retryTimeoutRef.current = setTimeout(resolve, RETRY_DELAY_MS);
    });

    // Check retry limits first
    const retryableActivities = failedActivities.filter(activity => 
      activity.retryCount < MAX_RETRY_ATTEMPTS
    );

    const maxRetryExceeded = failedActivities.filter(activity => 
      activity.retryCount >= MAX_RETRY_ATTEMPTS
    );

    // Mark activities that exceeded retry limit
    maxRetryExceeded.forEach(activity => {
      updateActivityStatus(activity.id, {
        status: 'failure',
        error: `Maximum retry attempts (${MAX_RETRY_ATTEMPTS}) exceeded`,
        canExpand: true,
      });
    });

    if (retryableActivities.length === 0) {
      showWarning('No Retryable APIs', 'All failed APIs have exceeded retry limits');
      return;
    }

    // Update all retryable activities to processing status
    retryableActivities.forEach(activity => {
      updateActivityStatus(activity.id, { 
        status: 'processing', 
        error: null,
        startTime: new Date(),
        progress: 0,
        retryCount: activity.retryCount + 1,
        lastRetryTime: new Date(),
        // Preserve the original record counts - don't reset them
        recordsTotal: activity.recordsTotal,
        recordsInserted: activity.recordsInserted,
      });
    });

    try {
      // Process all retryable APIs concurrently using Promise.all
      const retryPromises = retryableActivities.map(async (activity) => {
        try {
          const result = await ActivityService.processApi(
            activity.name,
            activity.orgId || '',
            activity.defaultOrgId || undefined
          );

          if (result.success) {
            console.log(`Retry API ${activity.name} succeeded:`, {
              recordsTotal: result.recordsTotal,
              recordsInserted: result.recordsInserted,
              type: activity.type,
              retryCount: activity.retryCount + 1
            });
            
            return {
              activityId: activity.id,
              success: true,
              error: null,
              recordsTotal: result.recordsTotal,
              recordsInserted: result.recordsInserted
            };
          } else {
            return {
              activityId: activity.id,
              success: false,
              error: result.error || 'API processing failed',
              recordsTotal: 0,
              recordsInserted: 0
            };
          }
        } catch (error) {
          return {
            activityId: activity.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            recordsTotal: 0,
            recordsInserted: 0
          };
        }
      });

      // Wait for all retries to complete
      const results = await Promise.all(retryPromises);

      // Update all activities with their retry results
      results.forEach(result => {
        if (result.success) {
          updateActivityStatus(result.activityId, {
            status: 'success',
            progress: 100,
            recordsTotal: result.recordsTotal,
            recordsInserted: result.recordsInserted,
            endTime: new Date(),
            canExpand: false,
          });
        } else {
          updateActivityStatus(result.activityId, {
            status: 'error',
            progress: 0,
            error: result.error,
            endTime: new Date(),
            canExpand: true,
          });
        }
      });

      console.log(`Completed retrying ${results.length} APIs concurrently`);
      showSuccess('Retry Complete', `Retried ${results.length} failed APIs`);

    } catch (error) {
      console.error('Error in concurrent retry processing:', error);
      // If there's a catastrophic error, mark all processing activities as failed
      retryableActivities.forEach(activity => {
        updateActivityStatus(activity.id, {
          status: 'error',
          progress: 0,
          error: 'Retry processing failed',
          endTime: new Date(),
          canExpand: true,
        });
      });
      showError('Retry Failed', 'Failed to retry APIs due to processing error');
    }
  }, [
    activities, 
    updateActivityStatus, 
    showWarning,
    showSuccess,
    showError
  ]);

  const clearErrors = useCallback(() => {
    setActivities(prev => prev.map(activity => 
      activity.status === 'error' || activity.status === 'failure'
        ? { ...activity, error: null, canExpand: false }
        : activity
    ));
  }, []);

  const cancelProcess = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setIsProcessing(false);
    
    // Mark all processing activities as cancelled
    setActivities(prev => prev.map(activity => 
      activity.status === 'processing'
        ? { ...activity, status: 'pending', progress: 0, error: 'Process cancelled by user' }
        : activity
    ));

    showWarning('Process Cancelled', 'Data synchronization process has been cancelled');
  }, [showWarning]);

  const getBatchResult = useCallback((): IActivityBatchResult => {
    const successful = activities.filter(a => a.status === 'success');
    const failed = activities.filter(a => a.status === 'error' || a.status === 'failure');
    const blocked = activities.filter(a => a.status === 'blocked');

    return { successful, failed, blocked };
  }, [activities]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  // Cleanup effect
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    activities,
    isProcessing,
    overallProgress,
    canProceedToDashboard,
    startActivityProcess,
    retryFailedApis,
    clearErrors,
    cancelProcess,
    getBatchResult,
    updateActivityStatus,
    updateMultipleActivityStatuses,
  };
};
