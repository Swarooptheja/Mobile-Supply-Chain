import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonIcon } from './index';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../styles/global.styles';

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
  const theme = useTheme();
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  const styles = createStyles(themeColors);

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <CommonIcon 
        icon="search"
        size={25} 
        color={themeColors.textSecondary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textSecondary}
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
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (themeColors: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: themeColors.border,
    backgroundColor: themeColors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    height: 52,
    justifyContent: 'center',
    // Subtle shadow for depth
    shadowColor: themeColors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    color: themeColors.textSecondary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    height: 36,
    marginLeft: 8,
    color: themeColors.textPrimary,
  },
  clear: {
    color: themeColors.textSecondary,
    fontSize: 16,
    marginLeft: 8,
  },
});


