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
  const { method, headers = {}, body, timeout = 30000 } = config;
  
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