import { Dimensions, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { getThemeColors, getHeaderColor } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createMediaSelectionModalStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: scale(16),
      padding: scale(24),
      marginHorizontal: scale(32),
      width: '80%',
      maxWidth: 400,
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      // Responsive adjustments
      ...(isTablet && {
        padding: scale(28),
        marginHorizontal: scale(40),
        width: '70%',
        maxWidth: 500,
        borderRadius: scale(18),
      }),
      ...(isDesktop && {
        padding: scale(32),
        marginHorizontal: scale(48),
        width: '60%',
        maxWidth: 600,
        borderRadius: scale(20),
      }),
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(24),
      // Responsive adjustments
      ...(isTablet && {
        marginBottom: scale(28),
      }),
      ...(isDesktop && {
        marginBottom: scale(32),
      }),
    },
    modalTitle: {
      fontSize: moderateScale(18),
      fontWeight: '700',
      color: theme.colors.textPrimary,
      letterSpacing: 0.3,
      // Responsive adjustments
      ...(isTablet && {
        fontSize: moderateScale(20),
      }),
      ...(isDesktop && {
        fontSize: moderateScale(22),
      }),
    },
    closeButton: {
      padding: scale(4),
      borderRadius: scale(4),
      // Responsive adjustments
      ...(isTablet && {
        padding: scale(6),
      }),
      ...(isDesktop && {
        padding: scale(8),
      }),
    },
    modalOptions: {
      gap: scale(16),
      // Responsive adjustments
      ...(isTablet && {
        gap: scale(20),
      }),
      ...(isDesktop && {
        gap: scale(24),
      }),
    },
    modalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: scale(16),
      paddingHorizontal: scale(20),
      backgroundColor: theme.colors.surface,
      borderRadius: scale(12),
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: scale(12),
      // Responsive adjustments
      ...(isTablet && {
        paddingVertical: scale(18),
        paddingHorizontal: scale(24),
        borderRadius: scale(14),
        gap: scale(14),
      }),
      ...(isDesktop && {
        paddingVertical: scale(20),
        paddingHorizontal: scale(28),
        borderRadius: scale(16),
        gap: scale(16),
      }),
    },
    modalOptionText: {
      fontSize: moderateScale(16),
      fontWeight: '600',
      color: theme.colors.textPrimary,
      // Responsive adjustments
      ...(isTablet && {
        fontSize: moderateScale(17),
      }),
      ...(isDesktop && {
        fontSize: moderateScale(18),
      }),
    },
  });
};
