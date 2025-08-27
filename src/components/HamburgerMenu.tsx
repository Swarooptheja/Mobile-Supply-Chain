import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface HamburgerMenuProps {
  onPress: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.hamburgerIcon}>
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
        <View style={styles.hamburgerLine} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  hamburgerIcon: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});

export default HamburgerMenu;
