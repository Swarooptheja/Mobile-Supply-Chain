import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUser, ILoginCredentials, IAuthContext } from '../types/auth';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials: ILoginCredentials): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
      
      // Dummy validation - in real app, this would be API call
      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const dummyUser: IUser = {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
        };
        
        setUser(dummyUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: IAuthContext = {
    user,
    isAuthenticated,
    login,
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
