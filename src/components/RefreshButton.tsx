import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { CommonIcon } from './index';

interface IRefreshButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

const RefreshButton: React.FC<IRefreshButtonProps> = ({
  onPress,
  size = 40,
  color = '#ffffff',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  style
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CommonIcon 
        icon="refresh"
        size={size * 0.45} 
        color={color}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default RefreshButton;
