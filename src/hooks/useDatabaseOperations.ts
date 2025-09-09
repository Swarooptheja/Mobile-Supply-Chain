import { useState, useCallback } from 'react';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { useTransactionSync } from './useTransactionSync';

/**
 * Clear all tables in the database using simpleDatabase service
 */
const clearAllTables = async (): Promise<void> => {
  try {
    console.log('Starting database clearing process...');
    
    // Get all table names
    const result = await simpleDatabaseService.executeQuery(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    const tables = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      tables.push(result[0].rows.item(i).name);
    }
    
    if (tables.length === 0) {
      console.log('No tables found to clear');
      return;
    }
    
    console.log(`Found ${tables.length} tables to clear:`, tables);
    
    // Clear all tables
    for (const tableName of tables) {
      await simpleDatabaseService.executeQuery(`DELETE FROM ${tableName}`);
      console.log(`Table ${tableName} cleared successfully`);
    }
    
    console.log('All tables cleared successfully');
    
    // Optional: Vacuum database to reclaim space
    try {
      await simpleDatabaseService.executeQuery('VACUUM');
      console.log('Database vacuumed successfully');
    } catch (vacuumError) {
      console.log('Vacuum failed (optional operation):', vacuumError);
    }
    
  } catch (error) {
    console.error('Error clearing all tables:', error);
    throw error;
  }
};

interface UseDatabaseOperationsReturn {
  isClearing: boolean;
  isSyncing: boolean;
  clearDatabase: () => Promise<void>;
  clearDatabaseWithSync: () => Promise<void>;
  resetDatabaseCompletely: () => Promise<void>;
  getDbSize: () => Promise<number>;
}

/**
 * Custom hook for database operations with loading states and error handling
 * Provides reusable database clearing functionality across the app
 */
export const useDatabaseOperations = (): UseDatabaseOperationsReturn => {
  const [isClearing, setIsClearing] = useState(false);
  const { isSyncing, syncAllPendingTransactions, hasPendingTransactions } = useTransactionSync();

  const clearDatabase = useCallback(async (): Promise<void> => {
    if (isClearing) return;
    
    setIsClearing(true);
    try {
      await clearAllTables();
      console.log('Database cleared successfully via hook');
    } catch (error) {
      console.error('Error clearing database via hook:', error);
      throw error;
    } finally {
      setIsClearing(false);
    }
  }, [isClearing]);

  const clearDatabaseWithSync = useCallback(async (): Promise<void> => {
    if (isClearing || isSyncing) return;
    
    setIsClearing(true);
    try {
      // First, check if there are pending transactions
      if (hasPendingTransactions) {
        console.log('Pending transactions found, syncing before clearing database...');
        await syncAllPendingTransactions();
      }
      
      // Then clear the database
      await clearAllTables();
      console.log('Database cleared successfully after sync');
    } catch (error) {
      console.error('Error clearing database with sync:', error);
      throw error;
    } finally {
      setIsClearing(false);
    }
  }, [isClearing, isSyncing, hasPendingTransactions, syncAllPendingTransactions]);

  const resetDatabaseCompletely = useCallback(async (): Promise<void> => {
    if (isClearing) return;
    
    setIsClearing(true);
    try {
      await clearAllTables();
      console.log('Database reset completely via hook');
    } catch (error) {
      console.error('Error resetting database via hook:', error);
      throw error;
    } finally {
      setIsClearing(false);
    }
  }, [isClearing]);

  const getDbSize = useCallback(async (): Promise<number> => {
    try {
      // Get database size using simple database service
      const result = await simpleDatabaseService.executeQuery(
        "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()"
      );
      return result[0]?.rows?.item(0)?.size || 0;
    } catch (error) {
      console.error('Error getting database size via hook:', error);
      return 0;
    }
  }, []);

  return {
    isClearing,
    isSyncing,
    clearDatabase,
    clearDatabaseWithSync,
    resetDatabaseCompletely,
    getDbSize,
  };
};

export default useDatabaseOperations;
