import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CommonIcon } from './index';

interface IScanButtonProps {
  onPress: () => void;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  hintText?: string;
  hintTextColor?: string;
}

export const ScanButton: React.FC<IScanButtonProps> = ({
  onPress,
  size = 48,
  iconColor = '#ffffff',
  backgroundColor = '#1e3a8a',
  borderColor = '#1e3a8a',
  hintText = 'Scan Barcode',
  hintTextColor = '#6b7280',
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <CommonIcon 
          icon="qrCode"
          size={size * 0.4} 
          color={iconColor}
        />
      </TouchableOpacity>
      {/* <Text style={[styles.hintText, { color: hintTextColor }]}>{hintText}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // Exact same height as search bar for perfect alignment
    width: 48, // Match the button size
  },
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  hintText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
    width: '100%',
    position: 'absolute',
    bottom: -20, // Position text below the button area
  },
});
