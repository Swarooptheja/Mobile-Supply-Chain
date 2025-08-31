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

      // Get the most recent successful activity for accurate record counts
      const mostRecentSuccessful = groupActivities
        .filter(a => a.status === 'success')
        .sort((a, b) => {
          const timeA = a.endTime ? new Date(a.endTime).getTime() : 0;
          const timeB = b.endTime ? new Date(b.endTime).getTime() : 0;
          return timeB - timeA; // Most recent first
        })[0];

      // Use the most recent successful activity for record counts, or the latest activity if no success
      const latestActivity = groupActivities
        .sort((a, b) => {
          const timeA = a.endTime ? new Date(a.endTime).getTime() : (a.startTime ? new Date(a.startTime).getTime() : 0);
          const timeB = b.endTime ? new Date(b.endTime).getTime() : (b.startTime ? new Date(b.startTime).getTime() : 0);
          return timeB - timeA; // Most recent first
        })[0];

      // Use successful activity for records if available, otherwise use latest
      const recordSource = mostRecentSuccessful || latestActivity;
      
      // Get accurate record counts from the source activity with safe fallbacks
      const totalRecords = recordSource?.recordsTotal ?? 0;
      const insertedRecords = recordSource?.recordsInserted ?? 0;

      // Fix for CONFIG APIs where recordsTotal might be incorrect (showing 1)
      const correctedTotalRecords = correctRecordsTotal(totalRecords, insertedRecords, groupActivities[0]?.type || 'unknown');

      // Get latest sync time with safe defaults
      const lastSyncTime = groupActivities
        .filter(a => a.startTime)
        .sort((a, b) => new Date(b.startTime!).getTime() - new Date(a.startTime!).getTime())[0]?.startTime || null;

      // Get latest error with safe defaults
      const error = groupActivities
        .filter(a => a.error)
        .sort((a, b) => new Date(b.endTime || 0).getTime() - new Date(a.endTime || 0).getTime())[0]?.error || null;

      // Get max retry count with safe defaults
      const retryCount = Math.max(...groupActivities.map(a => a.retryCount ?? 0));

      // Get latest retry time with safe defaults
      const lastRetryTime = groupActivities
        .filter(a => a.lastRetryTime)
        .sort((a, b) => new Date(b.lastRetryTime!).getTime() - new Date(a.lastRetryTime!).getTime())[0]?.lastRetryTime;

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
      };
    });
  }, [activities]);
};
