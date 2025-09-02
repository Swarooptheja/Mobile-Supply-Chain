import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonIcon } from './index';

interface ISearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<ISearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus = false,
}) => {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <CommonIcon 
        icon="search"
        size={25} 
        color="#9CA3AF"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        returnKeyType="search"
        autoFocus={autoFocus}
        clearButtonMode="while-editing"
      />
      {!!value && (
        <TouchableOpacity onPress={handleClear} accessibilityRole="button" accessibilityLabel="Clear search">
          <CommonIcon 
            icon="close"
            size={16} 
            color="#9CA3AF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2, // Increased from 1 to 2 to match vehicle input
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16, // Increased from 12 to 16 for better padding
    paddingVertical: 14, // Increased from 8 to 14 to match vehicle input
    height: 52, // Increased from 48 to 52 to match vehicle input height
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16, // Increased from 14 to 16 to match vehicle input
    height: 36, // Increased from 32 to 36 for better proportion
    marginLeft: 8, // Added left margin for better spacing from search icon
  },
  clear: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 8,
  },
});


