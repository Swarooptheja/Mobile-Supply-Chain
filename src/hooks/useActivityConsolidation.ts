import { useMemo } from 'react';
import { IActivity } from '../types/activity';
import { getOverallStatus, correctRecordsTotal } from '../utils/activityHelper';

export interface ConsolidatedApiRecord {
  id: string;
  name: string;
  type: string;
  status: string;
  totalRecords: number;
  insertedRecords: number;
  lastSyncTime: Date | null;
  error: string | null;
  retryCount: number;
  lastRetryTime: Date | undefined;
  canExpand: boolean;
  activities: IActivity[];
  apiName: string;
}

export const useActivityConsolidation = (activities: IActivity[]): ConsolidatedApiRecord[] => {
  return useMemo((): ConsolidatedApiRecord[] => {
    // Safety check: ensure activities is defined and is an array
    if (!activities || !Array.isArray(activities) || activities.length === 0) {
      return [];
    }

    const apiGroups = new Map<string, IActivity[]>();
    
    // Group activities by API name
    activities.forEach(activity => {
      const key = activity.name || 'Unknown API';
      if (!apiGroups.has(key)) {
        apiGroups.set(key, []);
      }
      apiGroups.get(key)!.push(activity);
    });

    // Create consolidated records
    return Array.from(apiGroups.entries()).map(([name, groupActivities]) => {
      // Determine overall status
      const overallStatus = getOverallStatus(groupActivities);

      // Pre-calculate and cache expensive operations to avoid repeated calculations
      const activitiesWithTimestamps = groupActivities.map(activity => ({
        ...activity,
        endTimeStamp: activity.endTime ? new Date(activity.endTime).getTime() : 0,
        startTimeStamp: activity.startTime ? new Date(activity.startTime).getTime() : 0,
        lastRetryTimeStamp: activity.lastRetryTime ? new Date(activity.lastRetryTime).getTime() : 0
      }));

      // Get the most recent successful activity for accurate record counts
      const mostRecentSuccessful = activitiesWithTimestamps
        .filter(a => a.status === 'success')
        .sort((a, b) => b.endTimeStamp - a.endTimeStamp)[0];

      // Use the most recent successful activity for record counts, or the latest activity if no success
      const latestActivity = activitiesWithTimestamps
        .sort((a, b) => Math.max(b.endTimeStamp, b.startTimeStamp) - Math.max(a.endTimeStamp, a.startTimeStamp))[0];

      // Use successful activity for records if available, otherwise use latest
      const recordSource = mostRecentSuccessful || latestActivity;
      
      // Get accurate record counts from the source activity with safe fallbacks
      const totalRecords = recordSource?.recordsTotal ?? 0;
      const insertedRecords = recordSource?.recordsInserted ?? 0;

      // Fix for CONFIG APIs where recordsTotal might be incorrect (showing 1)
      const correctedTotalRecords = correctRecordsTotal(totalRecords, insertedRecords, groupActivities[0]?.type || 'unknown');

      // Get latest sync time with safe defaults
      const lastSyncTime = activitiesWithTimestamps
        .filter(a => a.startTimeStamp > 0)
        .sort((a, b) => b.startTimeStamp - a.startTimeStamp)[0]?.startTime || null;

      // Get latest error with safe defaults
      const error = activitiesWithTimestamps
        .filter(a => a.error)
        .sort((a, b) => b.endTimeStamp - a.endTimeStamp)[0]?.error || null;

      // Get max retry count with safe defaults
      const retryCount = Math.max(...activitiesWithTimestamps.map(a => a.retryCount ?? 0));

      // Get latest retry time with safe defaults
      const lastRetryTime = activitiesWithTimestamps
        .filter(a => a.lastRetryTimeStamp > 0)
        .sort((a, b) => b.lastRetryTimeStamp - a.lastRetryTimeStamp)[0]?.lastRetryTime;

      // Determine if can expand (show error details)
      // Cards can expand if they have errors OR if they have partial success (some records inserted but also some failures)
      const hasPartialSuccess = groupActivities.some(a => a.status === 'success') && groupActivities.some(a => a.status === 'error' || a.status === 'failure');
      const canExpand = groupActivities.some(a => a.status === 'error' || a.status === 'failure') || hasPartialSuccess;

      return {
        id: `consolidated_${name}`,
        name: name || 'Unknown API',
        type: groupActivities[0]?.type || 'unknown',
        status: overallStatus || 'unknown',
        totalRecords: correctedTotalRecords || 0,
        insertedRecords: insertedRecords || 0,
        lastSyncTime: lastSyncTime ? new Date(lastSyncTime) : null,
        error: error || null,
        retryCount: retryCount || 0,
        lastRetryTime,
        canExpand: canExpand || false,
        activities: groupActivities,
        apiName: groupActivities[0]?.apiName || ''
      };
    });
  }, [activities]);
};
