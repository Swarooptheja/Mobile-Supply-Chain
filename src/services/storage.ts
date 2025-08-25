import AsyncStorage from '@react-native-async-storage/async-storage';
import { databaseService, dbHelpers } from './database';


export interface IStorageService {
  saveUser(user: any): Promise<void>;
  getUser(): Promise<any | null>;
  saveResponsibilities(responsibilities: string[]): Promise<void>;
  getResponsibilities(): Promise<string[]>;
  saveDefaultOrgId(orgId: string): Promise<void>;
  getDefaultOrgId(): Promise<string | null>;
  setCurrentUserId(userId: string): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  clearAll(): Promise<void>;
  isDatabaseAvailable(): Promise<boolean>;
}

class StorageService implements IStorageService {
  private useDatabase: boolean = true;

  constructor() {
    // Check if database is available
    this.useDatabase = databaseService.isInitialized();
  }

  async updateDatabaseAvailability(): Promise<void> {
    try {
      const isReady = await databaseService.waitForInitialization();
      this.useDatabase = isReady;
    } catch (error) {
      console.error('Error updating database availability:', error);
      this.useDatabase = false;
    }
  }


  async saveUser(user: any): Promise<void> {
    try {
      if (this.useDatabase) {
        await dbHelpers.saveUser(user);
      }
      // Always save to AsyncStorage as backup
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      // Fallback to AsyncStorage only
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        throw error;
      }
    }
  }


  async clearAll(): Promise<void> {
    try {
      if (this.useDatabase) {
        await dbHelpers.clearAllData();
      }
      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        'user',
        'responsibilities', 
        'defaultOrgId',
        'currentUserId'
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
      // Try to clear AsyncStorage even if database fails
      try {
        await AsyncStorage.multiRemove([
          'user',
          'responsibilities',
          'defaultOrgId', 
          'currentUserId'
        ]);
      } catch (fallbackError) {
        console.error('Fallback clear also failed:', fallbackError);
        throw error;
      }
    }
  }
}

export const storageService = new StorageService();
