export interface IBarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
  showManualInput?: boolean;
  scanBarcode?: boolean;
  showFrame?: boolean;
  barcodeFrameSize?: {
    width: number;
    height: number;
  };
  laserColor?: string;
  frameColor?: string;
  onError?: (error: string) => void;
}

export interface IBarcodeScannerState {
  hasPermission: boolean;
  isScanning: boolean;
  manualBarcode: string;
}
