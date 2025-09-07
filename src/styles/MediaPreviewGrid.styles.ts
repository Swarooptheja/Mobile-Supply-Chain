import { Dimensions, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Theme } from '../context/ThemeContext';
import { getThemeColors, getHeaderColor } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createMediaPreviewGridStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
    previewSection: {
      marginHorizontal: scale(16),
      marginBottom: scale(24),
      backgroundColor: theme.colors.surface,
      borderRadius: scale(12),
      padding: scale(16),
      borderWidth: 1,
      borderColor: theme.colors.border,
      // Responsive adjustments
      ...(isTablet && {
        marginHorizontal: scale(24),
        marginBottom: scale(28),
        padding: scale(20),
      }),
      ...(isDesktop && {
        marginHorizontal: scale(32),
        marginBottom: scale(32),
        padding: scale(24),
      }),
    },
    previewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scale(16),
    },
    previewTitle: {
      fontSize: moderateScale(16),
      fontWeight: '700',
      color: theme.colors.textPrimary,
      letterSpacing: 0.2,
    },
    previewCount: {
      fontSize: moderateScale(14),
      color: getHeaderColor(),
      fontWeight: '600',
      backgroundColor: isDark ? theme.colors.pillBg : '#eff6ff',
      paddingHorizontal: scale(12),
      paddingVertical: scale(4),
      borderRadius: scale(12),
    },
    mediaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
    },
    mediaItem: {
      width: '48%',
      aspectRatio: 1,
      marginBottom: scale(12),
      flexShrink: 0,
    },
    mediaContainer: {
      width: '100%',
      height: '100%',
      borderRadius: scale(8),
      overflow: 'hidden',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: themeColors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      position: 'relative',
    },
    mediaImage: {
      width: '100%',
      height: '100%',
      minHeight: scale(120),
    },
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    playIcon: {
      fontSize: scale(12),
      marginBottom: scale(2),
    },
    durationText: {
      fontSize: scale(8),
      color: themeColors.textWhite,
      fontWeight: '600',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: scale(4),
      paddingVertical: scale(1),
      borderRadius: scale(2),
    },
    removeButton: {
      position: 'absolute',
      top: scale(2),
      right: scale(2),
      width: scale(16),
      height: scale(16),
      borderRadius: scale(8),
      backgroundColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    removeButtonText: {
      fontSize: scale(10),
      color: themeColors.textWhite,
      fontWeight: 'bold',
    },
    mediaInfo: {
      position: 'absolute',
      bottom: scale(2),
      left: scale(2),
    },
    mediaSize: {
      fontSize: scale(6),
      color: theme.colors.textSecondary,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: scale(2),
      paddingVertical: scale(1),
      borderRadius: scale(2),
    },
    mediaTypeIndicator: {
      position: 'absolute',
      top: scale(2),
      left: scale(2),
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: scale(4),
      paddingHorizontal: scale(4),
      paddingVertical: scale(2),
    },
    mediaTypeText: {
      fontSize: scale(8),
      color: themeColors.textWhite,
    },
  });
};
