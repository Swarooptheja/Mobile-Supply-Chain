import { API_ENDPOINTS, buildApiUrl, getApiHeaders } from '../config/api';
import { ILoginCredentials, ILoginResponse } from '../types/auth';
import { IApiResponseMetadata } from '../types/database';

export const loginApi = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
  const url = buildApiUrl(API_ENDPOINTS.LOGIN);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ILoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('Failed to connect to the server. Please check your internet connection.');
  }
};

export const getInventoryOrganizationsApi = async (defaultOrgId: string | number): Promise<any> => {
  const url = buildApiUrl(`${API_ENDPOINTS.INVENTORY_ORGS}/${defaultOrgId}`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getInventoryOrganizations API error:', error);
    throw new Error('Failed to fetch organizations.');
  }
};

export const getInventoryOrganizationsMetadataApi = async (): Promise<IApiResponseMetadata[]> => {
  const url = buildApiUrl(API_ENDPOINTS.INVENTORY_ORGS_METADATA);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getInventoryOrganizations metadata API error:', error);
    throw new Error('Failed to fetch organization metadata.');
  }
};

export const getSalesOrdersForShippingTableApi = async (orgId: string | number): Promise<any> => {
  const url = buildApiUrl(`${API_ENDPOINTS.SALES_ORDERS_SHIPPING}/${orgId}/""`);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('getSalesOrdersForShippingTable API error:', error);
    throw new Error('Failed to fetch shipping table data.');
  }
};

// Helper function to extract user data from API response
// export const extractUserData = (response: ILoginResponse) => {
//   if (!response.data || !response.data.length) {
//     throw new Error('Invalid response from server');
//   }

//   const firstRecord = response.data[0];
  
//   // Check if login was successful
//   if (firstRecord.STATUS !== '1') {
//     throw new Error('Login failed. Please check your credentials.');
//   }

//   // Extract all responsibilities from the response
//   const responsibilities = response.data
//     .map(record => record.RESPONSIBILITY)
//     .filter(Boolean) as string[];

//   // Check if at least one record has DEFAULT_ORG_ID
//   const hasDefaultOrgId = response.data.some(record => record.DEFAULT_ORG_ID);
//   const defaultOrgId = firstRecord.DEFAULT_ORG_ID || null;

//   return {
//     user: {
//       id: firstRecord.USER_ID,
//       username: firstRecord.USER_NAME,
//       name: firstRecord.FULL_NAME || firstRecord.USER_NAME,
//       userId: firstRecord.USER_ID,
//       personId: firstRecord.PERSON_ID,
//       fullName: firstRecord.FULL_NAME,
//       responsibilities,
//       defaultOrgId: firstRecord.DEFAULT_ORG_ID,
//       defaultInvOrgName: firstRecord.DEFAULT_INV_ORG_NAME,
//       setOfBookId: firstRecord.SET_OF_BOOK_ID,
//       responsibilityId: firstRecord.RESPONSIBILITY_ID,
//     },
//     responsibilities,
//     defaultOrgId,
//     hasDefaultOrgId,
//   };
// };
