# Barcode Scanner Component

A comprehensive, reusable barcode scanner component built with `react-native-camera-kit` that provides both camera-based scanning and manual input capabilities.

## Features

- 📱 **Real-time barcode scanning** using device camera
- ✏️ **Manual barcode input** as fallback option
- 🔒 **Permission handling** for camera access
- 🎨 **Customizable UI** with configurable colors and frame sizes
- 🚀 **Performance optimized** with proper React hooks
- 📱 **Cross-platform** support for iOS and Android
- 🎯 **TypeScript support** with proper interfaces

## Installation

The component uses `react-native-camera-kit` which is already installed in this project:

```bash
npm install react-native-camera-kit
```

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { BarcodeScanner } from '../components';

const MyComponent = () => {
  const [isScannerVisible, setIsScannerVisible] = useState(false);

  const handleBarcodeScanned = (barcode: string) => {
    console.log('Scanned barcode:', barcode);
    // Handle the scanned barcode
    setIsScannerVisible(false);
  };

  const handleClose = () => {
    setIsScannerVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsScannerVisible(true)}>
        <Text>Open Scanner</Text>
      </TouchableOpacity>

      <BarcodeScanner
        visible={isScannerVisible}
        onClose={handleClose}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </View>
  );
};
```

### Advanced Implementation with Custom Props

```tsx
<BarcodeScanner
  visible={isScannerVisible}
  onClose={handleClose}
  onBarcodeScanned={handleBarcodeScanned}
  onError={handleError}
  showManualInput={true}
  scanBarcode={true}
  showFrame={true}
  barcodeFrameSize={{ width: 300, height: 150 }}
  laserColor="#ff0000"
  frameColor="#ffff00"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | `false` | Controls scanner visibility |
| `onClose` | `() => void` | **Required** | Callback when scanner is closed |
| `onBarcodeScanned` | `(barcode: string) => void` | **Required** | Callback when barcode is scanned |
| `showManualInput` | `boolean` | `true` | Show manual input section |
| `scanBarcode` | `boolean` | `true` | Enable barcode scanning |
| `showFrame` | `boolean` | `true` | Show scanning frame overlay |
| `barcodeFrameSize` | `{ width: number, height: number }` | `{ width: 300, height: 150 }` | Size of scanning frame |
| `laserColor` | `string` | `"#ff0000"` | Color of scanning laser |
| `frameColor` | `string` | `"#ffff00"` | Color of frame border |
| `onError` | `(error: string) => void` | `undefined` | Error callback |

## Hooks

### useBarcodeScanner

A custom hook that manages camera permissions and scanner state:

```tsx
import { useBarcodeScanner } from '../hooks';

const MyComponent = () => {
  const {
    hasPermission,
    isScanning,
    manualBarcode,
    checkCameraPermission,
    startScanning,
    stopScanning,
    updateManualBarcode,
    resetScanner,
  } = useBarcodeScanner();

  // Use the hook methods as needed
};
```

#### Hook Methods

- `checkCameraPermission()` - Check and request camera permissions
- `startScanning()` - Start the scanning process
- `stopScanning()` - Stop the scanning process
- `updateManualBarcode(barcode: string)` - Update manual input value
- `resetScanner()` - Reset scanner state

#### Hook State

- `hasPermission` - Whether camera permission is granted
- `isScanning` - Current scanning status
- `manualBarcode` - Current manual input value

## Interfaces

### IBarcodeScannerProps

```tsx
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
```

### IBarcodeScannerState

```tsx
export interface IBarcodeScannerState {
  hasPermission: boolean;
  isScanning: boolean;
  manualBarcode: string;
}
```

## Example Component

See `BarcodeScannerExample.tsx` for a complete implementation example that demonstrates:

- Opening/closing the scanner
- Handling scanned barcodes
- Error handling
- Displaying results
- Proper state management

## Camera Permissions

### Android

The component automatically handles Android camera permissions using `PermissionsAndroid.request()`. Users will see a permission dialog when first opening the scanner.

### iOS

iOS handles camera permissions through the system settings. The component will guide users to enable permissions if needed.

## Supported Barcode Formats

The scanner supports all major barcode formats including:

- QR Code
- Code 128
- Code 39
- EAN-13
- EAN-8
- UPC-E
- PDF-417
- Data Matrix
- Aztec
- And more...

## Styling

The component uses a dark theme with customizable colors. You can modify the styles in the component file or override them using the `style` prop.

## Performance Considerations

- The component uses `useCallback` and `useMemo` for optimal performance
- Camera permissions are checked only when needed
- The scanner automatically stops when the modal is closed
- Manual input is debounced to prevent excessive re-renders

## Troubleshooting

### Common Issues

1. **Camera not working**: Ensure camera permissions are granted
2. **Scanner not detecting barcodes**: Check that `scanBarcode={true}` is set
3. **Frame not visible**: Verify `showFrame={true}` and `barcodeFrameSize` are set
4. **Permission errors**: Check device settings for camera permissions

### Debug Mode

Enable debug logging by checking the console for:
- Permission status
- Camera initialization
- Barcode detection events
- Error messages

## Dependencies

- `react-native-camera-kit` - Core camera functionality
- `react-native` - Platform APIs for permissions
- `@types/react-native` - TypeScript definitions

## Contributing

When modifying this component:

1. Follow the established coding standards
2. Update interfaces when adding new props
3. Add proper JSDoc comments
4. Test on both iOS and Android
5. Update this README if needed

## License

This component is part of the NativeProject and follows the same license terms.
