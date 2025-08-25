export interface ISimpleDatabaseService {
  init(): Promise<boolean>;
  close(): Promise<void>;
  executeQuery(query: string, params?: any[]): Promise<any>;
  isInitialized(): boolean;
}

export interface IDatabaseConfig {
  name: string;
  location?: string;
}
