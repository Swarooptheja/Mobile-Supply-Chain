import { API_ENDPOINTS, buildApiUrl, getApiHeaders } from '../config/api';
import { ILoginCredentials, ILoginResponse } from '../types/auth';
import { IApiResponseMetadata } from '../types/database';
import { apiPost, apiGet } from '../../services/sharedService';

export const loginApi = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
  const url = buildApiUrl(API_ENDPOINTS.LOGIN);
  
  try {
    const response = await apiPost<ILoginResponse>(url, {
      username: credentials.username,
      password: credentials.password,
    }, getApiHeaders());
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to connect to the server. Please check your internet connection.');
  }
};

export const getInventoryOrganizationsApi = async (defaultOrgId: string | number): Promise<any> => {
  const url = buildApiUrl(`${API_ENDPOINTS.INVENTORY_ORGS}/${defaultOrgId}`);
  
  try {
    const response = await apiGet(url, getApiHeaders());
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch organizations.');
  }
};

export const getInventoryOrganizationsMetadataApi = async (): Promise<IApiResponseMetadata[]> => {
  const url = buildApiUrl(API_ENDPOINTS.INVENTORY_ORGS_METADATA);
  
  try {
    const response = await apiGet<IApiResponseMetadata[]>(url, getApiHeaders());
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch organization metadata.');
  }
};

export const getSalesOrdersForShippingTableApi = async (orgId: string | number): Promise<any> => {
  const url = buildApiUrl(`${API_ENDPOINTS.SALES_ORDERS_SHIPPING}/${orgId}/""`);
  
  try {
    const response = await apiGet(url, getApiHeaders());
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch shipping table data.');
  }
};
