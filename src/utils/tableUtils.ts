import { IApiResponseMetadata, ITableCreationResult } from '../types/database';
import { TableNames } from '../constants/tables';

/**
 * Validate API response metadata
 */
export const validateMetadata = (metadata: IApiResponseMetadata[]): boolean => {
  if (!Array.isArray(metadata) || metadata.length === 0) {
    return false;
  }

  return metadata.every(column => 
    typeof column.name === 'string' && 
    column.name.trim().length > 0 &&
    typeof column.type === 'string' && 
    column.type.trim().length > 0
  );
};

/**
 * Sanitize metadata for SQLite compatibility
 */
export const sanitizeMetadata = (metadata: IApiResponseMetadata[]): IApiResponseMetadata[] => {
  return metadata.map(column => ({
    ...column,
    name: column.name,
  }));
};

/**
 * Log table creation result
 */
export const logTableCreationResult = (
  result: ITableCreationResult,
  tableName: TableNames
): void => {
  if (result.success) {
    console.log(`✅ Table '${tableName}' created successfully:`, {
      columnsCreated: result.columnsCreated,
      rowsInserted: result.rowsInserted,
    });
  } else {
    console.error(`❌ Failed to create table '${tableName}':`, {
      error: result.error,
    });
  }
};

/**
 * Generate table creation summary
 */
export const generateTableSummary = (
  tableName: string,
  metadata: IApiResponseMetadata[],
  data: any[]
): string => {
  return `
Table: ${tableName}
Columns: ${metadata.length}
Rows: ${data.length}
Columns: ${metadata.map(col => `${col.name} (${col.type})`).join(', ')}
  `.trim();
};

/**
 * Check if table name is valid
 */
export const isValidTableName = (tableName: string): boolean => {
  const validTableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return validTableNameRegex.test(tableName) && tableName.length <= 64;
};

/**
 * Get SQLite data type from API type
 */
export const getSqliteType = (apiType: string): string => {
  const typeMapping: Record<string, string> = {
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

  const normalizedType = apiType.toLowerCase().trim();
  return typeMapping[normalizedType] || 'TEXT';
};
