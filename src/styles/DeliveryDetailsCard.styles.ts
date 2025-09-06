import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');

// Device type detection
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createDeliveryDetailsCardStyles = (theme: Theme) => StyleSheet.create({
  container: {
    padding: scale(16), // Match items card padding
    backgroundColor: theme.colors.surface,
    borderRadius: scale(4), // Match items card border radius
    marginHorizontal: scale(16), // Match items card margin
    marginTop: scale(16), // Add top margin for spacing from header
    marginBottom: scale(12), // Match items card margin bottom
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 }, // Match items card shadow
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.06, // Match items card shadow opacity
    shadowRadius: 4, // Match items card shadow radius
    elevation: 3, // Match items card elevation
    borderLeftWidth: 4, // Match items card left border
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    // Responsive adjustments - match items card responsive styling
    ...(isTablet && {
      padding: scale(20),
      marginTop: scale(20), // Responsive top margin
      marginBottom: scale(16),
      marginHorizontal: scale(24), // Match items section responsive padding
    }),
    ...(isDesktop && {
      padding: scale(24),
      marginTop: scale(24), // Responsive top margin
      marginBottom: scale(20),
      marginHorizontal: scale(32), // Match items section responsive padding
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftDetails: {
    flex: 1,
  },
  salesOrderNumber: {
    fontSize: moderateScale(14),
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    fontWeight: '600', // More reasonable font weight
    marginBottom: scale(6),
    letterSpacing: 0.3,
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
    }),
  },
  customerName: {
    fontSize: moderateScale(16),
    color: theme.colors.textPrimary,
    fontWeight: '600', // More reasonable font weight
    marginBottom: scale(8),
    lineHeight: moderateScale(20),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(17),
      lineHeight: moderateScale(22),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(18),
      lineHeight: moderateScale(24),
    }),
  },
  totalItems: {
    fontSize: moderateScale(13),
    color: theme.colors.textSecondary,
    fontWeight: '500', // More reasonable font weight
    marginTop: scale(4),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(14),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(15),
    }),
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    fontWeight: '600', // More reasonable font weight
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: scale(4),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
    }),
  },
  dateValue: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary,
    fontWeight: '600', // More reasonable font weight
    lineHeight: moderateScale(18),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      lineHeight: moderateScale(20),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(22),
    }),
  },
});
