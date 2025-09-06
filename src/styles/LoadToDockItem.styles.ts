import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';

export const createLoadToDockItemStyles = (theme: any, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  loadItemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(4), // Reduced from 8 to 4 for less rounded corners
    padding: scale(12),
    marginBottom: scale(8),
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: theme.colors.shadow === '#000000' ? 0.08 : 0.04,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4, // Increased from 3 to 4 for better visibility
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    // Responsive sizing
    ...(isTablet && {
      padding: scale(14),
      marginBottom: scale(10),
    }),
    ...(isDesktop && {
      padding: scale(16),
      marginBottom: scale(12),
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
    marginBottom: scale(8),
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
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
    marginBottom: scale(2),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
      marginBottom: scale(3),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
      marginBottom: scale(4),
    }),
  },
  value: {
    fontSize: moderateScale(12),
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: scale(4),
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
});
