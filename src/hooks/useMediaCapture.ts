import { useState, useCallback, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { IMediaItem, IMediaCaptureState } from '../types/media.interface';

/**
 * Custom hook for managing media capture functionality
 * Handles camera permissions, photo/video capture, and base64 conversion
 */
export const useMediaCapture = (
  mediaType: 'photo' | 'video' | 'both',
  maxPhotos: number = 10,
  maxVideos: number = 5
) => {
  const [state, setState] = useState<IMediaCaptureState>({
    photos: [],
    videos: [],
    isCapturing: false,
    hasPermission: false,
    error: null,
  });

  // Add a ref to track if we've initialized with existing media
  const initializedRef = useRef(false);

  /**
   * Request camera permissions for Android
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to capture photos and videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true; // iOS handles permissions differently
  }, []);

  /**
   * Check and request camera permissions
   */
  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = await requestCameraPermission();
      setState(prev => ({ ...prev, hasPermission }));
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to capture photos and videos. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
      
      return hasPermission;
    } catch (error) {
      setState(prev => ({ ...prev, hasPermission: false }));
      return false;
    }
  }, [requestCameraPermission]);

  /**
   * Handle camera capture
   */
  const handleCameraCapture = useCallback(async (type: 'photo' | 'video') => {
    try {
      setState(prev => ({ ...prev, isCapturing: true, error: null }));

      // Check permission first
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setState(prev => ({ ...prev, isCapturing: false }));
        return;
      }

      const options = {
        mediaType: type as MediaType,
        includeBase64: true,
        saveToPhotos: false,
        maxWidth: 1920,
        maxHeight: 1080,
        ...(type === 'video' && {
          videoQuality: 'medium' as const,
          durationLimit: 60, // 60 seconds max
          includeExtra: true, // Include extra metadata like duration
        }),
      };

      const result: ImagePickerResponse = await launchCamera(options);

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (asset.uri) {
          const mediaItem: IMediaItem = {
            id: Date.now().toString(),
            uri: asset.uri,
            base64: asset.base64 || asset.uri, // Fallback to URI if base64 not available
            type,
            timestamp: Date.now(),
            size: asset.fileSize || 0,
            ...(type === 'video' && {
              duration: asset.duration || 0,
              thumbnail: asset.base64 || asset.uri, // Fallback to URI if base64 not available
            }),
          };

          if (type === 'photo') {
            setState(prev => ({
              ...prev,
              photos: [...prev.photos, mediaItem],
              isCapturing: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              videos: [...prev.videos, mediaItem],
              isCapturing: false,
            }));
          }
        }
      } else if (result.didCancel) {
        setState(prev => ({ ...prev, isCapturing: false }));
      } else if (result.errorMessage) {
        setState(prev => ({ 
          ...prev, 
          error: result.errorMessage || 'Unknown error',
          isCapturing: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to capture media',
        isCapturing: false 
      }));
    }
  }, [checkCameraPermission]);

  /**
   * Handle gallery selection
   */
  const handleGallerySelection = useCallback(async (type: 'photo' | 'video') => {
    try {
      setState(prev => ({ ...prev, isCapturing: true, error: null }));

      const options = {
        mediaType: type as MediaType,
        includeBase64: true,
        selectionLimit: type === 'photo' ? maxPhotos : maxVideos,
        ...(type === 'video' && {
          videoQuality: 'medium' as const,
          includeExtra: true, // Include extra metadata like duration
        }),
      };

      const result: ImagePickerResponse = await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        const newMediaItems: IMediaItem[] = result.assets
          .filter(asset => asset.uri)
          .map(asset => ({
            id: Date.now().toString() + Math.random(),
            uri: asset.uri!,
            base64: asset.base64 || asset.uri!,
            type,
            timestamp: Date.now(),
            size: asset.fileSize || 0,
            ...(type === 'video' && {
              duration: asset.duration || 0,
              thumbnail: asset.base64 || asset.uri,
            }),
          }));

        if (type === 'photo') {
          setState(prev => ({
            ...prev,
            photos: [...prev.photos, ...newMediaItems],
            isCapturing: false,
          }));
        } else {
          setState(prev => ({
            ...prev,
            videos: [...prev.videos, ...newMediaItems],
            isCapturing: false,
          }));
        }
      } else if (result.didCancel) {
        setState(prev => ({ ...prev, isCapturing: false }));
      } else if (result.errorMessage) {
        setState(prev => ({ 
          ...prev, 
          error: result.errorMessage || 'Unknown error',
          isCapturing: false 
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to select from gallery',
        isCapturing: false 
      }));
    }
  }, [maxPhotos, maxVideos]);

  /**
   * Remove media item
   */
  const removeMedia = useCallback((mediaId: string, type: 'photo' | 'video') => {
    if (type === 'photo') {
      setState(prev => ({
        ...prev,
        photos: prev.photos.filter(item => item.id !== mediaId),
      }));
    } else {
      setState(prev => ({
        ...prev,
        videos: prev.videos.filter(item => item.id !== mediaId),
      }));
    }
  }, []);

  /**
   * Clear all media
   */
  const clearAllMedia = useCallback(() => {
    setState(prev => ({
      ...prev,
      photos: [],
      videos: [],
    }));
  }, []);

  /**
   * Get all media items
   */
  const getAllMedia = useCallback((): IMediaItem[] => {
    return [...state.photos, ...state.videos];
  }, [state.photos, state.videos]);

  /**
   * Check if media limits are reached
   */
  const isPhotoLimitReached = useCallback(() => {
    return state.photos.length >= maxPhotos;
  }, [state.photos.length, maxPhotos]);

  const isVideoLimitReached = useCallback(() => {
    return state.videos.length >= maxVideos;
  }, [state.videos.length, maxVideos]);

  // Check permissions on mount
  useEffect(() => {
    checkCameraPermission();
  }, [checkCameraPermission]);

  // Function to initialize with existing media
  const initializeWithExistingMedia = useCallback((existingMedia: IMediaItem[]) => {
    if (existingMedia && existingMedia.length > 0) {
      console.log('🎬 Initializing with existing media:', existingMedia);
      const photos = existingMedia.filter(item => item && item.type === 'photo');
      const videos = existingMedia.filter(item => item && item.type === 'video');
      
      console.log('🎬 Filtered media - Photos:', photos.length, 'Videos:', videos.length);
      
      // Always update state with existing media
      setState(prev => ({
        ...prev,
        photos,
        videos,
      }));
      
      // Reset initialization flag to allow future updates
      initializedRef.current = false;
    }
  }, []);

  // Function to reset initialization flag
  const resetInitialization = useCallback(() => {
    initializedRef.current = false;
  }, []);

  return {
    // State
    photos: state.photos,
    videos: state.videos,
    isCapturing: state.isCapturing,
    hasPermission: state.hasPermission,
    error: state.error,
    
    // Actions
    handleCameraCapture,
    handleGallerySelection,
    removeMedia,
    clearAllMedia,
    getAllMedia,
    checkCameraPermission,
    initializeWithExistingMedia,
    resetInitialization,
    
    // Utilities
    isPhotoLimitReached,
    isVideoLimitReached,
    totalMediaCount: state.photos.length + state.videos.length,
  };
};
