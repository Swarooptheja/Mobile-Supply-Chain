import React, { createContext, ReactNode, useContext, useState } from 'react';
import { loginApi, getInventoryOrganizationsApi, getInventoryOrganizationsMetadataApi } from '../services/api';
import { IAuthContext, ILoginCredentials, IUser, IUserResponse } from '../types/auth';
import { useDynamicTables } from '../hooks';
import { TableNames } from '../constants/tables';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { simpleDatabaseService } from '../services/simpleDatabase';
import { getDataFromResultSet } from '../../services/sharedService';
import { LOGIN_QUERIES } from '../constants/queries';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  
  const { createTableFromApiResponse } = useDynamicTables();
  const { showSuccess, showError } = useAttractiveNotification();
  const [defaultOrgId, setDefaultOrgId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUserResponse | null>(null);
 
  const login = async (credentials: ILoginCredentials, onSuccess?: () => void): Promise<void> => {
    try {
      const response = await loginApi(credentials);
      
      // Create login table from API response metadata and data
      if (response.metadata && response.data.length) {
        if(response.data[0].STATUS === "0"){
          showError('Login Failed', 'Invalid credentials');
          return;
        }
        const tableResult = await createTableFromApiResponse(
          TableNames.LOGIN,
          response.metadata,
          response.data
        );
        
        if (!tableResult.success) {
          // Show attractive notification for API failures
          showError('Login Failed', tableResult.error || 'Failed to create login table');
          throw new Error(`Failed to create login table: ${tableResult.error}`);
        }

        const defaultOrgData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_DEFAULT_ORG_ID);
        
        // Add safety check for the query result
        if (!defaultOrgData) {
          showError('Login Failed', 'Default Organization ID not found');
          return;
        };
        
        const orgDataArray = getDataFromResultSet(defaultOrgData);
        
        if (!orgDataArray || !orgDataArray.length) {
          showError('Login Failed', 'No organization data found');
          return;
        };
        
        const resolvedOrgId: string | undefined = orgDataArray[0]?.DEFAULT_ORG_ID;
        setDefaultOrgId(resolvedOrgId ?? null);

        if(!resolvedOrgId) {
          showError('Login Failed', 'Default Organization ID not found');
          return;
        };

        const fullNameData = await simpleDatabaseService.executeQuery(LOGIN_QUERIES.GET_FULL_NAME);
        const fullNameArray = getDataFromResultSet(fullNameData);
        setUser(fullNameArray[0] ?? null);
        
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
          throw new Error('Failed to fetch organizations');
        }

        // Show attractive success notification
        showSuccess(`Hello ${credentials.username}, you've successfully logged in.`);
        
        // Add a small delay to ensure the notification is visible before navigation
        await new Promise<void>(resolve => setTimeout(resolve, 2000));
        
        // Set authentication state after showing notification
        setIsAuthenticated(true);
        
        // Call the success callback if provided (for navigation)
        if (onSuccess) {
          onSuccess();
        }
      }


    } catch (error) {
      console.error('Login error:', error);
      
      // Show appropriate attractive notification based on error type
      if (error instanceof Error) {
        showError('Login Failed', error.message);
        
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
        showError('Login Failed', 'An unexpected error occurred. Please try again.');
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
    user,
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
