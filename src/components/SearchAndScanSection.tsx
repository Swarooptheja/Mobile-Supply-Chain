import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from './SearchBar';
import { ScanButton } from './ScanButton';

interface SearchAndScanSectionProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onScanPress: () => void;
  style?: any;
}

export const SearchAndScanSection: React.FC<SearchAndScanSectionProps> = ({
  searchQuery,
  onSearchChange,
  onScanPress,
  style
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.searchBarWrapper}>
      <SearchBar
        placeholder="Search items"
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </View>
    <ScanButton
      onPress={onScanPress}
      size={56}
      iconColor="#ffffff"
      backgroundColor="#1e3a8a"
      borderColor="#1e3a8a"
      hintText="Scan"
      hintTextColor="#6b7280"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
  },
});
