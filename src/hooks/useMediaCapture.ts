import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { IMediaItem } from '../types/media.interface';

interface UseMediaCaptureProps {
  existingMedia?: IMediaItem[];
  onError?: (title: string, message: string) => void;
}

interface UseMediaCaptureReturn {
  capturedMedia: IMediaItem[];
  photoMedia: IMediaItem[];
  videoMedia: IMediaItem[];
  canSave: boolean;
  addMedia: (media: IMediaItem[]) => void;
  removeMedia: (mediaId: string) => void;
  clearMedia: () => void;
  handleCameraCapture: (type: 'photo' | 'video') => Promise<void>;
  handleGallerySelection: (type: 'photo' | 'video') => Promise<void>;
}

export const useMediaCapture = ({ 
  existingMedia, 
  onError 
}: UseMediaCaptureProps): UseMediaCaptureReturn => {
  const [capturedMedia, setCapturedMedia] = useState<IMediaItem[]>(existingMedia || []);

  // Memoized filtered media arrays
  const photoMedia = useMemo(() => 
    capturedMedia.filter(media => media && media.type === 'photo'),
    [capturedMedia]
  );
  
  const videoMedia = useMemo(() => 
    capturedMedia.filter(media => media && media.type === 'video'),
    [capturedMedia]
  );

  // Memoized save validation
  const canSave = useMemo(() => 
    photoMedia.length > 0 && videoMedia.length > 0,
    [photoMedia.length, videoMedia.length]
  );

  const addMedia = useCallback((media: IMediaItem[]) => {
    setCapturedMedia(prev => [...prev, ...media]);
  }, []);

  const removeMedia = useCallback((mediaId: string) => {
    setCapturedMedia(prev => prev.filter(item => item.id !== mediaId));
  }, []);

  const clearMedia = useCallback(() => {
    setCapturedMedia([]);
  }, []);

  const handleCameraCapture = useCallback(async (type: 'photo' | 'video') => {
    try {
      const { launchCamera } = await import('react-native-image-picker');
      
      const options = {
        mediaType: type as any,
        quality: 0.8 as any,
        includeBase64: true,
        maxWidth: 2000,
        maxHeight: 2000,
      };

      launchCamera(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          const newMedia: IMediaItem = {
            id: Date.now().toString(),
            type: type,
            uri: asset.uri || '',
            base64: asset.base64 || '',
            size: asset.fileSize || 0,
            duration: asset.duration || 0,
            thumbnail: asset.base64 || '',
            timestamp: Date.now(),
          };

          addMedia([newMedia]);
        }
      });
    } catch (error) {
      console.error('Camera capture error:', error);
      onError?.('Error', 'Failed to capture media');
    }
  }, [addMedia, onError]);

  const handleGallerySelection = useCallback(async (type: 'photo' | 'video') => {
    try {
      const { launchImageLibrary } = await import('react-native-image-picker');
      
      const options = {
        mediaType: type as any,
        quality: 0.8 as any,
        includeBase64: true,
        maxWidth: 2000,
        maxHeight: 2000,
        selectionLimit: type === 'photo' ? 10 : 5,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel || response.errorMessage) {
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const newMediaItems: IMediaItem[] = response.assets.map((asset, index) => ({
            id: `${Date.now()}_${index}`,
            type: type,
            uri: asset.uri || '',
            base64: asset.base64 || '',
            size: asset.fileSize || 0,
            duration: asset.duration || 0,
            thumbnail: asset.base64 || '',
            timestamp: Date.now(),
          }));

          addMedia(newMediaItems);
        }
      });
    } catch (error) {
      console.error('Gallery selection error:', error);
      onError?.('Error', 'Failed to select media');
    }
  }, [addMedia, onError]);

  return {
    capturedMedia,
    photoMedia,
    videoMedia,
    canSave,
    addMedia,
    removeMedia,
    clearMedia,
    handleCameraCapture,
    handleGallerySelection,
  };
};