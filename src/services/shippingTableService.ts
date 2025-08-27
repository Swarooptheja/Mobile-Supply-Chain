import { getSalesOrdersForShippingTableApi } from './api';
import { TableNames } from '../constants/tables';
import { detectApiResponseType } from '../utils/apiUtils';
import { ITableCreationResult } from '../types/database';

/**
 * Service for handling shipping table operations
 */
export class ShippingTableService {
  /**
   * Fetch shipping table data and create/update local database table
   * @param orgId - Organization ID to fetch data for
   * @param createTableFromTableTypeResponse - Function to create table from TableType response
   * @param _createTableFromApiResponse - Function to create table from JSON API response (unused for now)
   * @returns Promise with table creation result
   */
  static async fetchAndCreateShippingTable(
    orgId: string | number,
    createTableFromTableTypeResponse: (tableName: TableNames, response: any) => Promise<ITableCreationResult>,
    _createTableFromApiResponse: (tableName: TableNames, metadata: any[], data: any[]) => Promise<ITableCreationResult>
  ): Promise<ITableCreationResult> {
    try {
      console.log(`Fetching shipping table data for organization: ${orgId}`);
      
      // Fetch data from API
      const response = await getSalesOrdersForShippingTableApi(orgId);
      
      console.log('Shipping table API response received:', {
        responseType: typeof response,
        isArray: Array.isArray(response),
        length: Array.isArray(response) ? response.length : 'N/A'
      });
      
      // Detect response type and process accordingly
      const { type, data } = detectApiResponseType(response);
      
      console.log(`Detected API response type: ${type}`, {
        columnsCount: type === 'tableType' ? data.columns?.length : 'N/A',
        rowsCount: type === 'tableType' ? data.rows?.length : 'N/A'
      });
      
      if (type === 'tableType') {
        // Handle TableType API response
        console.log('Processing TableType API response for shipping table');
        return await createTableFromTableTypeResponse(TableNames.SHIPPING_TABLE, data);
      } else {
        // Handle JSON API response (fallback to existing implementation)
        console.log('Processing JSON API response for shipping table');
        // For JSON APIs, we would need metadata, but this API doesn't provide it
        // So we'll throw an error for now
        throw new Error('JSON API response not supported for shipping table without metadata');
      }
    } catch (error) {
      console.error('Error in fetchAndCreateShippingTable:', error);
      throw error;
    }
  }
}
