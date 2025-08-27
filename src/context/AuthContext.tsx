import React, { createContext, ReactNode, useContext, useState } from 'react';
import { loginApi, getInventoryOrganizationsApi, getInventoryOrganizationsMetadataApi } from '../services/api';
import { IAuthContext, ILoginCredentials } from '../types/auth';
import { useDynamicTables } from '../hooks';
import { TableNames } from '../constants/tables';
import { useToast } from '../utils/toastUtils';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { getDataFromResultSet } from '../../services/sharedService';
import { LOGIN_QUERIES } from '../constants/queries';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  
  const { createTableFromApiResponse } = useDynamicTables();
  const { showApiErrorToast, showSuccessToast } = useToast();
  const [defaultOrgId, setDefaultOrgId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
 
  const login = async (credentials: ILoginCredentials): Promise<void> => {
    try {
      const response = await loginApi(credentials);
      
      // Create login table from API response metadata and data
      if (response.metadata && response.data.length) {
        if(response.data[0].STATUS === "0"){
          showApiErrorToast('Login failed');
          return;
        }
        const tableResult = await createTableFromApiResponse(
          TableNames.LOGIN,
          response.metadata,
          response.data
        );
        
        if (!tableResult.success) {
          // Show toast for API failures
          showApiErrorToast(tableResult.error || 'Login failed');
          throw new Error(`Failed to create login table: ${tableResult.error}`);
        }

        const defaultOrgData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_DEFAULT_ORG_ID);
        
        // Add safety check for the query result
        if (!defaultOrgData) {
          console.warn('Login: defaultOrgData is undefined from database query');
          showApiErrorToast('Failed to retrieve organization data');
          return;
        };
        
        const orgDataArray = getDataFromResultSet(defaultOrgData);
        
        if (!orgDataArray || !orgDataArray.length) {
          console.warn('Login: No organization data found in database');
          showApiErrorToast('No organization data found');
          return;
        };
        
        const resolvedOrgId: string | undefined = orgDataArray[0]?.DEFAULT_ORG_ID;
        setDefaultOrgId(resolvedOrgId ?? null);

        if(!resolvedOrgId) {
          showApiErrorToast('Default Organization ID not found');
          return;
        };
        
        // Fetch org metadata and data, then create table and insert for offline use
        try {
          const [orgMetadata, orgDataResponse] = await Promise.all([
            getInventoryOrganizationsMetadataApi(),
            getInventoryOrganizationsApi(resolvedOrgId)
          ]);

          const dataArray = orgDataResponse?.ActiveInventories || orgDataResponse?.Response || [];
          await createTableFromApiResponse(
            TableNames.ORGANIZATIONS,
            orgMetadata,
            dataArray
          );
        } catch (orgError) {
          console.warn('Organizations fetch/store failed:', orgError);
        }

        // Show success toast
        showSuccessToast('Login Successful', 'Welcome back!');
        setIsAuthenticated(true);
      }


    } catch (error) {
      console.error('Login error:', error);
      
      // Show appropriate toast message based on error type
      if (error instanceof Error) {
        showApiErrorToast(error.message);
        
        // Provide user-friendly error messages
        if (error.message.includes('Failed to connect')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('Invalid response')) {
          throw new Error('Server error. Please try again later.');
        } else if (error.message.includes('Login failed') || error.message.includes('API call failed')) {
          throw new Error('Invalid username or password. Please check your credentials.');
        } else if (error.message.includes('no assigned responsibilities')) {
          throw new Error('Your account has no assigned responsibilities. Please contact your administrator.');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      } else {
        showApiErrorToast('An unexpected error occurred. Please try again.');
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = (): void => {
    setIsAuthenticated(false);
    setDefaultOrgId(null);
  };


  const value: IAuthContext = {
    login,
    defaultOrgId,
    isAuthenticated,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
