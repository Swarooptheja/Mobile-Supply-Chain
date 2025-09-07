import React, { useState, useCallback, useEffect } from 'react';
import { Modal, View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { MediaCapture } from './MediaCapture';
import { IMediaItem } from '../types/media.interface';
import { scale, moderateScale } from 'react-native-size-matters';

export interface IMediaCaptureModalProps {
  visible: boolean;
  onClose: () => void;
  onMediaCaptured: (media: IMediaItem[]) => void;
  mediaType: 'photo' | 'video';
  maxPhotos?: number;
  maxVideos?: number;
  existingMedia?: IMediaItem[];
}

/**
 * MediaCaptureModal component that wraps MediaCapture in a modal
 * Provides a clean interface for capturing media with preview functionality
 */
export const MediaCaptureModal: React.FC<IMediaCaptureModalProps> = ({
  visible,
  onClose,
  onMediaCaptured,
  mediaType,
  maxPhotos = 10,
  maxVideos = 5,
  existingMedia = [],
}) => {
  const [capturedMedia, setCapturedMedia] = useState<IMediaItem[]>([]);

  // Reset captured media when modal opens
  useEffect(() => {
    if (visible) {
      setCapturedMedia([]);
    }
  }, [visible]);

  const handleMediaCaptured = useCallback((media: IMediaItem[]) => {
    setCapturedMedia(media);
  }, []);

  const handleMediaRemoved = useCallback((mediaId: string) => {
    setCapturedMedia(prev => prev.filter(item => item.id !== mediaId));
  }, []);

  const handleConfirm = useCallback(() => {
    if (capturedMedia.length === 0) {
      Alert.alert('No Media', `Please capture at least one ${mediaType} before confirming.`);
      return;
    }
    
    onMediaCaptured(capturedMedia);
    setCapturedMedia([]);
    onClose();
  }, [capturedMedia, mediaType, onMediaCaptured, onClose]);

  const handleCancel = useCallback(() => {
    setCapturedMedia([]);
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {mediaType === 'photo' ? 'Capture Photos' : 'Capture Videos'}
          </Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          <MediaCapture
            mediaType={mediaType}
            maxPhotos={maxPhotos}
            maxVideos={maxVideos}
            onMediaCaptured={handleMediaCaptured}
            onMediaRemoved={handleMediaRemoved}
            existingMedia={existingMedia}
            style={styles.mediaCapture}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  cancelButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
  cancelButtonText: {
    fontSize: moderateScale(16),
    color: '#6b7280',
    fontWeight: '500',
  },
  confirmButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
  },
  confirmButtonText: {
    fontSize: moderateScale(16),
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  mediaCapture: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default MediaCaptureModal;
