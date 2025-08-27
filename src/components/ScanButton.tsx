import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

interface IScanButtonProps {
  onPress: () => void;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  hintText?: string;
  hintTextColor?: string;
  style?: any;
}

const ScanButton: React.FC<IScanButtonProps> = ({
  onPress,
  size = 48,
  iconColor = '#10b981',
  backgroundColor = '#ffffff',
  borderColor = '#10b981',
  hintText = 'Scan',
  hintTextColor = '#6b7280',
  style
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            backgroundColor,
            borderColor,
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: iconColor }]}>📊</Text>
      </TouchableOpacity>
      <Text style={[styles.hintText, { color: hintTextColor }]}>{hintText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    position: 'absolute',
    bottom: -20,
    width: '100%',
  },
});

export default ScanButton;
