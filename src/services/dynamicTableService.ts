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
  validateDataAgainstMetadata,
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
    return metadata.map((column) => {
      const sqliteType = this.mapTypeToSqlite(column.type);
      
      return {
        name: column.name,
        type: sqliteType,
        nullable: true, // Default to nullable for dynamic tables
        primaryKey: (column as any).primarykey === true || (column as any).primaryKey === true,
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
    const hasPrimaryKeyInMetadata = columns.some(c => c.primaryKey);

    const columnDefinitions = columns.map(column => {
      let definition = `${column.name} ${column.type}`;
      
      if (column.primaryKey) {
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
    // Only add synthetic id column if metadata did not specify a primary key
    const createSql = hasPrimaryKeyInMetadata
      ? `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsSql})`
      : `CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columnsSql})`;

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

      if (data && data.length > 0 && !validateDataAgainstMetadata(data, metadata)) {
        throw new Error('Data does not match metadata schema');
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
        rowsInserted = await this.insertDataIntoTable(tableName, data);
      }

      const result = {
        success: true,
        tableName,
        columnsCreated: columns.length,
        rowsInserted,
      };

      // Log the result
      logTableCreationResult(result, tableName as any);
      
      // Log table summary in development
      if (__DEV__) {
        console.log('Table Summary:', generateTableSummary(tableName, sanitizedMetadata, data));
      }

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
        return 0;
      }

      // Get column names from first data row
      const columns = Object.keys(data[0]);
      
      // Use optimized bulk insert for better performance
      const batchSize = 100; // Process 100 records at a time
      let totalInserted = 0;

      // Process data in chunks
      for (let i = 0; i < data.length; i += batchSize) {
        const chunk = data.slice(i, i + batchSize);
        
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
          if (__DEV__ && data.length > 100) {
            console.log(`Inserted ${totalInserted}/${data.length} records into ${tableName}`);
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
      const columnMetadata: IColumnMetadata[] = columns.map((columnName, index) => {
        const isPrimaryKey = columnName.endsWith('_PK');
        const cleanColumnName = isPrimaryKey ? columnName.replace('_PK', '') : columnName;
        
        return {
          name: cleanColumnName,
          type: 'TEXT', // Default to TEXT for TableType APIs
          nullable: true,
          primaryKey: isPrimaryKey,
          autoIncrement: false,
        };
      });

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
