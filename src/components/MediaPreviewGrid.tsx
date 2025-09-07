import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { IMediaItem } from '../types/media.interface';
import { createMediaPreviewGridStyles } from '../styles/MediaPreviewGrid.styles';
import { useTheme } from '../context/ThemeContext';

interface MediaPreviewGridProps {
  media: IMediaItem[];
  onRemove: (mediaId: string) => void;
  style?: any;
}

const MediaPreviewGrid: React.FC<MediaPreviewGridProps> = memo(({
  media,
  onRemove,
  style
}) => {
  const theme = useTheme();
  const styles = createMediaPreviewGridStyles(theme);

  const photoCount = media.filter(m => m.type === 'photo').length;
  const videoCount = media.filter(m => m.type === 'video').length;

  if (media.length === 0) {
    return null;
  }

  return (
    <View style={[styles.previewSection, style]}>
      <View style={styles.previewHeader}>
        <Text style={styles.previewTitle}>Media Preview</Text>
        <Text style={styles.previewCount}>
          {photoCount} photos, {videoCount} videos
        </Text>
      </View>
      <View style={styles.mediaGrid}>
        {media.map((mediaItem) => (
          <MediaItem
            key={mediaItem.id}
            media={mediaItem}
            onRemove={onRemove}
            styles={styles}
          />
        ))}
      </View>
    </View>
  );
});

interface MediaItemProps {
  media: IMediaItem;
  onRemove: (mediaId: string) => void;
  styles: any;
}

const MediaItem: React.FC<MediaItemProps> = memo(({ media, onRemove, styles }) => {
  const handleRemove = () => {
    onRemove(media.id);
  };

  const getImageSource = () => {
    if (media.base64) {
      return media.base64.startsWith('data:') 
        ? media.base64 
        : `data:image/jpeg;base64,${media.base64}`;
    }
    return media.uri;
  };

  return (
    <View style={styles.mediaItem}>
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: getImageSource() }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
        
        {/* Video overlay for videos */}
        {media.type === 'video' && (
          <View style={styles.videoOverlay}>
            <Text style={styles.playIcon}>▶️</Text>
            {media.duration && media.duration > 0 && (
              <Text style={styles.durationText}>
                {Math.round(media.duration)}s
              </Text>
            )}
          </View>
        )}
        
        {/* Remove button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          activeOpacity={0.8}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
        
        {/* Media info for videos */}
        {media.type === 'video' && (
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaSize}>
              {media.size ? `${(media.size / 1024 / 1024).toFixed(1)}MB` : '0.0MB'}
            </Text>
          </View>
        )}
        
        {/* Media type indicator */}
        <View style={styles.mediaTypeIndicator}>
          <Text style={styles.mediaTypeText}>
            {media.type === 'photo' ? '📷' : '🎥'}
          </Text>
        </View>
      </View>
    </View>
  );
});

MediaItem.displayName = 'MediaItem';
MediaPreviewGrid.displayName = 'MediaPreviewGrid';

export { MediaPreviewGrid };
