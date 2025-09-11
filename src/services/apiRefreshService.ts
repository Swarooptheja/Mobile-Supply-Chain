import { IApiResult } from '../types/activity';
import { apiService } from '../../services/sharedService';
import { getCurrentApiConfig } from '../config/api';
import { dynamicTableService } from './dynamicTableService';
import { TableNames } from '../constants/tables';
import { simpleDatabaseService } from './simpleDatabase';
import { MasterApiService } from './masterApiService';
import { ConfigApiService } from './configApiService';
import { TransactionalApiService } from './transactionalApiService';

export interface IApiConfig {
  responsibility: string;
  apiName: string;
  url: string;
  type: 'master' | 'config' | 'transactional';
  requiresOrgId: boolean;
  requiresDefaultOrgId: boolean;
  tableType: 'json' | 'table';
  version: string;
  lastSyncTime?: boolean;
  fullRefresh?: boolean;
  queries?: string[];
}

export interface IRefreshResult {
  success: boolean;
  error?: string;
  recordsTotal: number;
  recordsInserted: number;
  apiName: string;
  apiType: 'master' | 'config' | 'transactional';
  duration?: number;
}

export interface IRefreshProgress {
  current: number;
  total: number;
  percentage: number;
  currentApi?: string;
  currentApiType?: 'master' | 'config' | 'transactional';
  estimatedTimeRemaining?: number;
}

export interface IRefreshOptions {
  orgId: string;
  defaultOrgId: string | null;
  responsibilities: string[];
  onProgress?: (progress: IRefreshProgress) => void;
  abortSignal?: AbortSignal;
  timeout?: number;
}

export interface IRefreshSummary {
  totalApis: number;
  successfulApis: number;
  failedApis: number;
  totalRecords: number;
  totalInserted: number;
  totalDuration: number;
  byType: {
    master: { total: number; successful: number; failed: number };
    config: { total: number; successful: number; failed: number };
    transactional: { total: number; successful: number; failed: number };
  };
}

/**
 * Core API Refresh Service
 * Handles the actual API calls and data insertion logic
 * Can be reused by ActivityService and other services
 */
export class ApiRefreshService {
  private static readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private static readonly PROGRESS_UPDATE_INTERVAL = 100; // 100ms

  /**
   * Get all API configurations for given responsibilities
   */
  static getApiConfigurations(responsibilities: string[]): IApiConfig[] {
    console.log('Getting API configurations for responsibilities:', responsibilities);
    
    const masterApis = MasterApiService.getMasterApis();
    const configApis = ConfigApiService.getConfigApis();
    const transactionalApis = TransactionalApiService.getTransactionalApis();
    
    const allApis: IApiConfig[] = [
      ...responsibilities
        .filter(resp => masterApis[resp])
        .map(resp => ({
          responsibility: resp,
          ...masterApis[resp],
        })),
      ...responsibilities
        .filter(resp => configApis[resp])
        .map(resp => ({
          responsibility: resp,
          ...configApis[resp],
        })),
      ...responsibilities
        .filter(resp => transactionalApis[resp])
        .map(resp => ({
          responsibility: resp,
          ...transactionalApis[resp],
        }))
    ];
    
    console.log(`Found ${allApis.length} API configurations:`, allApis.map(api => api.responsibility));
    return allApis;
  }

  /**
   * Process a single API and return result
   */
  static async processApi(
    apiName: string,
    orgId: string,
    defaultOrgId?: string | null,
    abortSignal?: AbortSignal,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<IApiResult> {
    const startTime = Date.now();
    
    try {
      const { fullUrl, baseUrl } = this.buildApiUrl(apiName, orgId, defaultOrgId);
      const config = this.getApiConfig(apiName);
      
      if (!config) {
        throw new Error(`Unknown API: ${apiName}`);
      }

      console.log(`Processing API: ${apiName} with URL: ${fullUrl}`);

      // Create static tables first if queries are provided
      if (config?.queries && config.queries.length) {
        console.log(`Creating ${config.queries.length} static tables for ${apiName}`);
        await this.createStaticTables(apiName, config.queries);
      }

      // Process based on table type
      let result: IApiResult;
      if (config.tableType === 'json') {
        result = await this.processJsonApiWithMetadata(apiName, fullUrl, baseUrl, abortSignal, timeout);
      } else {
        result = await this.processTableTypeApi(apiName, fullUrl, abortSignal, timeout);
      }

      const duration = Date.now() - startTime;
      console.log(`API ${apiName} completed in ${duration}ms`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`API ${apiName} failed after ${duration}ms:`, error);
      throw error;
    }
  }

  /**
   * Refresh data for specific responsibilities
   */
  static async refreshDataForResponsibilities(
    options: IRefreshOptions
  ): Promise<IRefreshResult[]> {
    const { orgId, defaultOrgId, responsibilities, onProgress, abortSignal, timeout = this.DEFAULT_TIMEOUT } = options;
    const results: IRefreshResult[] = [];
    const startTime = Date.now();
    
    try {
      console.log('Starting refresh for responsibilities:', responsibilities);
      
      // Get API configurations
      const allApis = this.getApiConfigurations(responsibilities);
      
      if (allApis.length === 0) {
        throw new Error('No APIs found for the specified responsibilities');
      }
      
      console.log(`Processing ${allApis.length} APIs...`);
      
      // Process each API
      for (let i = 0; i < allApis.length; i++) {
        const api = allApis[i];
        const apiStartTime = Date.now();
        
        // Check for abort signal
        if (abortSignal?.aborted) {
          throw new Error('Refresh operation was cancelled');
        }
        
        try {
          // Update progress
          const elapsedTime = Date.now() - startTime;
          const estimatedTimeRemaining = this.calculateEstimatedTimeRemaining(
            i, allApis.length, elapsedTime
          );
          
          onProgress?.({
            current: i + 1,
            total: allApis.length,
            percentage: Math.round(((i + 1) / allApis.length) * 100),
            currentApi: api.responsibility,
            currentApiType: api.type,
            estimatedTimeRemaining
          });
          
          console.log(`Processing API ${i + 1}/${allApis.length}: ${api.responsibility} (${api.type})`);
          
          // Process the API
          const apiResult = await this.processApi(
            api.responsibility,
            orgId,
            defaultOrgId,
            abortSignal,
            timeout
          );
          
          const apiDuration = Date.now() - apiStartTime;
          
          // Store the result
          results.push({
            success: apiResult.success,
            error: apiResult.error || undefined,
            recordsTotal: apiResult.recordsTotal,
            recordsInserted: apiResult.recordsInserted,
            apiName: api.responsibility,
            apiType: api.type,
            duration: apiDuration
          });
          
          console.log(`API ${api.responsibility} completed:`, {
            success: apiResult.success,
            recordsTotal: apiResult.recordsTotal,
            recordsInserted: apiResult.recordsInserted,
            type: api.type,
            duration: apiDuration
          });
          
        } catch (error) {
          const apiDuration = Date.now() - apiStartTime;
          console.error(`Error processing API ${api.responsibility}:`, error);
          
          results.push({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            recordsTotal: 0,
            recordsInserted: 0,
            apiName: api.responsibility,
            apiType: api.type,
            duration: apiDuration
          });
        }
      }
      
      const totalDuration = Date.now() - startTime;
      console.log(`Refresh completed in ${totalDuration}ms. Results:`, results);
      return results;
      
    } catch (error) {
      console.error('Error in refresh process:', error);
      throw error;
    }
  }

  /**
   * Get refresh summary
   */
  static getRefreshSummary(results: IRefreshResult[]): IRefreshSummary {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    const byType = {
      master: { total: 0, successful: 0, failed: 0 },
      config: { total: 0, successful: 0, failed: 0 },
      transactional: { total: 0, successful: 0, failed: 0 }
    };
    
    results.forEach(result => {
      byType[result.apiType].total++;
      if (result.success) {
        byType[result.apiType].successful++;
      } else {
        byType[result.apiType].failed++;
      }
    });
    
    const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);
    
    return {
      totalApis: results.length,
      successfulApis: successful.length,
      failedApis: failed.length,
      totalRecords: results.reduce((sum, r) => sum + r.recordsTotal, 0),
      totalInserted: results.reduce((sum, r) => sum + r.recordsInserted, 0),
      totalDuration,
      byType
    };
  }

  // Private helper methods
  private static calculateEstimatedTimeRemaining(
    currentIndex: number, 
    totalApis: number, 
    elapsedTime: number
  ): number {
    if (currentIndex === 0) return 0;
    
    const averageTimePerApi = elapsedTime / (currentIndex + 1);
    const remainingApis = totalApis - (currentIndex + 1);
    return Math.round(averageTimePerApi * remainingApis);
  }

  private static async createStaticTables(apiName: string, queries: string[]): Promise<void> {
    try {
      console.log(`Creating ${queries.length} static tables for ${apiName}`);
      
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        try {
          await simpleDatabaseService.executeQuery(query);
          console.log(`Created static table ${i + 1}/${queries.length} for ${apiName}`);
        } catch (error) {
          console.error(`Failed to create static table ${i + 1} for ${apiName}:`, error);
        }
      }
      
      console.log(`Completed creating ${queries.length} static tables for ${apiName}`);
    } catch (error) {
      console.error(`Error creating static tables for ${apiName}:`, error);
    }
  }

  private static async processJsonApiWithMetadata(
    apiName: string,
    dataUrl: string,
    baseUrl: string,
    abortSignal?: AbortSignal,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<IApiResult> {
    try {
      // Get metadata
      const metadataUrl = this.getMetadataUrl(baseUrl);
      console.log(`Fetching metadata from: ${metadataUrl}`);
      
      const metadataResponse = await apiService(metadataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : timeout
      });

      if (metadataResponse.status !== 200) {
        throw new Error(`Metadata API failed: HTTP ${metadataResponse.status}`);
      }

      const metadata = metadataResponse.data;
      console.log(`Metadata received for ${apiName}:`, metadata);

      // Get data
      console.log(`Fetching data from: ${dataUrl}`);
      const dataResponse = await apiService(dataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : timeout
      });

      if (dataResponse.status !== 200) {
        throw new Error(`Data API failed: HTTP ${dataResponse.status}`);
      }

      const data = dataResponse.data;
      console.log(`Data received for ${apiName}:`, data);

      // Create table from metadata and insert data
      const tableName = this.getTableNameForApi(apiName);
      const dataArray = this.extractDataArray(data);
      console.log(`Extracted data array for ${apiName}:`, dataArray.length, 'records');
      
      const tableResult = await dynamicTableService.createTableFromMetadata(
        tableName,
        metadata,
        dataArray
      );

      if (!tableResult.success) {
        throw new Error(`Failed to create table: ${tableResult.error}`);
      }

      console.log(`Table created successfully for ${apiName}:`, tableResult);

      return {
        success: true,
        recordsTotal: dataArray.length,
        recordsInserted: tableResult.rowsInserted,
        error: null,
      };
    } catch (error) {
      console.error(`Error processing JSON API ${apiName} with metadata:`, error);
      throw error;
    }
  }

  private static async processTableTypeApi(
    apiName: string,
    dataUrl: string,
    abortSignal?: AbortSignal,
    timeout: number = this.DEFAULT_TIMEOUT
  ): Promise<IApiResult> {
    try {
      console.log(`Fetching table data from: ${dataUrl}`);
      const response = await apiService(dataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : timeout
      });

      if (response.status === 204) {
        return {
          success: true,
          recordsTotal: 0,
          recordsInserted: 0,
          error: null,
        };
      }

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid table type response format');
      }

      const headers = data[0];
      if (!Array.isArray(headers) || headers.some(header => header === null || header === undefined)) {
        throw new Error('Invalid column headers in table type response');
      }

      const dataRows = data.slice(1);
      
      if (dataRows.some(row => !Array.isArray(row) || row.length !== headers.length)) {
        throw new Error('Inconsistent column count in table type response data');
      }

      const tableName = this.getTableNameForApi(apiName);
      const tableResult = await dynamicTableService.createTableFromTableTypeResponse(
        tableName,
        { columns: headers, rows: dataRows }
      );

      if (!tableResult.success) {
        throw new Error(`Failed to create table: ${tableResult.error}`);
      }

      console.log(`Table created successfully for ${apiName}:`, tableResult);

      return {
        success: true,
        recordsTotal: dataRows.length,
        recordsInserted: tableResult.rowsInserted,
        error: null,
      };
    } catch (error) {
      console.error(`Error processing table type API ${apiName}:`, error);
      throw error;
    }
  }

  private static extractDataArray(apiResponse: any): any[] {
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error("Invalid API response");
    }
  
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }
  
    for (const key of Object.keys(apiResponse)) {
      const value = apiResponse[key];
      if (Array.isArray(value)) {
        console.log(`Found array in key "${key}" with ${value.length} items`);
        return value;
      }
    }
  
    throw new Error("No array found in API response");
  }

  private static getApiConfig(apiName: string): IApiConfig | null {
    const masterApi = MasterApiService.getMasterApi(apiName);
    if (masterApi) {
      return { responsibility: apiName, ...masterApi };
    }

    const configApi = ConfigApiService.getConfigApi(apiName);
    if (configApi) {
      return { responsibility: apiName, ...configApi };
    }

    const transactionalApi = TransactionalApiService.getTransactionalApi(apiName);
    if (transactionalApi) {
      return { responsibility: apiName, ...transactionalApi };
    }

    return null;
  }

  private static buildApiUrl(apiName: string, orgId: string, defaultOrgId?: string | null, lastSyncTime: string = "''", fullRefresh: string = "Y"): { fullUrl: string, baseUrl: string } {
    const config = this.getApiConfig(apiName);
    if (!config) {
      throw new Error(`Unknown API: ${apiName}`);
    }
    
    let url = config.url;

    if (config.requiresDefaultOrgId && defaultOrgId) {
      url = `${url}/${defaultOrgId}`;
    } else if (config.requiresDefaultOrgId && !defaultOrgId) {
      throw new Error(`API ${apiName} requires defaultOrgId but none provided`);
    }

    if (config.requiresOrgId && orgId) {
      url = `${url}/${orgId}`;
    } else if (config.requiresOrgId && !orgId) {
      throw new Error(`API ${apiName} requires orgId but none provided`);
    }

    if (config.lastSyncTime) {
      url = `${url}/${lastSyncTime}`;
    }
    
    if (config.fullRefresh) {
      url = `${url}/${fullRefresh}`;
    }
  
    const apiConfig = getCurrentApiConfig();
    const fullUrl = `${apiConfig.hostname}/${url}`;
    
    try {
      new URL(fullUrl);
    } catch (error) {
      console.error(`Invalid URL constructed for ${apiName}:`, fullUrl);
      throw new Error(`Invalid URL constructed for ${apiName}: ${fullUrl}`);
    }
    
    return { fullUrl, baseUrl: `${apiConfig.hostname}/${config.url}` };
  }

  private static getTableNameForApi(apiName: string): string {
    const tableNameMap: Record<string, TableNames> = {
      ITEM: TableNames.ITEMS,
      ACCOUNT: TableNames.GL_ACCOUNTS,
      SUB_INV: TableNames.SUB_INVENTORIES,
      LOCATORS: TableNames.LOCATORS,
      REASON: TableNames.REASONS,
      GL_PERIODS: TableNames.GL_PERIODS,
      INVENTORY_PERIODS: TableNames.INVENTORY_PERIODS,
      SHIP_CONFIRM: TableNames.SHIPPING_ORDERS,
    };

    return tableNameMap[apiName] || apiName.toLowerCase();
  }

  private static getMetadataUrl(baseUrl: string): string {
    return `${baseUrl}/metadata`;
  }
}
