import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { IMediaGalleryProps } from '../types/media.interface';
import Button from './Button';

const { width: screenWidth } = Dimensions.get('window');
const itemSize = (screenWidth - 40) / 3; // 3 items per row with reduced padding

/**
 * MediaGallery component for displaying captured photos and videos
 * Supports grid layout with remove functionality
 */
export const MediaGallery: React.FC<IMediaGalleryProps> = ({
  media,
  onRemove,
  onView,
  maxItems,
  style,
}) => {
  if (!media || media.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📷</Text>
        <Text style={styles.emptyStateText}>No media items yet</Text>
      </View>
    );
  }

  const displayMedia = maxItems ? media.slice(0, maxItems) : media;
  const hasMore = maxItems && media.length > maxItems;

  const renderMediaItem = (item: any, index: number) => {
    const isVideo = item.type === 'video';
    
    return (
      <View key={item.id} style={styles.mediaItem}>
        <TouchableOpacity
          style={styles.mediaContainer}
          onPress={() => onView(item)}
          activeOpacity={0.8}
        >
          {isVideo ? (
            <View style={styles.videoContainer}>
              <Image
                source={{ 
                  uri: item.thumbnail ? 
                    (item.thumbnail.startsWith('data:') ? item.thumbnail : `data:image/jpeg;base64,${item.thumbnail}`) :
                    (item.base64 ? `data:image/jpeg;base64,${item.base64}` : item.uri)
                }}
                style={styles.mediaImage}
                resizeMode="cover"
              />
              <View style={styles.videoOverlay}>
                <Text style={styles.playIcon}>▶️</Text>
                {item.duration && item.duration > 0 && (
                  <Text style={styles.durationText}>
                    {Math.round(item.duration)}s
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <Image
              source={{ 
                uri: item.base64 ? 
                  (item.base64.startsWith('data:') ? item.base64 : `data:image/jpeg;base64,${item.base64}`) :
                  item.uri
              }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          )}
          
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaType}>
              {isVideo ? '🎥' : '📷'}
            </Text>
            <Text style={styles.mediaSize}>
              {(item.size / 1024 / 1024).toFixed(1)}MB
            </Text>
          </View>
        </TouchableOpacity>
        
        <Button
          title="Remove"
          onPress={() => onRemove(item.id)}
          size="sm"
          variant="ghost"
          colorScheme="danger"
          style={styles.removeButton}
          textStyle={styles.removeButtonText}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {media[0]?.type === 'video' ? 'Videos' : 'Photos'} ({media.length})
        </Text>
        {hasMore && (
          <Text style={styles.moreText}>
            +{media.length - maxItems!} more
          </Text>
        )}
      </View>
      
      <View style={styles.grid}>
        {displayMedia.map(renderMediaItem)}
      </View>
      
      {hasMore && (
        <View style={styles.moreContainer}>
          <Text style={styles.moreInfo}>
            Showing {maxItems} of {media.length} items
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  moreText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  mediaItem: {
    width: itemSize,
    alignItems: 'center',
  },
  mediaContainer: {
    width: itemSize,
    height: itemSize,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  durationText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediaInfo: {
    position: 'absolute',
    top: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaType: {
    fontSize: 12,
  },
  mediaSize: {
    fontSize: 10,
    color: '#666',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  removeButton: {
    marginTop: 8,
    minWidth: 60,
    height: 28,
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  removeButtonText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '500',
  },
  moreContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  moreInfo: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  emptyStateIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default MediaGallery;
