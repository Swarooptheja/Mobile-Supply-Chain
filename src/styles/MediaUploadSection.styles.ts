import { Dimensions, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { getThemeColors, getHeaderColor } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createMediaUploadSectionStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
    uploadSection: {
      flexDirection: 'row',
      paddingHorizontal: scale(16),
      paddingBottom: scale(24),
      gap: scale(12),
      // Responsive adjustments
      ...(isTablet && {
        paddingHorizontal: scale(24),
        paddingBottom: scale(28),
        gap: scale(16),
      }),
      ...(isDesktop && {
        paddingHorizontal: scale(32),
        paddingBottom: scale(32),
        gap: scale(20),
      }),
    },
    uploadButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
      paddingVertical: scale(12),
      paddingHorizontal: scale(20),
      borderRadius: scale(8),
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      gap: scale(8),
    },
    uploadButtonSecondary: {
      backgroundColor: isDark ? theme.colors.pillBg : '#e0e7ff',
      borderWidth: 0,
    },
    uploadButtonText: {
      color: themeColors.textWhite,
      fontSize: moderateScale(15),
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    uploadButtonTextSecondary: {
      color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
      fontSize: moderateScale(15),
      fontWeight: '500',
      letterSpacing: 0.2,
    },
  });
};