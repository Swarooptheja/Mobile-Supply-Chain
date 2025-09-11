import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { CommonIcon } from './VectorIcon';
import { createMediaEmptyStateStyles } from '../styles/MediaEmptyState.styles';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/global.styles';
import { useTranslation } from '../hooks/useTranslation';

interface MediaEmptyStateProps {
  style?: any;
}

const MediaEmptyState: React.FC<MediaEmptyStateProps> = memo(({ style }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createMediaEmptyStateStyles(theme);
  const isDark = theme.colors.background === '#121212';

  return (
    <View style={[styles.emptyStateContainer, style]}>
      <View style={styles.emptyStateContent}>
        <CommonIcon icon="camera" size={48} color={theme.colors.textPrimary} />
        <Text style={styles.emptyStateTitle}>{t('loadToDock.noPhotosCaptured')}</Text>
        <Text style={styles.emptyStateSubtitle}>{t('loadToDock.useButtonsToAdd')}</Text>
      </View>
    </View>
  );
});

MediaEmptyState.displayName = 'MediaEmptyState';

export { MediaEmptyState };
