import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { IBarcodeScannerProps } from '../types/barcodeScanner.interface';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const BarcodeScanner: React.FC<IBarcodeScannerProps> = ({
  visible,
  onClose,
  onBarcodeScanned,
  showManualInput = true,
  scanBarcode = true,
  showFrame = true,
  barcodeFrameSize = { width: 300, height: 150 },
  laserColor = '#ff0000',
  frameColor = '#ffff00',
  onError,
}) => {
  const cameraRef = useRef<any>(null);
  const {
    hasPermission,
    isScanning,
    manualBarcode,
    updateManualBarcode,
    resetScanner,
    checkCameraPermission,
  } = useBarcodeScanner();

  /**
   * Handle barcode scan success
   */
  const handleBarcodeRead = useCallback((event: any) => {
    const { codeStringValue } = event.nativeEvent;
    if (codeStringValue) {
      onBarcodeScanned(codeStringValue);
      onClose();
    }
  }, [onBarcodeScanned, onClose]);

  /**
   * Handle camera errors
   */
  const handleCameraError = useCallback((event: any) => {
    const errorMessage = event.nativeEvent?.errorMessage || 'Camera error occurred';
    console.error('Camera error:', errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  /**
   * Handle manual barcode submission
   */
  const handleManualSubmit = useCallback(() => {
    if (manualBarcode.trim()) {
      onBarcodeScanned(manualBarcode.trim());
      updateManualBarcode('');
      onClose();
    } else {
      Alert.alert('Error', 'Please enter a barcode');
    }
  }, [manualBarcode, onBarcodeScanned, updateManualBarcode, onClose]);

  /**
   * Handle close action
   */
  const handleClose = useCallback(() => {
    updateManualBarcode('');
    resetScanner();
    onClose();
  }, [updateManualBarcode, resetScanner, onClose]);

  /**
   * Reset scanner when modal becomes visible
   */
  useEffect(() => {
    if (visible) {
      checkCameraPermission();
    }
  }, [visible, checkCameraPermission]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <StatusBar hidden />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Barcode Scanner</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Camera Section */}
        <View style={styles.cameraContainer}>
          {hasPermission ? (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              scanBarcode={scanBarcode}
              showFrame={showFrame}
              barcodeFrameSize={barcodeFrameSize}
              laserColor={laserColor}
              frameColor={frameColor}
              onReadCode={handleBarcodeRead}
              onError={handleCameraError}
              cameraType={CameraType.Back}
              flashMode="auto"
              focusMode="on"
              zoomMode="on"
            />
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionText}>📷</Text>
              <Text style={styles.permissionTitle}>Camera Permission Required</Text>
              <Text style={styles.permissionSubtitle}>
                Please grant camera permission to scan barcodes
              </Text>
              <TouchableOpacity 
                style={styles.permissionButton} 
                onPress={checkCameraPermission}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Manual Input Section */}
        {showManualInput && (
          <View style={styles.manualInputContainer}>
            <Text style={styles.manualInputTitle}>Manual Entry</Text>
            <TextInput
              style={styles.barcodeInput}
              placeholder="Enter barcode manually"
              value={manualBarcode}
              onChangeText={updateManualBarcode}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleManualSubmit}
            />
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleManualSubmit}
              activeOpacity={0.7}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {hasPermission 
              ? 'Point your camera at a barcode to scan, or enter manually below'
              : 'Camera permission is required to scan barcodes'
            }
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: screenWidth,
    height: screenHeight * 0.6,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionText: {
    fontSize: 80,
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  manualInputContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  manualInputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  barcodeInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default BarcodeScanner;
