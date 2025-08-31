import { STATUS_COLORS, STATUS_ICONS, TYPE_COLORS, TYPE_ICONS, TYPE_DISPLAY_NAMES } from '../constants/activityConstants';

/**
 * Get the appropriate color for a given status
 */
export const getStatusColor = (status: string): string => {
  if (!status) return STATUS_COLORS.default;
  
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.default;
};

/**
 * Get the appropriate icon for a given status
 */
export const getStatusIcon = (status: string) => {
  if (!status) return STATUS_ICONS.default;
  
  return STATUS_ICONS[status as keyof typeof STATUS_ICONS] || STATUS_ICONS.default;
};

/**
 * Get the appropriate color for a given type
 */
export const getTypeColor = (type: string): string => {
  if (!type) return TYPE_COLORS.default;
  
  return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || TYPE_COLORS.default;
};

/**
 * Get the appropriate icon for a given type
 */
export const getTypeIcon = (type: string) => {
  if (!type) return TYPE_ICONS.default;
  
  return TYPE_ICONS[type as keyof typeof TYPE_ICONS] || TYPE_ICONS.default;
};

/**
 * Get the display name for a given type
 */
export const getTypeDisplayName = (type: string): string => {
  return TYPE_DISPLAY_NAMES[type as keyof typeof TYPE_DISPLAY_NAMES] || TYPE_DISPLAY_NAMES.default;
};

/**
 * Format last sync time for subtitle display
 */
export const formatLastSyncForSubtitle = (date: Date | null): string => {
  if (!date) return 'Never • v2.0';
  
  const timeString = date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  return `Last sync: ${timeString} • v2.0`;
};

/**
 * Calculate duration between start and end time
 */
export const calculateDuration = (startTime: string | null, endTime: string | null): string => {
  if (!startTime || !endTime) return '0s';
  
  try {
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    return `${(duration / 1000).toFixed(1)}s`;
  } catch (error) {
    return '0s';
  }
};

/**
 * Check if a card can be expanded
 */
export const canCardExpand = (hasError: boolean, hasPartialSuccess: boolean): boolean => {
  return hasError || hasPartialSuccess;
};

/**
 * Get overall status from a group of activities
 */
export const getOverallStatus = (groupActivities: any[]): string => {
  // Safety check: ensure groupActivities is valid
  if (!groupActivities || !Array.isArray(groupActivities) || groupActivities.length === 0) {
    return 'pending';
  }

  const hasSuccess = groupActivities.some(a => a.status === 'success');
  const hasError = groupActivities.some(a => a.status === 'error' || a.status === 'failure');
  const hasProcessing = groupActivities.some(a => a.status === 'processing');

  if (hasProcessing) return 'processing';
  if (hasError) return 'error';
  if (hasSuccess) return 'success';
  return 'pending';
};

/**
 * Correct records total for CONFIG APIs where the response structure might be misleading
 */
export const correctRecordsTotal = (
  totalRecords: number, 
  insertedRecords: number, 
  apiType: string
): number => {
  // Safety checks for input parameters
  const safeTotalRecords = totalRecords ?? 0;
  const safeInsertedRecords = insertedRecords ?? 0;
  const safeApiType = apiType || 'unknown';

  // Ensure we have valid numbers
  if (typeof safeTotalRecords !== 'number' || typeof safeInsertedRecords !== 'number') {
    return 0;
  }

  // Ensure values are non-negative
  const validTotalRecords = Math.max(0, safeTotalRecords);
  const validInsertedRecords = Math.max(0, safeInsertedRecords);

  if (validInsertedRecords > validTotalRecords && validInsertedRecords > 10) {
    if (safeApiType === 'config') {
      return validInsertedRecords;
    } else if (validInsertedRecords > validTotalRecords * 2) {
      return validInsertedRecords;
    }
  }
  return validTotalRecords;
};
