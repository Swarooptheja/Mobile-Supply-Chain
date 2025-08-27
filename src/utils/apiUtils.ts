import { ITableTypeApiResponse } from '../types/database';

/**
 * Detect if an API response is a TableType response
 * TableType responses are arrays where the first element is an array of column names
 * and subsequent elements are arrays of row data
 */
export const isTableTypeResponse = (response: any): boolean => {
  if (!Array.isArray(response) || response.length < 2) {
    return false;
  }

  const firstElement = response[0];
  if (!Array.isArray(firstElement) || firstElement.length === 0) {
    return false;
  }

  // Check if first element contains string values (column names)
  const hasStringColumns = firstElement.every((col: any) => typeof col === 'string');
  if (!hasStringColumns) {
    return false;
  }

  // Check if subsequent elements are arrays (row data)
  const hasArrayRows = response.slice(1).every((row: any) => Array.isArray(row));
  
  return hasArrayRows;
};

/**
 * Convert TableType API response to structured format
 * @param response - Raw API response array
 * @returns Structured TableType response with columns and rows
 */
export const parseTableTypeResponse = (response: any[]): ITableTypeApiResponse => {
  if (!isTableTypeResponse(response)) {
    throw new Error('Invalid TableType response format');
  }

  const columns = response[0] as string[];
  const rows = response.slice(1) as any[][];

  return {
    columns,
    rows,
  };
};

/**
 * Detect API response type and return appropriate processor
 * @param response - Raw API response
 * @returns Object indicating response type and parsed data
 */
export const detectApiResponseType = (response: any) => {
  if (isTableTypeResponse(response)) {
    return {
      type: 'tableType' as const,
      data: parseTableTypeResponse(response),
    };
  }

  // Default to JSON type (existing implementation)
  return {
    type: 'json' as const,
    data: response,
  };
};
