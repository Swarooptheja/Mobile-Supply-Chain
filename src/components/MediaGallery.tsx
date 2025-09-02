import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal } from 'react-native';
import { IMediaGalleryProps } from '../types/media.interface';

const { width: screenWidth } = Dimensions.get('window');
const itemSize = screenWidth - 80; // Single column for larger thumbnails with proper margins

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
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleMediaPress = (item: any) => {
    setSelectedMedia(item);
    setModalVisible(true);
    if (onView) {
      onView(item);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  if (!media || media.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>📷</Text>
        <Text style={styles.emptyStateText}>No media items yet</Text>
      </View>
    );
  }

  const displayMedia = maxItems ? media.slice(0, maxItems) : media;
  const hasMore = maxItems && media && media.length > maxItems;

  const renderMediaItem = (item: any, _index: number) => {
    if (!item || !item.id || !item.type) {
      console.warn('Invalid media item:', item);
      return null;
    }
    
    const isVideo = item.type === 'video';
    
    return (
      <View key={item.id} style={styles.mediaItem}>
        <TouchableOpacity
          style={styles.mediaContainer}
          onPress={() => handleMediaPress(item)}
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
          
          {/* Remove button positioned in top-right corner */}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
          
          <View style={styles.mediaInfo}>
            <Text style={styles.mediaType}>
              {isVideo ? '🎥' : '📷'}
            </Text>
            <Text style={styles.mediaSize}>
              {item.size ? `${(item.size / 1024 / 1024).toFixed(1)}MB` : '0.0MB'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Remove the old remove button below thumbnail */}
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {media && media.length > 0 && media[0]?.type === 'video' ? 'Uploaded Videos' : 'Uploaded Photos'} ({media?.length || 0})
          </Text>
          {hasMore && (
            <Text style={styles.moreText}>
              +{(media?.length || 0) - (maxItems || 0)} more
            </Text>
          )}
        </View>
        
        <View style={styles.grid}>
          {displayMedia.filter(Boolean).map(renderMediaItem)}
        </View>
        
        {hasMore && (
          <View style={styles.moreContainer}>
            <Text style={styles.moreInfo}>
              Showing {maxItems || 0} of {media?.length || 0} items
            </Text>
          </View>
        )}
      </View>

      {/* Modal for enlarged view */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1}
            onPress={closeModal}
          >
            {selectedMedia && (
              <Image
                source={{ 
                  uri: selectedMedia.base64 ? 
                    (selectedMedia.base64.startsWith('data:') ? selectedMedia.base64 : `data:image/jpeg;base64,${selectedMedia.base64}`) :
                    selectedMedia.uri
                }}
                style={styles.enlargedImage}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
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
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
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
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  enlargedImage: {
    width: '100%',
    height: '80%',
    maxWidth: screenWidth - 40,
    maxHeight: screenWidth - 40,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MediaGallery;
