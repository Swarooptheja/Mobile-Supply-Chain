import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import IconComponent from './icons/IconComponent';

interface HamburgerMenuProps {
  onPress: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <IconComponent name="menu" size={24} color="#ffffff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default HamburgerMenu;
