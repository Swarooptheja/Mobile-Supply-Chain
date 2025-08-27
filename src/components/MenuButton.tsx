import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface IMenuButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

const MenuButton: React.FC<IMenuButtonProps> = ({
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
      <Text style={[styles.buttonText, { color }]}>⋮</Text>
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
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MenuButton;
