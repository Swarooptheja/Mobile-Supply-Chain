export interface ISimpleDatabaseService {
  init(): Promise<boolean>;
  isInitialized(): boolean;
  close(): Promise<void>;
  executeQuery(query: string, params?: any[]): Promise<any>;
  executeBatchQueries(queries: Array<{ query: string; params?: any[] }>): Promise<any[]>;
}

export interface IColumnMetadata {
  name: string;
  type: string;
  nullable?: boolean;
  primaryKey?: boolean;
  autoIncrement?: boolean;
  defaultValue?: any;
}

export interface ITableMetadata {
  name: string;
  columns: IColumnMetadata[];
  description?: string;
}

export interface ITableCreationResult {
  success: boolean;
  tableName: string;
  columnsCreated: number;
  rowsInserted: number;
  error?: string;
}

export interface IDynamicTableService {
  createTableFromMetadata(
    tableName: string,
    metadata: IColumnMetadata[],
    data: any[]
  ): Promise<ITableCreationResult>;
  
  createTableFromTableTypeResponse(
    tableName: string,
    tableTypeResponse: ITableTypeApiResponse
  ): Promise<ITableCreationResult>;
  
  insertDataIntoTable(
    tableName: string,
    data: any[]
  ): Promise<number>;
  
  getTableSchema(tableName: string): Promise<ITableMetadata | null>;
  
  tableExists(tableName: string): Promise<boolean>;
  
  dropTable(tableName: string): Promise<boolean>;
}

export interface IApiResponseMetadata {
  name: string;
  type: string;
}

export interface IApiResponse {
  metadata: IApiResponseMetadata[];
  data: any[];
}

// New interfaces for TableType APIs
export interface ITableTypeApiResponse {
  columns: string[];
  rows: any[][];
}

export interface IShippingTableData {
  DeliveryLineId?: string;
  DeliveryId?: string;
  PackFlag?: string;
  [key: string]: any; // Allow for additional dynamic fields
}

export interface IDatabaseConfig {
  name: string;
  location?: string;
}
