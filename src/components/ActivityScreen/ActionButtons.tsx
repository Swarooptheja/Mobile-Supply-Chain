import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { Button } from '../Button';
import { createActionButtonsStyles } from '../../styles/ActivityScreen.styles';

interface ActionButtonsProps {
  showRetryButton: boolean;
  failedCount: number;
  onRetryFailed: () => void;
  isProcessing: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  showRetryButton,
  failedCount,
  onRetryFailed,
  isProcessing
}) => {
  const styles = createActionButtonsStyles();
  
  // Show retry button when there are failures
  if (!showRetryButton) {
    return null;
  }
  
  return (
    <View style={styles.actionSection}>
      <View style={styles.actionHeader}>
        <VectorIcon
          name="refresh"
          iconSet="MaterialIcons"
          size={20}
          color="#3B82F6"
        />
        <Text style={styles.actionTitle}>Retry Failed APIs</Text>
      </View>
      <Button
        title={`Retry ${failedCount || 0} Failed API${(failedCount || 0) !== 1 ? 's' : ''}`}
        onPress={onRetryFailed}
        disabled={isProcessing}
        variant="solid"
        size="lg"
        fullWidth
      />
      <Text style={styles.retryHint}>
        Tap to retry all failed APIs at once
      </Text>
    </View>
  );
};
