import { API_ENDPOINTS } from '../config/api';

export interface IApiConfig {
  responsibility: string;
  apiName: string;
  url: string;
  type: 'master' | 'config' | 'transactional';
  requiresOrgId: boolean;
  requiresDefaultOrgId: boolean;
  tableType: 'json' | 'table';
  version: string;
  lastSyncTime?: boolean;
  fullRefresh?: boolean;
  queries?: string[];
}

export const CONFIG_APIS: Record<string, Omit<IApiConfig, 'responsibility'>> = {
  REASON: {
    url: API_ENDPOINTS.REASON,
    type: 'config',
    requiresOrgId: false,
    requiresDefaultOrgId: false,
    tableType: 'json',
    version: 'EBS/20D',
    apiName: 'Reasons'
  },
  GL_PERIODS: {
    url: API_ENDPOINTS.GL_PERIODS,
    type: 'config',
    requiresOrgId: false,
    requiresDefaultOrgId: true,
    tableType: 'json',
    version: 'EBS/20D',
    apiName: 'GL Periods'
  },
  INVENTORY_PERIODS: {
    url: API_ENDPOINTS.INVENTORY_PERIODS,
    type: 'config',
    requiresOrgId: true,
    requiresDefaultOrgId: true,
    tableType: 'json',
    version: 'EBS/20D',
    lastSyncTime: false,
    fullRefresh: false,
    apiName: 'Inventory Periods'
  },
};

export class ConfigApiService {
  static getConfigApis(): Record<string, Omit<IApiConfig, 'responsibility'>> {
    return CONFIG_APIS;
  }

  static getConfigApi(key: string): Omit<IApiConfig, 'responsibility'> | undefined {
    return CONFIG_APIS[key];
  }

  static getConfigApiKeys(): string[] {
    return Object.keys(CONFIG_APIS);
  }

  static getConfigApiNames(): string[] {
    return Object.values(CONFIG_APIS).map(api => api.apiName);
  }
}
