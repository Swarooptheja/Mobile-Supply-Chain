import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AppHeader } from '../AppHeader';
import { Button } from '../Button';
import { VectorIcon } from '../VectorIcon';
import { getButtonColor } from '../../styles/global.styles';

interface ActivityHeaderProps {
  onLogout: () => void;
}

/**
 * Header component for the Activity Screen
 * Contains the title, left icon, and logout button
 * This component reduces inline JSX complexity in the main screen
 */
export const ActivityHeader: React.FC<ActivityHeaderProps> = React.memo(({ onLogout }) => {
  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  return (
    <AppHeader 
      title="Sync Activity" 
      leftElement={
        <View style={{ alignItems: 'center' }}>
          <VectorIcon
            name="activity"
            iconSet="Feather"
            size={28}
            color="#FFFFFF"
          />
        </View>
      }
      rightElement={
        <View style={{ alignItems: 'center' }}>
          <Button
            title="Logout"
            onPress={handleLogout}
            colorScheme="primary"
            size="sm"
            style={{ backgroundColor: getButtonColor() }}
            leftIcon={
              <VectorIcon
                name="logout"
                iconSet="MaterialIcons"
                size={14}
                color="#FFFFFF"
              />
            }
            accessibilityLabel="Logout button"
          />
        </View>
      }
    />
  );
});
