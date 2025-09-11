import React, { createContext, ReactNode, useContext, useState } from 'react';

interface IOrganizationContext {
  selectedOrgId: string | null;
  setSelectedOrgId: (orgId: string | null) => void;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(undefined);

interface IOrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<IOrganizationProviderProps> = ({ children }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const value: IOrganizationContext = {
    selectedOrgId,
    setSelectedOrgId,
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};

export const useOrganization = (): IOrganizationContext => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
