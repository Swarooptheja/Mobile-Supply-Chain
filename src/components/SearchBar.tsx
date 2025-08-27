import React, { useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onDebouncedChange?: (text: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  placeholder?: string;
  autoFocus?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onDebouncedChange,
  onClear,
  debounceMs = 300,
  placeholder = 'Search',
  autoFocus,
}) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!onDebouncedChange) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onDebouncedChange(value.trim()), debounceMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onDebouncedChange, debounceMs]);

  const handleClear = () => {
    onChangeText('');
    if (onClear) {
      onClear();
    } else if (onDebouncedChange) {
      onDebouncedChange('');
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.clear}>✕</Text>
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
  },
  input: {
    flex: 1,
    paddingVertical: 2,
  },
  clear: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SearchBar;


