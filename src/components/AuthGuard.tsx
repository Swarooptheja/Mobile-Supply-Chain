import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface AuthGuardProps {
  children: React.ReactNode;
  allowBack?: boolean;
  onBackPress?: () => void;
}

/**
 * AuthGuard component prevents back navigation and handles hardware back button
 * 
 * @param allowBack - Whether back navigation is allowed (default: false)
 * @param onBackPress - Custom handler for back press (optional)
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  allowBack = false, 
  onBackPress 
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle hardware back button on Android
    if (Platform.OS === 'android') {
      const backAction = () => {
        if (allowBack) {
          if (onBackPress) {
            onBackPress();
          } else {
            // Check if there's a screen to go back to
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }
          return true;
        }
        // Prevent back navigation
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
  }, [allowBack, onBackPress, navigation]);

  return <>{children}</>;
};

export default AuthGuard;
