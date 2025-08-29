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
        size={20} 
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 48,
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
    fontSize: 14,
    height: 32,
  },
  clear: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 8,
  },
});


