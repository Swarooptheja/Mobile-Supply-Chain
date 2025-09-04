import { IActivity, IApiResult } from '../types/activity';
import { apiService } from '../../services/sharedService';
import { getCurrentApiConfig } from '../config/api';
import { dynamicTableService } from './dynamicTableService';
import { TableNames } from '../constants/tables';
import { API_ENDPOINTS } from '../config/api';
import { LOAD_TO_DOCK_QUERIES } from '../constants/queries';
import { simpleDatabaseService } from './simpleDatabase';

interface IApiConfig {
  responsibility: string;
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
  private static readonly MASTER_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
    ITEM: {
      url: API_ENDPOINTS.ITEM,
      type: 'master',
      requiresOrgId: true,
      requiresDefaultOrgId: false,
      tableType: 'table',
      version: 'EBS/20D',
      lastSyncTime: true,
    },
    ACCOUNT: {
      url: API_ENDPOINTS.ACCOUNT,
      type: 'master',
      requiresOrgId: false,
      requiresDefaultOrgId: true,
      tableType: 'json',
      version: 'EBS/20D',
    },
    SUB_INV: {
      url: API_ENDPOINTS.SUB_INV,
      type: 'master',
      requiresOrgId: true,
      requiresDefaultOrgId: false,
      tableType: 'json',
      version: 'EBS/20D',
      lastSyncTime: true,
      fullRefresh: true,
    },
    LOCATORS: {
      url: API_ENDPOINTS.LOCATORS,
      type: 'master',
      requiresOrgId: true,
      requiresDefaultOrgId: false,
      tableType: 'table',
      version: 'EBS/23A',
      lastSyncTime: true,
    },
  };

  private static readonly CONFIG_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
    REASON: {
      url: API_ENDPOINTS.REASON,
      type: 'config',
      requiresOrgId: false,
      requiresDefaultOrgId: false,
      tableType: 'json',
      version: 'EBS/20D',
    },
    GL_PERIODS: {
      url: API_ENDPOINTS.GL_PERIODS,
      type: 'config',
      requiresOrgId: false,
      requiresDefaultOrgId: true,
      tableType: 'json',
      version: 'EBS/20D',
    },
    INVENTORY_PERIODS: {
      url: API_ENDPOINTS.INVENTORY_PERIODS,
      type: 'config',
      requiresOrgId: true,
      requiresDefaultOrgId: true,
      tableType: 'json',
      version: 'EBS/20D',
      lastSyncTime: false,
      fullRefresh: false,
    },
  };

  private static readonly TRANSACTIONAL_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
    SHIP_CONFIRM: {
      url: API_ENDPOINTS.SALES_ORDERS_SHIPPING,
      type: 'transactional',
      requiresOrgId: true,
      requiresDefaultOrgId: false,
      tableType: 'table',
      version: 'EBS/23B',
      lastSyncTime: true,
      fullRefresh: false,
      queries: [LOAD_TO_DOCK_QUERIES.CREATE_LOAD_TO_DOCK_TRANSACTION_TABLE]
    },
  };

  static getMasterApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering master APIs for responsibilities:', responsibilities);
    const filtered = responsibilities
      .filter(resp => this.MASTER_APIS[resp])
      .map(resp => ({
        responsibility: resp,
        ...this.MASTER_APIS[resp],
      }));
    console.log('Filtered master APIs:', filtered);
    return filtered;
  }

  static getConfigApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering config APIs for responsibilities:', responsibilities);
    const filtered = responsibilities
      .filter(resp => this.CONFIG_APIS[resp])
      .map(resp => ({
        responsibility: resp,
        ...this.CONFIG_APIS[resp],
      }));
    console.log('Filtered config APIs:', filtered);
    return filtered;
  }

  static getTransactionalApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering transactional APIs for responsibilities:', responsibilities);
    const filtered = responsibilities
      .filter(resp => this.TRANSACTIONAL_APIS[resp])
      .map(resp => ({
        responsibility: resp,
        ...this.TRANSACTIONAL_APIS[resp],
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

  private static validateApiParameters(activity: IActivity, orgId: string, defaultOrgId: string | null): string | null {
    const apiConfig = this.getApiConfig(activity.name);
    if (!apiConfig) {
      return `Unknown API: ${activity.name}`;
    }

    if (apiConfig.requiresOrgId && !orgId) {
      return `Organization ID is required for ${activity.name}`;
    }

    if (apiConfig.requiresDefaultOrgId && !defaultOrgId) {
      return `Default Organization ID is required for ${activity.name}`;
    }

    return null;
  }

  private static getApiConfig(apiName: string): IApiConfig | null {
    const masterApi = this.MASTER_APIS[apiName];
    if (masterApi) {
      return { responsibility: apiName, ...masterApi };
    }

    const configApi = this.CONFIG_APIS[apiName];
    if (configApi) {
      return { responsibility: apiName, ...configApi };
    }

    const transactionalApi = this.TRANSACTIONAL_APIS[apiName];
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

  static getApiDisplayName(apiName: string): string {
    const displayNames: Record<string, string> = {
      ITEM: 'Items',
      ACCOUNT: 'GL Accounts',
      SUB_INV: 'Sub Inventories',
      LOCATORS: 'Locators',
      REASON: 'Reasons',
      GL_PERIODS: 'GL Periods',
      INVENTORY_PERIODS: 'Inventory Periods',
      SHIP_CONFIRM: 'Shipping Orders',
    };

    return displayNames[apiName] || apiName;
  }

  static getApiDescription(apiName: string): string {
    const descriptions: Record<string, string> = {
      ITEM: 'Master data for inventory items',
      ACCOUNT: 'General ledger account information',
      SUB_INV: 'Sub-inventory location details',
      LOCATORS: 'Physical location information',
      REASON: 'Business reason codes',
      GL_PERIODS: 'General ledger accounting periods',
      INVENTORY_PERIODS: 'Inventory accounting periods',
      SHIP_CONFIRM: 'Sales orders ready for shipping',
    };

    return descriptions[apiName] || 'API data synchronization';
  }

  // Check if API can proceed based on dependency rules
  static canProceedToDashboard(activities: IActivity[]): boolean {
    // All APIs (master, config, and transactional) must succeed to proceed to dashboard
    return activities.every(a => a.status === 'success');
  }

  // Debug method to validate all API configurations
  static validateAllApiConfigs(): void {
    console.log('Validating all API configurations...');
    
    const allApis = {
      ...this.MASTER_APIS,
      ...this.CONFIG_APIS,
      ...this.TRANSACTIONAL_APIS
    };

    Object.entries(allApis).forEach(([apiName, _config]) => {
      try {
        const testUrl = this.buildApiUrl(apiName, 'test-org-id', 'test-default-org-id');
        console.log(`✅ ${apiName}: ${testUrl}`);
      } catch (error) {
        console.error(`❌ ${apiName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  }

  // Test method to demonstrate URL replacement functionality
  static testUrlReplacement(): void {
    console.log('Testing URL replacement functionality...');
    
    // Test with both placeholders
    try {
      const testUrl1 = this.buildApiUrl('SHIP_CONFIRM', '123', '456');
      console.log('✅ SHIP_CONFIRM with orgId=123, defaultOrgId=456:', testUrl1);
      
      const testUrl2 = this.buildApiUrl('ACCOUNT', '789', '101');
      console.log('✅ ACCOUNT with orgId=789, defaultOrgId=101:', testUrl2);
      
      const testUrl3 = this.buildApiUrl('INVENTORY_PERIODS', '222', '333');
      console.log('✅ INVENTORY_PERIODS with orgId=222, defaultOrgId=333:', testUrl3);
      
    } catch (error) {
      console.error('❌ URL replacement test failed:', error);
    }
  }

  // Test method to demonstrate responsibility filtering
  static testResponsibilityFiltering(): void {
    console.log('Testing responsibility filtering...');
    
    const testResponsibilities = ['SHIP_CONFIRM', 'ITEM', 'ACCOUNT', 'REASON'];
    console.log('Test responsibilities:', testResponsibilities);
    
    const masterApis = this.getMasterApis(testResponsibilities);
    const configApis = this.getConfigApis(testResponsibilities);
    const transactionalApis = this.getTransactionalApis(testResponsibilities);
    
    console.log('Filtered APIs:', {
      master: masterApis.map(api => api.responsibility),
      config: configApis.map(api => api.responsibility),
      transactional: transactionalApis.map(api => api.responsibility)
    });
  }

  // Comprehensive test method for the complete flow
  static testCompleteFlow(): void {
    console.log('🧪 Testing complete responsibility filtering and URL replacement flow...');
    
    // Test responsibilities that should match our API configurations
    const testResponsibilities = ['SHIP_CONFIRM', 'ITEM', 'ACCOUNT', 'REASON'];
    console.log('📋 Test responsibilities:', testResponsibilities);
    
    // Test with sample orgId and defaultOrgId
    const testOrgId = '12345';
    const testDefaultOrgId = '67890';
    
    console.log('🏢 Test organization IDs:', { orgId: testOrgId, defaultOrgId: testDefaultOrgId });
    
    // Test API filtering
    const masterApis = this.getMasterApis(testResponsibilities);
    const configApis = this.getConfigApis(testResponsibilities);
    const transactionalApis = this.getTransactionalApis(testResponsibilities);
    
    console.log('🔍 Filtered APIs:', {
      master: masterApis.map(api => ({ name: api.responsibility, url: api.url })),
      config: configApis.map(api => ({ name: api.responsibility, url: api.url })),
      transactional: transactionalApis.map(api => ({ name: api.responsibility, url: api.url }))
    });
    
    // Test URL construction for each API type
    console.log('🔗 Testing URL construction...');
    
    // Test master APIs
    masterApis.forEach(api => {
      try {
        const url = this.buildApiUrl(api.responsibility, testOrgId, testDefaultOrgId);
        console.log(`✅ ${api.responsibility}: ${url}`);
      } catch (error) {
        console.error(`❌ ${api.responsibility}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    // Test config APIs
    configApis.forEach(api => {
      try {
        const url = this.buildApiUrl(api.responsibility, testOrgId, testDefaultOrgId);
        console.log(`✅ ${api.responsibility}: ${url}`);
      } catch (error) {
        console.error(`❌ ${api.responsibility}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    // Test transactional APIs
    transactionalApis.forEach(api => {
      try {
        const url = this.buildApiUrl(api.responsibility, testOrgId, testDefaultOrgId);
        console.log(`✅ ${api.responsibility}: ${url}`);
      } catch (error) {
        console.error(`❌ ${api.responsibility}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
    
    console.log('🎉 Complete flow test finished!');
  }
}
