import { useState, useCallback } from 'react';
import { dynamicTableService } from '../services/dynamicTableService';
import { TableNames } from '../constants/tables';
import { ITableCreationResult, ITableMetadata, IApiResponseMetadata, ITableTypeApiResponse } from '../types/database';

interface IUseDynamicTablesReturn {
  // State
  isLoading: boolean;
  error: string | null;
  lastOperation: ITableCreationResult | null;
  
  // Actions
  createTableFromApiResponse: (
    tableName: TableNames,
    metadata: IApiResponseMetadata[],
    data: any[]
  ) => Promise<ITableCreationResult>;
  
  createTableFromTableTypeResponse: (
    tableName: TableNames,
    tableTypeResponse: ITableTypeApiResponse
  ) => Promise<ITableCreationResult>;
  
  insertDataIntoTable: (
    tableName: string,
    data: any[]
  ) => Promise<number>;
  
  getTableSchema: (tableName: string) => Promise<ITableMetadata | null>;
  
  tableExists: (tableName: string) => Promise<boolean>;
  
  dropTable: (tableName: string) => Promise<boolean>;
  
  clearError: () => void;
}

export const useDynamicTables = (): IUseDynamicTablesReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<ITableCreationResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createTableFromApiResponse = useCallback(async (
    tableName: TableNames,
    metadata: IApiResponseMetadata[],
    data: any[]
  ): Promise<ITableCreationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dynamicTableService.createTableFromMetadata(
        tableName,
        metadata,
        data
      );
      
      setLastOperation(result);
      
      if (!result.success) {
        setError(result.error || 'Failed to create table');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failedResult: ITableCreationResult = {
        success: false,
        tableName,
        columnsCreated: 0,
        rowsInserted: 0,
        error: errorMessage,
      };
      
      setLastOperation(failedResult);
      return failedResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTableFromTableTypeResponse = useCallback(async (
    tableName: TableNames,
    tableTypeResponse: ITableTypeApiResponse
  ): Promise<ITableCreationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dynamicTableService.createTableFromTableTypeResponse(
        tableName,
        tableTypeResponse
      );
      
      setLastOperation(result);
      
      if (!result.success) {
        setError(result.error || 'Failed to create table');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      const failedResult: ITableCreationResult = {
        success: false,
        tableName,
        columnsCreated: 0,
        rowsInserted: 0,
        error: errorMessage,
      };
      
      setLastOperation(failedResult);
      return failedResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const insertDataIntoTable = useCallback(async (
    tableName: string,
    data: any[]
  ): Promise<number> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const insertedCount = await dynamicTableService.insertDataIntoTable(tableName, data);
      return insertedCount;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTableSchema = useCallback(async (
    tableName: string
  ): Promise<ITableMetadata | null> => {
    try {
      return await dynamicTableService.getTableSchema(tableName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    }
  }, []);

  const tableExists = useCallback(async (
    tableName: string
  ): Promise<boolean> => {
    try {
      return await dynamicTableService.tableExists(tableName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    }
  }, []);

  const dropTable = useCallback(async (
    tableName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await dynamicTableService.dropTable(tableName);
      if (!success) {
        setError(`Failed to drop table ${tableName}`);
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    lastOperation,
    
    // Actions
    createTableFromApiResponse,
    createTableFromTableTypeResponse,
    insertDataIntoTable,
    getTableSchema,
    tableExists,
    dropTable,
    clearError,
  };
};
