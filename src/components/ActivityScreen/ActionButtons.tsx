import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { Button } from '../Button';
import { createActionButtonsStyles } from '../../styles/ActivityScreen.styles';
import { getButtonColor } from '../../styles/global.styles';

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
  
  // Show retry button when there are failures
  if (!showRetryButton) {
    return null;
  }
  
  return (
    <View>
      <Button
        title={`Retry ${failedCount || 0} Failed API${(failedCount || 0) !== 1 ? 's' : ''}`}
        onPress={onRetryFailed}
        disabled={isProcessing}
        variant="solid"
        size="lg"
        fullWidth
        style={{ backgroundColor: getButtonColor() }}
      />

    </View>
  );
};
