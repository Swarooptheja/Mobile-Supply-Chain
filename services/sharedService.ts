import { IApiRequestConfig, IApiResponse, ResultSet } from "./sharedService.interface";




export function getDataFromResultSet(resultSet: ResultSet[]): any[] {
    // Add safety checks for undefined or null resultSet
    if (!resultSet || !resultSet[0].rows.length) {
        console.warn('getDataFromResultSet: resultSet or resultSet.rows is undefined/null');
        return [];
    }
    
    const data: any[] = [];
    for (let i = 0; i < resultSet[0].rows.length; i++) {
        data.push(resultSet[0].rows.item(i));
    }
    return data;
}
// Dynamic API Service Function
export async function apiService<T = any>(
  url: string, 
  config: IApiRequestConfig
): Promise<IApiResponse<T>> {
  const { method, headers = {}, body, timeout = 150000 } = config;
  
  try {
    console.log(`Making API request to: ${url}`);
    console.log(`Request config:`, { method, headers, timeout });
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const requestConfig: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    };
    
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, requestConfig);
    
    // Clear timeout
    clearTimeout(timeoutId);
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    };
    
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      
      // Handle network-specific errors
      if (error.message.includes('Network request failed') || 
          error.message.includes('fetch') ||
          error.message.includes('Failed to fetch')) {
        throw new Error(`Network request failed. Please check your internet connection and try again. (${error.message})`);
      }
      
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred.');
  }
}

// Convenience methods for common HTTP methods
export const apiGet = <T = any>(url: string, headers?: Record<string, string>) =>
  apiService<T>(url, { method: 'GET', headers });

export const apiPost = <T = any>(url: string, body: any, headers?: Record<string, string>) =>
  apiService<T>(url, { method: 'POST', body, headers });

export const apiPut = <T = any>(url: string, body: any, headers?: Record<string, string>) =>
  apiService<T>(url, { method: 'PUT', body, headers });

export const apiDelete = <T = any>(url: string, headers?: Record<string, string>) =>
  apiService<T>(url, { method: 'DELETE', headers });

export const apiPatch = <T = any>(url: string, body: any, headers?: Record<string, string>) =>
  apiService<T>(url, { method: 'PATCH', body, headers });


export const getLocalTransactionId = () => {
  return `${Date.now() + Math.random()}`.split(".").join("");
}

/**
 * Get current server date with timezone offset
 * @param serverOffsetTime - Server timezone offset in minutes (default: -360 for -06:00)
 * @returns Formatted server date string in "dd-MMM-yyyy HH:mm:ss" format
 */
export const getCurrentServerDate = (serverOffsetTime: number = -360): string => {
  const currentDate = new Date();
  return formatDateWithTimezone(currentDate, serverOffsetTime);
}

/**
 * Format date with timezone offset
 * @param date - Date object to format
 * @param timezoneOffsetMinutes - Timezone offset in minutes (e.g., -360 for -06:00, 330 for +05:30)
 * @returns Formatted date string in "dd-MMM-yyyy HH:mm:ss" format
 */
export const formatDateWithTimezone = (date: Date, timezoneOffsetMinutes: number): string => {
  try {
    // Apply timezone offset directly using minutes
    const adjustedDate = new Date(date.getTime() + (timezoneOffsetMinutes * 60 * 1000));
    
    // Format the date
    const day = adjustedDate.getUTCDate().toString().padStart(2, '0');
    const month = adjustedDate.toLocaleDateString('en-US', { month: 'short' });
    const year = adjustedDate.getUTCFullYear();
    const hours = adjustedDate.getUTCHours().toString().padStart(2, '0');
    const mins = adjustedDate.getUTCMinutes().toString().padStart(2, '0');
    const secs = adjustedDate.getUTCSeconds().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${mins}:${secs}`;
  } catch (error) {
    console.error('Error formatting date with timezone:', error);
    // Fallback to simple date formatting
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}

