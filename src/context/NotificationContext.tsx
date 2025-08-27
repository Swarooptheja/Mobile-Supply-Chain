import React, { createContext, useContext, useState, ReactNode } from 'react';
import NotificationToast from '../components/NotificationToast';

export interface INotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface INotificationContext {
  showNotification: (notification: Omit<INotification, 'id'>) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<INotificationContext | undefined>(undefined);

interface INotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<INotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const showNotification = (notification: Omit<INotification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification: INotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          visible={true}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onHide={() => hideNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): INotificationContext => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
