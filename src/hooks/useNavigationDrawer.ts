import { useState, useCallback } from 'react';
import { INavigationMenuItem } from '../types/dashboard.interface';

export const useNavigationDrawer = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerVisible(false);
  }, []);

  const handleMenuItemPress = useCallback((item: INavigationMenuItem) => {
    // Handle menu item actions here
    // The drawer will close automatically when items are pressed
    
    switch (item.id) {
      case 'home':
        // Navigate to home
        break;
      case 'chat':
        // Navigate to chat
        break;
      case 'settings':
        // Navigate to settings
        break;
      case 'logout':
        // Handle logout
        break;
      case 'logoutClear':
        // Handle logout with clear data
        break;
      default:
        break;
    }
  }, []);

  return {
    isDrawerVisible,
    openDrawer,
    closeDrawer,
    handleMenuItemPress,
  };
};
