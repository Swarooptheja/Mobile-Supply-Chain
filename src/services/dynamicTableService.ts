import { simpleDatabaseService } from './simpleDatabase';
import {
  IColumnMetadata,
  ITableMetadata,
  ITableCreationResult,
  IDynamicTableService,
  IApiResponseMetadata,
  ITableTypeApiResponse,
} from '../types/database';
import {
  validateMetadata,
  sanitizeMetadata,
  logTableCreationResult,
  generateTableSummary,
} from '../utils/tableUtils';

class DynamicTableService implements IDynamicTableService {
  private typeMapping: Record<string, string> = {
    'string': 'TEXT',
    'text': 'TEXT',
    'varchar': 'TEXT',
    'char': 'TEXT',
    'number': 'INTEGER',
    'integer': 'INTEGER',
    'int': 'INTEGER',
    'bigint': 'INTEGER',
    'float': 'REAL',
    'double': 'REAL',
    'decimal': 'REAL',
    'boolean': 'INTEGER',
    'bool': 'INTEGER',
    'date': 'TEXT',
    'datetime': 'TEXT',
    'timestamp': 'TEXT',
    'blob': 'BLOB',
  };

  /**
   * Convert API metadata to SQLite column definitions
   */
  private convertMetadataToColumns(metadata: IApiResponseMetadata[]): IColumnMetadata[] {
    // Find all columns marked as primary keys to support composite primary keys
    const primaryKeyColumns = metadata.filter(col => 
      (col as any).primarykey === true || (col as any).primaryKey === true
    );
    
    return metadata.map((column) => {
      const sqliteType = this.mapTypeToSqlite(column.type);
      
      // Mark column as primary key if it's in the primary key list
      const isPrimaryKey = primaryKeyColumns.some(pkCol => pkCol.name === column.name);
      
      return {
        name: column.name,
        type: sqliteType,
        nullable: true, // Default to nullable for dynamic tables
        primaryKey: isPrimaryKey,
        autoIncrement: false, // Don't auto-increment by default
      };
    });
  }

  /**
   * Map API types to SQLite types
   */
  private mapTypeToSqlite(apiType: string): string {
    const normalizedType = apiType.toLowerCase().trim();
    return this.typeMapping[normalizedType] || 'TEXT';
  }

  /**
   * Generate CREATE TABLE SQL statement
   */
  private generateCreateTableSQL(tableName: string, columns: IColumnMetadata[]): string {
    const primaryKeyColumns = columns.filter(c => c.primaryKey);

    const columnDefinitions = columns.map(column => {
      let definition = `${column.name} ${column.type}`;
      
      // Don't add PRIMARY KEY constraint here for composite primary keys
      // We'll handle it separately at the end
      if (column.primaryKey && primaryKeyColumns.length === 1) {
        definition += ' PRIMARY KEY';
        if (column.autoIncrement) {
          definition += ' AUTOINCREMENT';
        }
      }
      
      if (!column.nullable) {
        definition += ' NOT NULL';
      }
      
      if (column.defaultValue !== undefined) {
        definition += ` DEFAULT ${column.defaultValue}`;
      }
      
      return definition;
    });

    const columnsSql = columnDefinitions.join(', ');
    let createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSql}`;
    
    // Handle composite primary keys
    if (primaryKeyColumns.length > 1) {
      const primaryKeyNames = primaryKeyColumns.map(col => col.name).join(', ');
      createSql += `, PRIMARY KEY(${primaryKeyNames})`;
    } else if (primaryKeyColumns.length === 0) {
      // Only add synthetic id column if no primary keys specified
      createSql = `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columnsSql}`;
    }
    
    createSql += ')';
    return createSql;
  }

  /**
   * Create table from API response metadata
   */
  async createTableFromMetadata(
    tableName: string,
    metadata: IApiResponseMetadata[],
    data: any[]
  ): Promise<ITableCreationResult> {
    try {
      if (!simpleDatabaseService.isInitialized()) {
        throw new Error('Database is not initialized');
      }

      // Validate metadata and data
      if (!validateMetadata(metadata)) {
        throw new Error('Invalid metadata provided');
      }

      // Sanitize metadata for SQLite compatibility
      const sanitizedMetadata = sanitizeMetadata(metadata);
      
      // Convert metadata to column definitions
      const columns = this.convertMetadataToColumns(sanitizedMetadata);
      
      // Generate and execute CREATE TABLE statement
      const createTableSQL = this.generateCreateTableSQL(tableName, columns);
      console.info({
        createTableSQL,
        tableName
      });
      await simpleDatabaseService.executeQuery(createTableSQL);
      
      // Clear existing data for login table to avoid duplicates
      if (tableName.toLowerCase() === 'login') {
        await simpleDatabaseService.executeQuery(`DELETE FROM ${tableName}`);
        console.log(`Cleared existing data from ${tableName} table`);
      }
      
      // Insert data if provided
      let rowsInserted = 0;
      if (data && data.length) {
        // For regular APIs, data might be nested like {GLPeriods: [...], Success: true}
        // Extract the actual data rows from the response
        let actualDataRows: any[] = [];
        
        if (data.length === 1 && typeof data[0] === 'object') {
          const firstItem = data[0];
          
          // Debug logging to understand the data structure
          if (__DEV__) {
            console.log(`Data structure analysis for ${tableName}:`, {
              dataLength: data.length,
              firstItemKeys: Object.keys(firstItem),
              firstItemStructure: Object.keys(firstItem).map(key => ({
                key,
                type: typeof firstItem[key],
                isArray: Array.isArray(firstItem[key]),
                length: Array.isArray(firstItem[key]) ? firstItem[key].length : 'N/A'
              }))
            });
          }
          
          // Look for arrays in the response that contain the actual data
          for (const key in firstItem) {
            if (Array.isArray(firstItem[key]) && firstItem[key].length > 0) {
              // Found the data array, extract it
              actualDataRows = firstItem[key];
              console.log(`Extracted ${actualDataRows.length} rows from ${key} field`);
              
              // Show sample of extracted data
              if (__DEV__ && actualDataRows.length > 0) {
                console.log(`Sample extracted data:`, actualDataRows[0]);
              }
              break;
            }
          }
        }
        
        // If we found actual data rows, use them; otherwise use the original data
        const dataToInsert = actualDataRows.length > 0 ? actualDataRows : data;
        console.log(`Inserting ${dataToInsert.length} rows into ${tableName}`);
        rowsInserted = await this.insertDataIntoTable(tableName, dataToInsert);
      }

      const result = {
        success: true,
        tableName,
        columnsCreated: columns.length,
        rowsInserted,
      };

      // Log the result
      logTableCreationResult(result, tableName as any);

      return result;
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
      return {
        success: false,
        tableName,
        columnsCreated: 0,
        rowsInserted: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Insert data into existing table using optimized batch operations
   */
  async insertDataIntoTable(tableName: string, data: any[]): Promise<number> {
    try {
      if (!data || !data.length) {
        console.log(`No data provided for table ${tableName}`);
        return 0;
      }

      // Validate data structure
      const firstRow = data[0];
      if (!firstRow || typeof firstRow !== 'object') {
        console.error(`Invalid data structure for table ${tableName}. Expected object, got:`, typeof firstRow);
        return 0;
      }

      const dataColumns = Object.keys(firstRow);
      if (dataColumns.length === 0) {
        console.error(`Data for table ${tableName} has no columns`);
        return 0;
      }

      console.log(`Inserting data into ${tableName}:`, {
        rowCount: data.length,
        columns: dataColumns,
        sampleData: firstRow
      });

      // Get the actual table schema to know which columns exist
      const tableSchema = await this.getTableSchema(tableName);
      if (!tableSchema) {
        throw new Error(`Table schema not found for ${tableName}`);
      }

      // Get column names that actually exist in the table
      const existingColumns = tableSchema.columns.map(col => col.name);
      
      // Filter data to only include columns that exist in the table
      const filteredData = data.map(row => {
        const filteredRow: any = {};
        existingColumns.forEach(colName => {
          if (row.hasOwnProperty(colName)) {
            filteredRow[colName] = row[colName];
          }
        });
        return filteredRow;
      });

      // Debug logging to understand what's happening
      if (__DEV__) {
        console.log(`Data filtering for table ${tableName}:`, {
          originalColumns: Object.keys(data[0] || {}),
          existingTableColumns: existingColumns,
          filteredColumns: Object.keys(filteredData[0] || {}),
          dataSample: data[0],
          filteredSample: filteredData[0]
        });
      }

      // Check if we have any valid columns after filtering
      const firstRowAfterFiltering = filteredData[0];
      const validColumns = Object.keys(firstRowAfterFiltering).filter(col => firstRowAfterFiltering[col] !== undefined);
      
      if (validColumns.length === 0) {
        console.warn(`No valid columns found for table ${tableName} after filtering. Skipping insert.`);
        console.warn(`Table schema:`, existingColumns);
        console.warn(`Data columns:`, Object.keys(data[0] || {}));
        return 0;
      }

      // Use only the valid columns that have data
      const columns = validColumns;
      
      // Use optimized bulk insert for better performance
      const batchSize = 100; // Process 100 records at a time
      let totalInserted = 0;

      // Process data in chunks
      for (let i = 0; i < filteredData.length; i += batchSize) {
        const chunk = filteredData.slice(i, i + batchSize);
        
        try {
          // Use bulk insert syntax: INSERT INTO table (cols) VALUES (...), (...), ...
          const valuesClauses = chunk.map(() => 
            `(${columns.map(() => '?').join(', ')})`
          ).join(', ');
          
          // Use INSERT OR REPLACE for login table to handle updates
          const insertType = tableName.toLowerCase() === 'login' ? 'INSERT OR REPLACE' : 'INSERT OR IGNORE';
          const bulkInsertSQL = `${insertType} INTO ${tableName} (${columns.join(', ')}) VALUES ${valuesClauses}`;
          
          // Flatten all values into a single array
          const allValues = chunk.flatMap(row => columns.map(column => row[column]));
          
          await simpleDatabaseService.executeQuery(bulkInsertSQL, allValues);
          totalInserted += chunk.length;
          
          // Log progress for large datasets
          if (__DEV__ && filteredData.length > 100) {
            console.log(`Inserted ${totalInserted}/${filteredData.length} records into ${tableName}`);
          }
        } catch (bulkError) {
          console.error(`Error in bulk insert for ${tableName}:`, bulkError);
          
          // Fallback to individual inserts for the failed batch
          console.log(`Falling back to individual inserts for batch starting at index ${i}`);
          const placeholders = columns.map(() => '?').join(', ');
          const insertType = tableName.toLowerCase() === 'login' ? 'INSERT OR REPLACE' : 'INSERT OR IGNORE';
          const insertSQL = `${insertType} INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
          
          for (const row of chunk) {
            try {
              const values = columns.map(column => row[column]);
              await simpleDatabaseService.executeQuery(insertSQL, values);
              totalInserted++;
            } catch (individualError) {
              console.error(`Failed to insert individual row:`, individualError);
              // Continue with next row
            }
          }
        }
      }

      return totalInserted;
    } catch (error) {
      console.error(`Error inserting data into table ${tableName}:`, error);
      throw error;
    }
  }

  /**
   * Get table schema information
   */
  async getTableSchema(tableName: string): Promise<ITableMetadata | null> {
    try {
      const pragmaSQL = `PRAGMA table_info(${tableName})`;
      const result = await simpleDatabaseService.executeQuery(pragmaSQL);
      
      if (!result || !result[0] || !result[0].rows) {
        return null;
      }

      const columns: IColumnMetadata[] = [];
      for (let i = 0; i < result[0].rows.length; i++) {
        const row = result[0].rows.item(i);
        columns.push({
          name: row.name,
          type: row.type,
          nullable: !row.notnull,
          primaryKey: row.pk === 1,
          autoIncrement: row.pk === 1 && row.type.toLowerCase().includes('integer'),
        });
      }

      return {
        name: tableName,
        columns,
      };
    } catch (error) {
      console.error(`Error getting schema for table ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Check if table exists
   */
  async tableExists(tableName: string): Promise<boolean> {
    try {
      const sql = `SELECT name FROM sqlite_master WHERE type='table' AND name=?`;
      const result = await simpleDatabaseService.executeQuery(sql, [tableName]);
      return result && result[0] && result[0].rows && result[0].rows.length > 0;
    } catch (error) {
      console.error(`Error checking if table ${tableName} exists:`, error);
      return false;
    }
  }

  /**
   * Drop table
   */
  async dropTable(tableName: string): Promise<boolean> {
    try {
      const dropSQL = `DROP TABLE IF EXISTS ${tableName}`;
      await simpleDatabaseService.executeQuery(dropSQL);
      return true;
    } catch (error) {
      console.error(`Error dropping table ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Create table from TableType API response
   * TableType APIs return data in format: [columns[], row1[], row2[], ...]
   */
  async createTableFromTableTypeResponse(
    tableName: string,
    tableTypeResponse: ITableTypeApiResponse
  ): Promise<ITableCreationResult> {
    try {
      if (!simpleDatabaseService.isInitialized()) {
        throw new Error('Database is not initialized');
      }

      const { columns, rows } = tableTypeResponse;
      
      if (!columns || !Array.isArray(columns) || columns.length === 0) {
        throw new Error('Invalid column data in TableType response');
      }

      if (!rows || !Array.isArray(rows)) {
        throw new Error('Invalid row data in TableType response');
      }

      // Process columns to identify primary keys and create metadata
      const columnMetadata: IColumnMetadata[] = columns.map((columnName) => {
        // Support multiple primary keys for composite primary key support
        const isPrimaryKey = columnName.endsWith('_PK') || 
          (columnName.toLowerCase().includes('id') && columnName.toLowerCase().endsWith('id'));
        
        const cleanColumnName = isPrimaryKey && columnName.endsWith('_PK') ? columnName.replace('_PK', '') : columnName;
        
        return {
          name: cleanColumnName,
          type: 'TEXT', // Default to TEXT for TableType APIs
          nullable: true,
          primaryKey: isPrimaryKey,
          autoIncrement: false,
        };
      });

      // Log info about primary keys found
      const primaryKeyCount = columnMetadata.filter(col => col.primaryKey).length;
      if (primaryKeyCount > 0) {
        const primaryKeyNames = columnMetadata.filter(col => col.primaryKey).map(col => col.name).join(', ');
        console.log(`Found ${primaryKeyCount} primary key(s): ${primaryKeyNames}`);
      }

      // Generate and execute CREATE TABLE statement
      const createTableSQL = this.generateCreateTableSQL(tableName, columnMetadata);
      console.info({
        createTableSQL,
        tableName,
        columnsCount: columnMetadata.length,
        rowsCount: rows.length
      });
      
      await simpleDatabaseService.executeQuery(createTableSQL);
      
      // Clear existing data to avoid duplicates
      await simpleDatabaseService.executeQuery(`DELETE FROM ${tableName}`);
      console.log(`Cleared existing data from ${tableName} table`);

      // Insert data if provided
      let rowsInserted = 0;
      if (rows && rows.length > 0) {
        // Convert array format to object format for insertion
        const objectData = rows.map(row => {
          const obj: any = {};
          columnMetadata.forEach((column, index) => {
            obj[column.name] = row[index] || null;
          });
          
          return obj;
        });

        rowsInserted = await this.insertDataIntoTable(tableName, objectData);
      }

      const result = {
        success: true,
        tableName,
        columnsCreated: columnMetadata.length,
        rowsInserted,
      };

      // Log the result
      logTableCreationResult(result, tableName as any);
      
      // Log table summary in development
      if (__DEV__) {
        console.log('Table Summary:', generateTableSummary(tableName, columnMetadata, rows));
      }

      return result;
    } catch (error) {
      console.error(`Error creating table ${tableName} from TableType response:`, error);
      return {
        success: false,
        tableName,
        columnsCreated: 0,
        rowsInserted: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Create and export a singleton instance
export const dynamicTableService = new DynamicTableService();
