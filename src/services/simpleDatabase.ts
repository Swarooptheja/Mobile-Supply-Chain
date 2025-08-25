import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';
import { ISimpleDatabaseService } from '../types/database';

// Enable debugging in development
SQLite.DEBUG(__DEV__);
SQLite.enablePromise(true);

class SimpleDatabaseService implements ISimpleDatabaseService {
  private database: SQLite.SQLiteDatabase | null = null;
  private isDbInitialized: boolean = false;

  async init(): Promise<boolean> {
    try {
      console.log('Starting simple database initialization...');
      
      // Check if SQLite is available
      if (!SQLite || typeof SQLite.openDatabase !== 'function') {
        console.error('SQLite is not available on this platform');
        return false;
      }

      // Open database with simple configuration
      const dbParams = {
        name: 'propel_database.db',
        location: 'default',
        
      };

      console.log('Opening database with params:', dbParams);
      
      // Open the database
      this.database = await SQLite.openDatabase(dbParams);

      if (!this.database) {
        throw new Error('Failed to open database - database object is null');
      }

      console.log('Database opened successfully');
      
      // Test database connection with a simple query
      try {
        await this.database.executeSql('SELECT 1');
        console.log('Database connection test successful');
      } catch (testError) {
        console.error('Database connection test failed:', testError);
        throw new Error(`Database connection test failed: ${testError}`);
      }

      // Create a simple test table
      await this.createTestTable();
      
      this.isDbInitialized = true;
      console.log('Simple database initialized successfully');
      return true;
      
    } catch (error) {
      console.error('Simple database initialization failed:', error);
      this.isDbInitialized = false;
      return false;
    }
  }

  private async createTestTable(): Promise<void> {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      await this.database!.executeSql(createTableQuery);
      console.log('Test table created successfully');
      
      // Insert a test record
      const insertQuery = 'INSERT INTO test_table (name) VALUES (?)';
      await this.database!.executeSql(insertQuery, ['Database initialized successfully']);
      console.log('Test record inserted successfully');
      
    } catch (error) {
      console.error('Error creating test table:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.isDbInitialized && this.database !== null;
  }

  async close(): Promise<void> {
    if (this.database) {
      try {
        await this.database.close();
        this.database = null;
        this.isDbInitialized = false;
        console.log('Database closed successfully');
      } catch (error) {
        console.error('Error closing database:', error);
      }
    }
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    if (!this.database || !this.isDbInitialized) {
      throw new Error('Database is not initialized');
    }

    try {
      const result = await this.database.executeSql(query, params || []);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const simpleDatabaseService = new SimpleDatabaseService();
