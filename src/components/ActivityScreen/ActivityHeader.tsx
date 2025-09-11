import React, { useCallback } from 'react';
import { View } from 'react-native';
import { AppHeader } from '../AppHeader';
import { Button } from '../Button';
import { VectorIcon } from '../VectorIcon';
import { getButtonColor } from '../../styles/global.styles';
import { useTranslation } from '../../hooks/useTranslation';

interface ActivityHeaderProps {
  onLogout: () => void;
}

/**
 * Header component for the Activity Screen
 * Contains the title, left icon, and logout button
 * This component reduces inline JSX complexity in the main screen
 */
export const ActivityHeader: React.FC<ActivityHeaderProps> = React.memo(({ onLogout }) => {
  const { t } = useTranslation();
  
  // Memoize the logout handler to prevent unnecessary re-renders
  const handleLogout = useCallback(() => {
    onLogout();
  }, [onLogout]);

  return (
    <AppHeader 
      title={t('activity.title')} 
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
            title={t('activity.logout')}
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
            accessibilityLabel={t('activity.logoutButton')}
          />
        </View>
      }
    />
  );
});
