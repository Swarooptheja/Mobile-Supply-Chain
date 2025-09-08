import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { VectorIcon } from './VectorIcon';
import { useTheme } from '../context/ThemeContext';
import { createSyncButtonStyles } from '../styles/SyncButton.styles';

interface SyncButtonProps {
  onPress: () => void;
  isSyncing: boolean;
  pendingCount: number;
  disabled?: boolean;
  testID?: string;
}

export const SyncButton: React.FC<SyncButtonProps> = ({
  onPress,
  isSyncing,
  pendingCount,
  disabled = false,
  testID = 'sync-button'
}) => {
  const theme = useTheme();
  const styles = createSyncButtonStyles(theme);

  const isDisabled = disabled || isSyncing || pendingCount === 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDisabled && styles.disabledContainer
      ]}
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {isSyncing ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={styles.icon}
          />
        ) : (
          <VectorIcon
            name="sync"
            size={16}
            color={isDisabled ? theme.colors.textSecondary : theme.colors.primary}
            style={styles.icon}
          />
        )}
        
        <Text style={[
          styles.text,
          isDisabled && styles.disabledText
        ]}>
          {isSyncing ? 'Syncing...' : `Sync (${pendingCount})`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
