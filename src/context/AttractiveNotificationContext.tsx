import React, { createContext, useContext, useState, ReactNode } from 'react';
import AttractiveNotification from '../components/AttractiveNotification';

export interface IAttractiveNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface IAttractiveNotificationContext {
  showNotification: (notification: Omit<IAttractiveNotification, 'id'>) => void;
  hideNotification: (id: string) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
}

const AttractiveNotificationContext = createContext<IAttractiveNotificationContext | undefined>(undefined);

interface IAttractiveNotificationProviderProps {
  children: ReactNode;
}

export const AttractiveNotificationProvider: React.FC<IAttractiveNotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<IAttractiveNotification[]>([]);

  const showNotification = (notification: Omit<IAttractiveNotification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: IAttractiveNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    showNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    showNotification({ type: 'error', title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    showNotification({ type: 'info', title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    showNotification({ type: 'warning', title, message, duration });
  };

  return (
    <AttractiveNotificationContext.Provider value={{ 
      showNotification, 
      hideNotification, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning 
    }}>
      {children}
      {notifications.map(notification => (
        <AttractiveNotification
          key={notification.id}
          visible={true}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onHide={() => hideNotification(notification.id)}
        />
      ))}
    </AttractiveNotificationContext.Provider>
  );
};

export const useAttractiveNotification = (): IAttractiveNotificationContext => {
  const context = useContext(AttractiveNotificationContext);
  if (context === undefined) {
    throw new Error('useAttractiveNotification must be used within an AttractiveNotificationProvider');
  }
  return context;
};
