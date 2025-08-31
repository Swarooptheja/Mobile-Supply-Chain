import React from 'react';
import { View } from 'react-native';
import { AppHeader } from '../AppHeader';
import { Button } from '../Button';
import { VectorIcon } from '../VectorIcon';

interface ActivityHeaderProps {
  onLogout: () => void;
}

/**
 * Header component for the Activity Screen
 * Contains the title, left icon, and logout button
 * This component reduces inline JSX complexity in the main screen
 */
export const ActivityHeader: React.FC<ActivityHeaderProps> = ({ onLogout }) => {
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
            title="LOGOUT"
            onPress={onLogout}
            colorScheme="danger"
            size="sm"
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
};
