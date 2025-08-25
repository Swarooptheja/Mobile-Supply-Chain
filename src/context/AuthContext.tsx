import React, { createContext, ReactNode, useContext, useState } from 'react';
import { extractUserData, loginApi } from '../services/api';
import { IAuthContext, ILoginCredentials, IUser } from '../types/auth';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
}



export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [defaultOrgId, setDefaultOrgId] = useState<string | null>(null);
 
  const login = async (credentials: ILoginCredentials): Promise<void> => {
    try {
      const response = await loginApi(credentials);
      
      const { user: userData, responsibilities: userResponsibilities, defaultOrgId: orgId, hasDefaultOrgId } = extractUserData(response);

      if (userResponsibilities.length === 0) {
        throw new Error('User has no assigned responsibilities');
      }

      // Update state
      setUser(userData);
      setResponsibilities(userResponsibilities);
      setDefaultOrgId(orgId);
      setIsAuthenticated(true);

      // Log success for debugging
      console.log('Login successful:', {
        user: userData.name,
        responsibilities: userResponsibilities,
        hasDefaultOrgId,
        defaultOrgId: orgId,
      });

    } catch (error) {
      console.error('Login error:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Failed to connect')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        } else if (error.message.includes('Invalid response')) {
          throw new Error('Server error. Please try again later.');
        } else if (error.message.includes('Login failed')) {
          throw new Error('Invalid username or password. Please check your credentials.');
        } else if (error.message.includes('no assigned responsibilities')) {
          throw new Error('Your account has no assigned responsibilities. Please contact your administrator.');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      
      // Reset state
      setUser(null);
      setResponsibilities([]);
      setDefaultOrgId(null);
      setIsAuthenticated(false);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if storage clearing fails, reset the state
      setUser(null);
      setResponsibilities([]);
      setDefaultOrgId(null);
      setIsAuthenticated(false);
    }
  };

  const value: IAuthContext = {
    user,
    isAuthenticated,
    login,
    logout,
    responsibilities,
    defaultOrgId,
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
