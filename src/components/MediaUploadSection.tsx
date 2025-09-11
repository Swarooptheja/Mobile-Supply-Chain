import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CommonIcon } from './VectorIcon';
import { createMediaUploadSectionStyles } from '../styles/MediaUploadSection.styles'	;
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

interface MediaUploadSectionProps {
  onPhotoUpload: () => void;
  onVideoUpload: () => void;
  style?: any;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = memo(({
  onPhotoUpload,
  onVideoUpload,
  style
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = createMediaUploadSectionStyles(theme);

  return (
    <View style={[styles.uploadSection, style]}>
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={onPhotoUpload}
        activeOpacity={0.8}
      >
        <CommonIcon icon="camera" size={25} color="#ffffff" />
        <Text style={styles.uploadButtonText}>{t('loadToDock.uploadPhotos')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.uploadButton, styles.uploadButtonSecondary]}
        onPress={onVideoUpload}
        activeOpacity={0.8}
      >
        <CommonIcon icon="video" size={25} color={theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a'} />
        <Text style={[styles.uploadButtonText, styles.uploadButtonTextSecondary]}>{t('loadToDock.uploadVideos')}</Text>
      </TouchableOpacity>
    </View>
  );
});

MediaUploadSection.displayName = 'MediaUploadSection';

export { MediaUploadSection };
