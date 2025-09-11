import React from 'react';
import { View, Text } from 'react-native';
import { VectorIcon } from '../VectorIcon';
import { Button } from '../Button';
import { createActionButtonsStyles } from '../../styles/ActivityScreen.styles';
import { getButtonColor } from '../../styles/global.styles';
import { useTranslation } from '../../hooks/useTranslation';

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
  const { t } = useTranslation();
  
  // Show retry button when there are failures
  if (!showRetryButton) {
    return null;
  }
  
  return (
    <View>
      <Button
        title={t('activity.retryFailedApis', { 
          count: failedCount || 0, 
          plural: (failedCount || 0) !== 1 ? 's' : '' 
        })}
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
