import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MediaCapture } from './MediaCapture';
import { IMediaItem } from '../types/media.interface';
import { Button } from './Button';

/**
 * Example component demonstrating MediaCapture usage
 */
export const MediaCaptureExample: React.FC = () => {
  const [capturedMedia, setCapturedMedia] = useState<IMediaItem[]>([]);

  const handleMediaCaptured = (media: IMediaItem[]) => {
    setCapturedMedia(media);
    console.log('Media captured:', media.length, 'items');
    
    // Log base64 data for first few items
    media.slice(0, 3).forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        type: item.type,
        size: item.size,
        base64Length: item.base64.length,
        timestamp: new Date(item.timestamp).toLocaleString(),
      });
    });
  };

  const handleMediaRemoved = (mediaId: string) => {
    setCapturedMedia(prev => prev.filter(item => item.id !== mediaId));
    console.log('Media removed:', mediaId);
  };

  const handleSaveMedia = () => {
    if (capturedMedia.length === 0) {
      Alert.alert('No Media', 'Please capture some photos or videos first');
      return;
    }

    // Here you would typically send the media to your backend
    const mediaData = capturedMedia.map(item => ({
      id: item.id,
      type: item.type,
      base64: item.base64,
      size: item.size,
      timestamp: item.timestamp,
      ...(item.type === 'video' && {
        duration: item.duration,
        thumbnail: item.thumbnail,
      }),
    }));

    console.log('Saving media data:', mediaData);
    Alert.alert(
      'Media Saved',
      `Successfully captured ${capturedMedia.length} media items\n\nCheck console for base64 data.`
    );
  };

  const handleClearAll = () => {
    setCapturedMedia([]);
    console.log('All media cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Capture Example</Text>
      <Text style={styles.subtitle}>
        Capture multiple photos and videos with base64 conversion
      </Text>

      {/* Photos Tab */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📷 Photos</Text>
        <MediaCapture
          mediaType="photo"
          maxPhotos={5}
          onMediaCaptured={handleMediaCaptured}
          onMediaRemoved={handleMediaRemoved}
          existingMedia={capturedMedia.filter(media => media.type === 'photo')}
          allowMultiple={true}
          showPreview={true}
        />
      </View>

      {/* Videos Tab */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎥 Videos</Text>
        <MediaCapture
          mediaType="video"
          maxVideos={3}
          onMediaCaptured={handleMediaCaptured}
          onMediaRemoved={handleMediaRemoved}
          existingMedia={capturedMedia.filter(media => media.type === 'video')}
          allowMultiple={true}
          showPreview={true}
        />
      </View>

      {/* Both Media Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Both Photos & Videos</Text>
        <MediaCapture
          mediaType="both"
          maxPhotos={3}
          maxVideos={2}
          onMediaCaptured={handleMediaCaptured}
          onMediaRemoved={handleMediaRemoved}
          existingMedia={capturedMedia}
          allowMultiple={true}
          showPreview={true}
        />
      </View>

      {/* Summary and Actions */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          Total Media: {capturedMedia.length}
        </Text>
        <Text style={styles.summaryText}>
          Photos: {capturedMedia.filter(m => m.type === 'photo').length}
        </Text>
        <Text style={styles.summaryText}>
          Videos: {capturedMedia.filter(m => m.type === 'video').length}
        </Text>

        <View style={styles.actionButtons}>
          <Button
            title="Save All Media"
            onPress={handleSaveMedia}
            disabled={capturedMedia.length === 0}
            style={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
          <Button
            title="Clear All"
            onPress={handleClearAll}
            disabled={capturedMedia.length === 0}
            variant="outline"
            colorScheme="danger"
            style={styles.clearButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  saveButton: {
    minWidth: 120,
  },
  saveButtonText: {
    color: '#FFFFFF',
  },
  clearButton: {
    minWidth: 120,
  },
});

export default MediaCaptureExample;
