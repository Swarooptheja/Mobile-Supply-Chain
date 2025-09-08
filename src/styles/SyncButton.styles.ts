import { StyleSheet } from 'react-native';
import { ITheme } from '../context/ThemeContext';

export const createSyncButtonStyles = (theme: ITheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledContainer: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      opacity: 0.6,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginRight: 6,
    },
    text: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    disabledText: {
      color: theme.colors.textSecondary,
    },
  });
};
