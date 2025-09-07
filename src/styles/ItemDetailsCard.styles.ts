import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { getThemeColors, getHeaderColor } from './global.styles';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createItemDetailsCardStyles = (theme: Theme) => {
  const isDark = theme.colors.background === '#121212';
  const themeColors = getThemeColors(isDark);
  
  return StyleSheet.create({
  itemDetailsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: scale(16),
    shadowColor: themeColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: scale(4), // Left side border like header
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Theme-aware border color
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Responsive adjustments
    ...(isTablet && {
      padding: scale(24),
      marginBottom: scale(20),
      borderLeftWidth: scale(5),
    }),
    ...(isDesktop && {
      padding: scale(28),
      marginBottom: scale(24),
      borderLeftWidth: scale(6),
    }),
  },
  itemTagContainer: {
    marginBottom: scale(12),
  },
  itemTag: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Theme-aware text color
    backgroundColor: isDark ? theme.colors.pillBg : '#dbeafe', // Theme-aware background
    paddingHorizontal: scale(10),
    paddingVertical: scale(6),
    borderRadius: scale(16), // Pill-shaped (fully rounded)
    alignSelf: 'flex-start',
    letterSpacing: 0.2,
    // Responsive adjustments
    ...(isTablet && {
      fontSize: moderateScale(13),
      paddingHorizontal: scale(12),
      paddingVertical: scale(7),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      paddingHorizontal: scale(14),
      paddingVertical: scale(8),
    }),
  },
  itemDescription: {
    fontSize: moderateScale(14), // Smaller text
    color: theme.colors.textPrimary, // Theme-aware text color
    fontWeight: '500', // Less bold
    lineHeight: 20,
    letterSpacing: 0.1, // Less letter spacing
    marginBottom: scale(16),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      lineHeight: 22,
      marginBottom: scale(18),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      lineHeight: 24,
      marginBottom: scale(20),
    }),
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: scale(16),
    // Responsive adjustments
    ...(isTablet && {
      gap: scale(20),
    }),
    ...(isDesktop && {
      gap: scale(24),
    }),
  },
  quantityRow: {
    flex: 1,
    alignItems: 'flex-start',
    // Responsive adjustments
    ...(isTablet && {
      // Additional tablet styles if needed
    }),
    ...(isDesktop && {
      // Additional desktop styles if needed
    }),
  },
  quantityLabel: {
    fontSize: moderateScale(14),
    color: theme.colors.textSecondary, // Theme-aware text color
    fontWeight: '500',
    marginBottom: scale(4),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
    }),
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    // Responsive adjustments
    ...(isTablet && {
      gap: scale(10),
    }),
    ...(isDesktop && {
      gap: scale(12),
    }),
  },
  quantityValue: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // Theme-aware text color
    fontWeight: '600',
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
    }),
  },
  quantityInput: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // Theme-aware text color
    fontWeight: '600',
    backgroundColor: theme.colors.surface, // Theme-aware background
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4), // Less rounded
    borderWidth: 1,
    borderColor: theme.colors.border, // Theme-aware border color
    minWidth: scale(32),
    textAlign: 'center',
    // Responsive adjustments
    ...(isTablet && {
      fontSize: moderateScale(15),
      paddingHorizontal: scale(10),
      paddingVertical: scale(5),
      minWidth: scale(36),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      paddingHorizontal: scale(12),
      paddingVertical: scale(6),
      minWidth: scale(40),
    }),
  },
  });
};
