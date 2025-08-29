import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useMediaCapture } from '../hooks/useMediaCapture';
import { IMediaCaptureProps, IMediaItem } from '../types/media.interface';
import MediaGallery from './MediaGallery';
import IconComponent from './icons/IconComponent';
import { CommonIcon } from './VectorIcon';

/**
 * Reusable MediaCapture component for capturing photos and videos
 * Clean, minimalist design optimized for small screens
 */
export const MediaCapture: React.FC<IMediaCaptureProps> = ({
  mediaType,
  maxPhotos = 10,
  maxVideos = 5,
  onMediaCaptured,
  onMediaRemoved,
  existingMedia = [],
  style,
}) => {
  const {
    photos,
    videos,
    isCapturing,
    hasPermission,
    error,
    handleCameraCapture,
    handleGallerySelection,
    removeMedia,
    getAllMedia,
    isPhotoLimitReached,
    isVideoLimitReached,
    initializeWithExistingMedia,
  } = useMediaCapture(mediaType, maxPhotos, maxVideos);

  // Initialize with existing media
  useEffect(() => {
    if (existingMedia && existingMedia.length > 0) {
      initializeWithExistingMedia(existingMedia);
    }
  }, [existingMedia, initializeWithExistingMedia]);

  // Track previous media state to avoid unnecessary calls
  const prevMediaRef = useRef<{ photos: IMediaItem[], videos: IMediaItem[] }>({ photos: [], videos: [] });
  const isFirstRenderRef = useRef(true);
  
  // Notify parent component when media changes
  useEffect(() => {
    // Skip the first render to avoid initial call
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevMediaRef.current = { photos: [...photos], videos: [...videos] };
      return;
    }
    
    // Only call onMediaCaptured with the media type this component is responsible for
    if (mediaType === 'photo') {
      const prevPhotos = prevMediaRef.current.photos;
      if (photos.length !== prevPhotos.length) {
        onMediaCaptured(photos);
      }
    } else if (mediaType === 'video') {
      const prevVideos = prevMediaRef.current.videos;
      if (videos.length !== prevVideos.length) {
        onMediaCaptured(videos);
      }
    } else if (mediaType === 'both') {
      const allMedia = getAllMedia();
      const prevPhotos = prevMediaRef.current.photos;
      const prevVideos = prevMediaRef.current.videos;
      
      if (photos.length !== prevPhotos.length || videos.length !== prevVideos.length) {
        onMediaCaptured(allMedia);
      }
    }
    
    // Update previous media state
    prevMediaRef.current = { photos: [...photos], videos: [...videos] };
  }, [photos, videos, mediaType, getAllMedia, onMediaCaptured]);

  // Handle media removal
  const handleMediaRemoved = (mediaId: string) => {
    const mediaItem = [...photos, ...videos].find(item => item.id === mediaId);
    if (mediaItem) {
      removeMedia(mediaId, mediaItem.type);
      onMediaRemoved(mediaId);
    }
  };

  // Handle camera capture
  const handleTakePhoto = () => {
    if (isPhotoLimitReached()) {
      Alert.alert('Limit Reached', `Maximum ${maxPhotos} photos allowed`);
      return;
    }
    handleCameraCapture('photo');
  };

  const handleTakeVideo = () => {
    if (isVideoLimitReached()) {
      Alert.alert('Limit Reached', `Maximum ${maxVideos} videos allowed`);
      return;
    }
    handleCameraCapture('video');
  };

  // Handle gallery selection
  const handleChooseFromGallery = (type: 'photo' | 'video') => {
    if (type === 'photo' && isPhotoLimitReached()) {
      Alert.alert('Limit Reached', `Maximum ${maxPhotos} photos allowed`);
      return;
    }
    if (type === 'video' && isVideoLimitReached()) {
      Alert.alert('Limit Reached', `Maximum ${maxVideos} videos allowed`);
      return;
    }
    handleGallerySelection(type);
  };

  // Show error if any
  if (error) {
    Alert.alert('Error', error);
  }

  const renderPhotoSection = () => {
    if (mediaType === 'video') return null;

    return (
      <View style={styles.mediaSection}>
        {/* Header Section - Clean and centered like reference image */}
        {/* <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <IconComponent name="camera" size={24} color="#6b7280" />
          </View>
          <Text style={styles.mainTitle}>Capture Photos</Text>
        </View> */}
        
        {/* Action Cards - Modern card-based design */}
        <View style={styles.actionCardsContainer}>
          {/* Take Photo Card */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.primaryActionCard,
              isPhotoLimitReached() && styles.disabledCard
            ]}
            onPress={handleTakePhoto}
            disabled={isPhotoLimitReached() || isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardContent}>
              {/* <View style={styles.actionIconContainer}>
                <IconComponent name="camera" size={20} color="#ffffff" />
              </View> */}
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCardTitle}>Take Photo</Text>
                <Text style={styles.actionCardSubtitle}>Use camera</Text>
              </View>
              {isCapturing && (
                <View style={styles.loadingIndicator}>
                  <IconComponent name="loader" size={16} color="#ffffff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* From Gallery Card */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.secondaryActionCard,
              isPhotoLimitReached() && styles.disabledCard
            ]}
            onPress={() => handleChooseFromGallery('photo')}
            disabled={isPhotoLimitReached() || isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardContent}>
              <View style={[styles.actionIconContainer, styles.secondaryIconContainer]}>
                {/* <IconComponent name="image" size={20} color="#6b7280" /> */}
                <CommonIcon 
                  icon="image"
                  size={25} 
                  color="#6b7280"
                />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCardTitle}>From Gallery</Text>
                <Text style={styles.actionCardSubtitle}>Choose existing</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Photo Preview Section - Clean and simple */}
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Photo Preview</Text>
            <Text style={styles.previewCount}>{photos.length} Photos</Text>
          </View>
          
          {photos.length > 0 ? (
            <MediaGallery
              media={photos}
              onRemove={handleMediaRemoved}
              onView={(_media) => {/* Handle photo view */}}
              maxItems={maxPhotos}
              style={styles.galleryContainer}
            />
          ) : (
            <View style={styles.emptyPreview}>
              <IconComponent name="camera" size={32} color="#d1d5db" />
              <Text style={styles.emptyPreviewText}>No photos captured yet</Text>
              <Text style={styles.emptyPreviewSubtext}>
                Use the cards above to add photos
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderVideoSection = () => {
    if (mediaType === 'photo') return null;

    return (
      <View style={styles.mediaSection}>
        {/* Header Section */}
        {/* <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <IconComponent name="video" size={24} color="#6b7280" />
          </View>
          <Text style={styles.mainTitle}>Capture Video</Text>
          <Text style={styles.mainSubtitle}>
            Record video of the item for documentation
          </Text>
        </View> */}
        
        {/* Action Cards - Modern card-based design */}
        <View style={styles.actionCardsContainer}>
          {/* Take Video Card */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.primaryActionCard,
              isVideoLimitReached() && styles.disabledCard
            ]}
            onPress={handleTakeVideo}
            disabled={isVideoLimitReached() || isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardContent}>
              {/* <View style={styles.actionIconContainer}>
                <IconComponent name="video" size={20} color="#ffffff" />
              </View> */}
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCardTitle}>Take Video</Text>
                <Text style={styles.actionCardSubtitle}>Use camera</Text>
              </View>
              {isCapturing && (
                <View style={styles.loadingIndicator}>
                  <IconComponent name="loader" size={16} color="#ffffff" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* From Gallery Card */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.secondaryActionCard,
              isVideoLimitReached() && styles.disabledCard
            ]}
            onPress={() => handleChooseFromGallery('video')}
            disabled={isVideoLimitReached() || isCapturing}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardContent}>
              <View style={[styles.actionIconContainer, styles.secondaryIconContainer]}>
                <IconComponent name="film" size={20} color="#6b7280" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionCardTitle}>From Gallery</Text>
                <Text style={styles.actionCardSubtitle}>Choose existing</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Video Preview Section */}
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>Video Preview</Text>
            <Text style={styles.previewCount}>{videos.length} Videos</Text>
          </View>
          
          {videos.length > 0 ? (
            <MediaGallery
              media={videos}
              onRemove={handleMediaRemoved}
              onView={(_media) => {/* Handle video view */}}
              maxItems={maxVideos}
              style={styles.galleryContainer}
            />
          ) : (
            <View style={styles.emptyPreview}>
              <IconComponent name="video" size={32} color="#d1d5db" />
              <Text style={styles.emptyPreviewText}>No videos captured yet</Text>
              <Text style={styles.emptyPreviewSubtext}>
                Use the cards above to add videos
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderPermissionWarning = () => {
    if (hasPermission) return null;

    return (
      <View style={styles.permissionWarning}>
        <IconComponent name="alert-triangle" size={20} color="#f59e0b" />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionSubtitle}>
          Please grant camera permission to capture photos and videos
        </Text>
      </View>
    );
  };

  // Use ScrollView for responsive design
  return (
    <ScrollView 
      style={[styles.container, style]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {renderPermissionWarning()}
      
      {/* Render appropriate sections based on mediaType */}
      {mediaType === 'photo' && renderPhotoSection()}
      {mediaType === 'video' && renderVideoSection()}
      {mediaType === 'both' && (
        <>
          {renderPhotoSection()}
          {renderVideoSection()}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    paddingBottom: 32,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  mediaSection: {
    marginBottom: 24,
    width: '100%',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionCard: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  secondaryActionCard: {
    borderColor: '#6b7280',
    borderWidth: 1,
  },
  disabledCard: {
    opacity: 0.7,
  },
  actionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  secondaryIconContainer: {
    backgroundColor: '#e5e7eb',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  previewSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 0.2,
  },
  previewCount: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  galleryContainer: {
    width: '100%',
  },
  emptyPreview: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyPreviewText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyPreviewSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  permissionWarning: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  permissionSubtitle: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
    fontWeight: '500',
  },
});

export default MediaCapture;
