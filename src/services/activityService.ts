import { IActivity, IApiResult } from '../types/activity';
import { ApiRefreshService, IApiConfig } from './apiRefreshService';


export class ActivityService {

  static getMasterApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering master APIs for responsibilities:', responsibilities);
    const masterApis = ApiRefreshService.getApiConfigurations(responsibilities)
      .filter(api => api.type === 'master');
    console.log('Filtered master APIs:', masterApis);
    return masterApis;
  }

  static getConfigApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering config APIs for responsibilities:', responsibilities);
    const configApis = ApiRefreshService.getApiConfigurations(responsibilities)
      .filter(api => api.type === 'config');
    console.log('Filtered config APIs:', configApis);
    return configApis;
  }

  static getTransactionalApis(responsibilities: string[]): IApiConfig[] {
    console.log('Filtering transactional APIs for responsibilities:', responsibilities);
    const transactionalApis = ApiRefreshService.getApiConfigurations(responsibilities)
      .filter(api => api.type === 'transactional');
    console.log('Filtered transactional APIs:', transactionalApis);
    return transactionalApis;
  }

  static async processApi(
    apiName: string,
    orgId: string,
    defaultOrgId?: string | null,
    abortSignal?: AbortSignal
  ): Promise<IApiResult> {
    // Delegate to ApiRefreshService for consistency
    return await ApiRefreshService.processApi(apiName, orgId, defaultOrgId, abortSignal);
  }


  // Check if API can proceed based on dependency rules
  static canProceedToDashboard(activities: IActivity[]): boolean {
    // All APIs (master, config, and transactional) must succeed to proceed to dashboard
    return activities.every(a => a.status === 'success');
  }
}
