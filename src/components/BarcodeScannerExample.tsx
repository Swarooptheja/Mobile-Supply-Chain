import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BarcodeScanner from './BarcodeScanner';
import { IBarcodeScannerProps } from '../types/barcodeScanner.interface';

/**
 * Example component demonstrating how to use the BarcodeScanner
 * This component shows the proper way to integrate the scanner
 */
const BarcodeScannerExample: React.FC = () => {
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');

  /**
   * Handle barcode scan success
   */
  const handleBarcodeScanned: IBarcodeScannerProps['onBarcodeScanned'] = (barcode: string) => {
    setScannedBarcode(barcode);
    Alert.alert(
      'Barcode Scanned!',
      `Successfully scanned: ${barcode}`,
      [{ text: 'OK' }]
    );
  };

  /**
   * Handle scanner close
   */
  const handleCloseScanner = () => {
    setIsScannerVisible(false);
  };

  /**
   * Handle scanner errors
   */
  const handleScannerError = (error: string) => {
    Alert.alert('Scanner Error', error, [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Barcode Scanner Example</Text>
      
      {/* Display scanned barcode */}
      {scannedBarcode ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Last Scanned Barcode:</Text>
          <Text style={styles.resultText}>{scannedBarcode}</Text>
        </View>
      ) : (
        <Text style={styles.placeholderText}>
          No barcode scanned yet. Tap the button below to start scanning.
        </Text>
      )}

      {/* Open scanner button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setIsScannerVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.scanButtonText}>📷 Open Scanner</Text>
      </TouchableOpacity>

      {/* Clear result button */}
      {scannedBarcode && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setScannedBarcode('')}
          activeOpacity={0.7}
        >
          <Text style={styles.clearButtonText}>Clear Result</Text>
        </TouchableOpacity>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={isScannerVisible}
        onClose={handleCloseScanner}
        onBarcodeScanned={handleBarcodeScanned}
        onError={handleScannerError}
        showManualInput={true}
        scanBarcode={true}
        showFrame={true}
        barcodeFrameSize={{ width: 300, height: 150 }}
        laserColor="#ff0000"
        frameColor="#ffff00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  scanButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BarcodeScannerExample;
