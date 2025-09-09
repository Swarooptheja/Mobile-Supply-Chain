import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';

export const createLoadToDockItemStyles = (theme: any, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  loadItemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(8), // Increased from 4 to 8 for better appearance
    paddingVertical: scale(12), // Reduced vertical padding to decrease height
    paddingHorizontal: scale(20), // Increased horizontal padding for more width
    marginBottom: scale(10), // Reduced margin for tighter spacing
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 }, // Increased shadow offset
    shadowOpacity: theme.colors.shadow === '#000000' ? 0.12 : 0.08, // Increased shadow opacity
    shadowRadius: 4, // Increased shadow radius
    elevation: 3, // Increased elevation
    borderLeftWidth: 5, // Increased from 4 to 5 for better visibility
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    minHeight: scale(75), // Reduced minimum height for more compact cards
    width: '100%', // Ensure full width utilization
    // Responsive sizing
    ...(isTablet && {
      paddingVertical: scale(14),
      paddingHorizontal: scale(24),
      marginBottom: scale(12),
      minHeight: scale(85),
    }),
    ...(isDesktop && {
      paddingVertical: scale(16),
      paddingHorizontal: scale(28),
      marginBottom: scale(14),
      minHeight: scale(95),
    }),
  },
  inProgressCard: {
    borderLeftColor: '#3b82f6',
  },
  completedCard: {
    borderLeftColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8), // Reduced for more compact layout
    // Responsive spacing
    ...(isTablet && {
      marginBottom: scale(10),
    }),
    ...(isDesktop && {
      marginBottom: scale(12),
    }),
  },
  deliveryIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  deliveryId: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color in light mode
    backgroundColor: theme.colors.primary + '20', // 20% opacity
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    borderRadius: scale(16),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(18),
      paddingHorizontal: scale(14),
      paddingVertical: scale(6),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(20),
      paddingHorizontal: scale(16),
      paddingVertical: scale(8),
    }),
  },
  itemCountBadge: {
    backgroundColor: theme.colors.pillBg,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(6), // Reduced from 12 to 6 for consistency
    // Responsive sizing
    ...(isTablet && {
      paddingHorizontal: scale(10),
      paddingVertical: scale(6),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(12),
      paddingVertical: scale(8),
    }),
  },
  itemCountText: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    fontWeight: '500',
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
    }),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    // Responsive sizing
    ...(isTablet && {
      width: scale(10),
      height: scale(10),
      borderRadius: scale(5),
    }),
    ...(isDesktop && {
      width: scale(12),
      height: scale(12),
      borderRadius: scale(6),
    }),
  },
  statusDotPending: {
    backgroundColor: '#f59e0b',
  },
  statusDotInProgress: {
    backgroundColor: '#3b82f6',
  },
  statusDotCompleted: {
    backgroundColor: '#10b981',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: scale(2), // Reduced padding for more compact layout
    paddingHorizontal: scale(6), // Increased horizontal padding for better width utilization
    // Responsive spacing
    ...(isTablet && {
      paddingTop: scale(3),
      paddingHorizontal: scale(8),
    }),
    ...(isDesktop && {
      paddingTop: scale(4),
      paddingHorizontal: scale(10),
    }),
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    minWidth: scale(100), // Increased minimum width for better layout
    paddingLeft: scale(16), // Added left padding to create more space
    // Responsive sizing
    ...(isTablet && {
      minWidth: scale(120),
      paddingLeft: scale(20),
    }),
    ...(isDesktop && {
      minWidth: scale(140),
      paddingLeft: scale(24),
    }),
  },
  dockValue: {
    fontSize: moderateScale(12),
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: scale(4),
    // Same font styling as date value
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
      marginBottom: scale(5),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      marginBottom: scale(6),
    }),
  },
  label: {
    fontSize: moderateScale(14),
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: scale(1), // Reduced margin for more compact layout
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      marginBottom: scale(2),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      marginBottom: scale(3),
    }),
  },
  value: {
    fontSize: moderateScale(12),
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: scale(2), // Reduced margin for more compact layout
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
      marginBottom: scale(3),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      marginBottom: scale(4),
    }),
  },
});
