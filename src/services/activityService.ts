import { IActivity, IApiResult } from '../types/activity';
import { apiService } from '../../services/sharedService';
import { getCurrentApiConfig } from '../config/api';
import { dynamicTableService } from './dynamicTableService';
import { TableNames } from '../constants/tables';
import { simpleDatabaseService } from './simpleDatabase';
import { MasterApiService } from './masterApiService';
import { ConfigApiService } from './configApiService';
import { TransactionalApiService } from './transactionalApiService';

interface IApiConfig {
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


export class ActivityService {

  static getMasterApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering master APIs for responsibilities:', responsibilities);
    const masterApis = MasterApiService.getMasterApis();
    const filtered = responsibilities
      .filter(resp => masterApis[resp])
      .map(resp => ({
        responsibility: resp,
        ...masterApis[resp],
      }));
    console.log('Filtered master APIs:', filtered);
    return filtered;
  }

  static getConfigApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering config APIs for responsibilities:', responsibilities);
    const configApis = ConfigApiService.getConfigApis();
    const filtered = responsibilities
      .filter(resp => configApis[resp])
      .map(resp => ({
        responsibility: resp,
        ...configApis[resp],
      }));
    console.log('Filtered config APIs:', filtered);
    return filtered;
  }

  static getTransactionalApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering transactional APIs for responsibilities:', responsibilities);
    const transactionalApis = TransactionalApiService.getTransactionalApis();
    const filtered = responsibilities
      .filter(resp => transactionalApis[resp])
      .map(resp => ({
        responsibility: resp,
        ...transactionalApis[resp],
      }));
    console.log('Filtered transactional APIs:', filtered);
    return filtered;
  }

  static async processApi(
    apiName: string,
    orgId: string,
    defaultOrgId?: string | null,
    abortSignal?: AbortSignal
  ): Promise<IApiResult> {
    try {
      const {fullUrl, baseUrl} = this.buildApiUrl(apiName, orgId, defaultOrgId);
      const config = this.getApiConfig(apiName);
      
      if (!config) {
        throw new Error(`Unknown API: ${apiName}`);
      }

      console.log(`Processing API: ${apiName} with URL: ${fullUrl}`);
      console.log(`API Config:`, config);

        // NEW: Create static tables first if queries are provided
      if (config?.queries && config.queries.length) {
        console.log(`Creating ${config.queries.length} static tables for ${apiName}`);
        await this.createStaticTables(apiName, config.queries);
      }

      // For JSON APIs, we need to call metadata API first
      if (config.tableType === 'json') {
        return await this.processJsonApiWithMetadata(apiName, fullUrl, baseUrl, abortSignal);
      } else {
        // For table APIs, we use the first row as columns
        return await this.processTableTypeApi(apiName, fullUrl, abortSignal);
      }
    } catch (error) {
      console.error(`API ${apiName} failed:`, error);
      
      // Add more specific error information for network issues
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          console.error(`Network error details for ${apiName}:`, {
            url: this.buildApiUrl(apiName, orgId, defaultOrgId),
            orgId,
            defaultOrgId,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          // Additional debugging for React Native
          if (typeof __DEV__ !== 'undefined' && __DEV__) {
            console.log('Development mode detected - checking network configuration...');
            console.log('Current API config:', getCurrentApiConfig());
          }
        }
      }
      
      throw error;
    }
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
          // Continue with other tables even if one fails
        }
      }
      
      console.log(`Completed creating ${queries.length} static tables for ${apiName}`);
    } catch (error) {
      console.error(`Error creating static tables for ${apiName}:`, error);
      // Don't throw - let the API processing continue
    }
  }

  private static async processJsonApiWithMetadata(
    apiName: string,
    dataUrl: string,
    baseUrl: string,
    abortSignal?: AbortSignal
  ): Promise<IApiResult> {
    try {
      // Step 1: Get metadata from metadata API
      const metadataUrl = this.getMetadataUrl(baseUrl);
      console.log(`Fetching metadata from: ${metadataUrl}`);
      
      const metadataResponse = await apiService(metadataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : 30000
      });

      if (metadataResponse.status !== 200) {
        throw new Error(`Metadata API failed: HTTP ${metadataResponse.status}`);
      }

      const metadata = metadataResponse.data;
      console.log(`Metadata received for ${apiName}:`, metadata);

      // Step 2: Get actual data from data API
      console.log(`Fetching data from: ${dataUrl}`);
      const dataResponse = await apiService(dataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : 30000
      });

      if (dataResponse.status !== 200) {
        throw new Error(`Data API failed: HTTP ${dataResponse.status}`);
      }

      const data = dataResponse.data;
      console.log(`Data received for ${apiName}:`, data);
      console.log(`Data type for ${apiName}:`, typeof data, Array.isArray(data) ? 'Array' : 'Not Array');
      console.log(`Data keys for ${apiName}:`, Object.keys(data || {}));

      // Step 3: Create table from metadata and insert data
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
        recordsTotal: dataArray.length, // Use the actual extracted data array length
        recordsInserted: tableResult.rowsInserted,
        error: null,
      };
    } catch (error) {
      console.error(`Error processing JSON API ${apiName} with metadata:`, error);
      throw error;
    }
  }

  private static extractDataArray(apiResponse: any): any[] {
    if (!apiResponse || typeof apiResponse !== 'object') {
      throw new Error("Invalid API response");
    }
  
    console.log('Extracting data array from response:', {
      responseType: typeof apiResponse,
      isArray: Array.isArray(apiResponse),
      keys: Object.keys(apiResponse),
      response: apiResponse
    });
  
    // If the response is already an array, return it
    if (Array.isArray(apiResponse)) {
      console.log('Response is already an array, returning directly');
      return apiResponse;
    }
  
    // Find first key in the object whose value is an array
    for (const key of Object.keys(apiResponse)) {
      const value = apiResponse[key];
      console.log(`Checking key "${key}":`, {
        type: typeof value,
        isArray: Array.isArray(value),
        length: Array.isArray(value) ? value.length : 'N/A'
      });
      
      if (Array.isArray(value)) {
        console.log(`Found array in key "${key}" with ${value.length} items`);
        return value;
      }
    }
  
    console.error('No array found in API response structure');
    throw new Error("No array found in API response");
  }

  private static async processTableTypeApi(
    apiName: string,
    dataUrl: string,
    abortSignal?: AbortSignal
  ): Promise<IApiResult> {
    try {
      console.log(`Fetching table data from: ${dataUrl}`);
      const response = await apiService(dataUrl, { 
        method: 'GET', 
        timeout: abortSignal ? undefined : 30000
      });

      if (response.status === 204) {
        // No content response for transactional APIs
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

      // Validate that first row contains headers
      const headers = data[0];
      if (!Array.isArray(headers) || headers.some(header => header === null || header === undefined)) {
        throw new Error('Invalid column headers in table type response');
      }

      const dataRows = data.slice(1);
      
      // Validate data rows have consistent column count
      if (dataRows.some(row => !Array.isArray(row) || row.length !== headers.length)) {
        throw new Error('Inconsistent column count in table type response data');
      }

      // Create table using the first row as columns
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
    
    // Start with the base URL
    let url = config.url;

    // Build URL based on API configuration and requirements
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

    // Add additional parameters based on config flags
    if (config.lastSyncTime) {
      url = `${url}/${lastSyncTime}`;
    }
    
    if (config.fullRefresh) {
      url = `${url}/${fullRefresh}`;
    }
  
    // Construct the full URL using the base hostname from API config
    const apiConfig = getCurrentApiConfig();
    const fullUrl = `${apiConfig.hostname}/${url}`;
    
    // Validate the constructed URL
    try {
      new URL(fullUrl);
    } catch (error) {
      console.error(`Invalid URL constructed for ${apiName}:`, fullUrl);
      throw new Error(`Invalid URL constructed for ${apiName}: ${fullUrl}`);
    }
    
    return { fullUrl, baseUrl: `${apiConfig.hostname}/${config.url}` };
  }



  private static getTableNameForApi(apiName: string): string {
    // Map API names to table names using TableNames constants
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
    // baseUrl should already contain the full path, just append /metadata
    return `${baseUrl}/metadata`;
  }

  // Check if API can proceed based on dependency rules
  static canProceedToDashboard(activities: IActivity[]): boolean {
    // All APIs (master, config, and transactional) must succeed to proceed to dashboard
    return activities.every(a => a.status === 'success');
  }
}
