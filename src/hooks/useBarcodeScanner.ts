import { useState, useEffect, useCallback } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { IBarcodeScannerState } from '../types/barcodeScanner.interface';

/**
 * Custom hook for managing barcode scanner functionality
 * Handles camera permissions and scanner state
 */
export const useBarcodeScanner = () => {
  const [state, setState] = useState<IBarcodeScannerState>({
    hasPermission: false,
    isScanning: false,
    manualBarcode: '',
  });

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
            message: 'This app needs access to your camera to scan barcodes.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Camera permission request failed:', err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  }, []);

  /**
   * Check and request camera permissions
   */
  const checkCameraPermission = useCallback(async () => {
    try {
      const hasPermission = await requestCameraPermission();
      setState(prev => ({ ...prev, hasPermission }));
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to scan barcodes. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error checking camera permission:', error);
      setState(prev => ({ ...prev, hasPermission: false }));
    }
  }, [requestCameraPermission]);

  /**
   * Start scanning
   */
  const startScanning = useCallback(() => {
    if (state.hasPermission) {
      setState(prev => ({ ...prev, isScanning: true }));
    } else {
      checkCameraPermission();
    }
  }, [state.hasPermission, checkCameraPermission]);

  /**
   * Stop scanning
   */
  const stopScanning = useCallback(() => {
    setState(prev => ({ ...prev, isScanning: false }));
  }, []);

  /**
   * Update manual barcode input
   */
  const updateManualBarcode = useCallback((barcode: string) => {
    setState(prev => ({ ...prev, manualBarcode: barcode }));
  }, []);

  /**
   * Reset scanner state
   */
  const resetScanner = useCallback(() => {
    setState({
      hasPermission: false,
      isScanning: false,
      manualBarcode: '',
    });
  }, []);

  // Check permissions on mount
  useEffect(() => {
    checkCameraPermission();
  }, [checkCameraPermission]);

  return {
    ...state,
    checkCameraPermission,
    startScanning,
    stopScanning,
    updateManualBarcode,
    resetScanner,
  };
};
