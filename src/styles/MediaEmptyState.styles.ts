import { Dimensions, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { getThemeColors } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createMediaEmptyStateStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
    emptyStateContainer: {
      marginHorizontal: scale(16),
      marginBottom: scale(24),
      backgroundColor: theme.colors.surface,
      borderRadius: scale(12),
      padding: scale(32),
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: scale(200),
      // Responsive adjustments
      ...(isTablet && {
        marginHorizontal: scale(24),
        marginBottom: scale(28),
        padding: scale(40),
        minHeight: scale(220),
      }),
      ...(isDesktop && {
        marginHorizontal: scale(32),
        marginBottom: scale(32),
        padding: scale(48),
        minHeight: scale(240),
      }),
    },
    emptyStateContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateTitle: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginTop: scale(16),
      marginBottom: scale(8),
      textAlign: 'center',
      // Responsive adjustments
      ...(isTablet && {
        fontSize: moderateScale(17),
        marginTop: scale(18),
        marginBottom: scale(10),
      }),
      ...(isDesktop && {
        fontSize: moderateScale(18),
        marginTop: scale(20),
        marginBottom: scale(12),
      }),
    },
    emptyStateSubtitle: {
      fontSize: moderateScale(14),
      color: theme.colors.textPrimary,
      textAlign: 'center',
      lineHeight: 20,
      // Responsive adjustments
      ...(isTablet && {
        fontSize: moderateScale(15),
        lineHeight: 22,
      }),
      ...(isDesktop && {
        fontSize: moderateScale(16),
        lineHeight: 24,
      }),
    },
  });
};
