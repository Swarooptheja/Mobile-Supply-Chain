import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createItemDetailsCardStyles = (theme: Theme) => StyleSheet.create({
  itemDetailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(4), // Match LoadToDockItemsScreen itemCard border radius
    padding: scale(8), // Reduced from 12 to 8 for more compact card
    marginBottom: scale(6), // Reduced from 8 to 6 for tighter spacing
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 }, // Match LoadToDockItemsScreen itemCard shadow
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.06, // Match LoadToDockItemsScreen itemCard shadow opacity
    shadowRadius: 4, // Match LoadToDockItemsScreen itemCard shadow radius
    elevation: 3, // Match LoadToDockItemsScreen itemCard elevation
    borderLeftWidth: 4, // Match LoadToDockItemsScreen itemCard left border
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    // Responsive adjustments - more compact responsive styling
    ...(isTablet && {
      padding: scale(10), // Reduced from 14 to 10
      marginBottom: scale(8), // Reduced from 10 to 8
    }),
    ...(isDesktop && {
      padding: scale(12), // Reduced from 16 to 12
      marginBottom: scale(10), // Reduced from 12 to 10
    }),
  },
  itemInfoSection: {
    marginBottom: scale(6), // Reduced from 8 to 6 for more compact layout
  },
  itemIdentifier: {
    fontSize: 16, // Match LoadToDockItemsScreen itemId font size
    fontWeight: '800', // Match LoadToDockItemsScreen itemId font weight
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    letterSpacing: 0.5, // Match LoadToDockItemsScreen itemId letter spacing
    marginBottom: scale(3), // Reduced from 4 to 3 for more compact layout
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(17),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(18),
    }),
  },
  itemDescription: {
    fontSize: 14, // Match LoadToDockItemsScreen itemDescription font size
    color: theme.colors.textSecondary, // Use theme color
    fontWeight: '600', // Match LoadToDockItemsScreen itemDescription font weight
    lineHeight: 18, // Match LoadToDockItemsScreen itemDescription line height
    letterSpacing: 0.2, // Match LoadToDockItemsScreen itemDescription letter spacing
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      lineHeight: 20,
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      lineHeight: 22,
    }),
  },
  quantitySection: {
    gap: scale(4), // Reduced from 6 to 4 for more compact layout
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.surface : '#F8FAFC', // Theme-aware background
    borderRadius: scale(6), // Reduced from 8 to 6 for more compact look
    padding: scale(6), // Reduced from 8 to 6 for more compact layout
    borderWidth: 1,
    borderColor: theme.colors.border, // Use theme border color
    // Responsive adjustments - more compact
    ...(isTablet && {
      padding: scale(8), // Reduced from 10 to 8
      gap: scale(6), // Reduced from 8 to 6
    }),
    ...(isDesktop && {
      padding: scale(10), // Reduced from 12 to 10
      gap: scale(8), // Reduced from 10 to 8
    }),
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(4), // Reduced from 6 to 4 for more compact layout
    minHeight: 18, // Reduced from 20 to 18 for more compact height
    marginBottom: scale(3), // Reduced from 4 to 3 for more compact layout
    // Responsive adjustments - more compact
    ...(isTablet && {
      gap: scale(6), // Reduced from 8 to 6
      minHeight: 20, // Reduced from 22 to 20
    }),
    ...(isDesktop && {
      gap: scale(8), // Reduced from 10 to 8
      minHeight: 22, // Reduced from 24 to 22
    }),
  },
  quantityLabel: {
    fontSize: 14, // Match LoadToDockItemsScreen quantityLabel font size
    color: theme.colors.textSecondary, // Use theme color
    fontWeight: '600', // Match LoadToDockItemsScreen quantityLabel font weight
    flexShrink: 0,
    minWidth: 90,
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      minWidth: 100,
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      minWidth: 110,
    }),
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(2), // Reduced from 3 to 2 for more compact layout
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: scale(6), // Reduced from 8 to 6 for more compact layout
    // Responsive adjustments - more compact
    ...(isTablet && {
      gap: scale(3), // Reduced from 4 to 3
      marginBottom: scale(8), // Reduced from 10 to 8
    }),
    ...(isDesktop && {
      gap: scale(4), // Reduced from 5 to 4
      marginBottom: scale(10), // Reduced from 12 to 10
    }),
  },
  quantityValue: {
    fontSize: 14, // Match LoadToDockItemsScreen quantityInput font size
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    fontWeight: '700', // Match LoadToDockItemsScreen quantityInput font weight
    letterSpacing: 0.1,
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary + '20' : '#EFF6FF', // Theme-aware background
    paddingHorizontal: scale(4), // Reduced from 6 to 4 for more compact look
    paddingVertical: scale(1), // Reduced from 2 to 1 for more compact look
    borderRadius: scale(3), // Reduced from 4 to 3 for more compact look
    borderWidth: 1,
    borderColor: theme.colors.background === '#121212' ? theme.colors.primary + '40' : '#DBEAFE', // Theme-aware border
    // Responsive adjustments - more compact
    ...(isTablet && {
      fontSize: moderateScale(15),
      paddingHorizontal: scale(6), // Reduced from 8 to 6
      paddingVertical: scale(2), // Reduced from 3 to 2
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      paddingHorizontal: scale(8), // Reduced from 10 to 8
      paddingVertical: scale(3), // Reduced from 4 to 3
    }),
  },
  statusIndicator: {
    fontSize: 12,
    marginLeft: scale(2),
    // Responsive adjustments
    ...(isTablet && {
      fontSize: moderateScale(13),
      marginLeft: scale(3),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      marginLeft: scale(4),
    }),
  },
});
