import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device type detection
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;
const isLandscape = screenWidth > screenHeight;

export const createDashboardStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
    // Responsive padding
    ...(isTablet && {
      paddingHorizontal: scale(24),
      paddingTop: scale(24),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      paddingTop: scale(32),
    }),
    ...(isLandscape && {
      paddingTop: scale(16),
    }),
  },
  scrollContent: {
    paddingBottom: scale(20),
  },
  
  // Welcome Section
  welcomeSection: {
    marginBottom: scale(24),
    paddingVertical: scale(16),
    // Responsive spacing
    ...(isTablet && {
      marginBottom: scale(32),
      paddingVertical: scale(20),
    }),
    ...(isDesktop && {
      marginBottom: scale(40),
      paddingVertical: scale(24),
    }),
  },
  welcomeTitle: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: scale(8),
    lineHeight: moderateScale(32),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(28),
      lineHeight: moderateScale(36),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(32),
      lineHeight: moderateScale(40),
    }),
  },
  welcomeSubtitle: {
    fontSize: moderateScale(14),
    color: theme.colors.textSecondary,
    lineHeight: moderateScale(20),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(18),
      lineHeight: moderateScale(26),
    }),
  },

  // Cards Grid
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(12),
    marginBottom: scale(24),
    // Responsive layout
    ...(isTablet && {
      gap: scale(16),
      marginBottom: scale(32),
    }),
    ...(isDesktop && {
      gap: scale(20),
      marginBottom: scale(40),
    }),
  },

  // Card Container
  cardContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: scale(9),
    minHeight: scale(150),
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // Card Content
  cardContent: {
    flex: 1,
    padding: scale(16),
    paddingTop: scale(14),
  },

  // Card Top Section (Icon + Metrics)
  cardTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(14),
  },

  // Icon Container
  cardIcon: {
    width: scale(40),
    height: scale(40),
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Metrics Container with Background
  metricsContainer: {
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.pillBg : '#F5F5F5',
    borderRadius: scale(6),
    paddingHorizontal: scale(0),
    paddingVertical: scale(4),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(6),
    flex: 1,
    maxWidth: scale(100),
  },

  // Metric Row
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  // Card Bottom Section (Title + Description + Action)
  cardBottomSection: {
    flex: 1,
    justifyContent: 'space-between', // This will push action text to bottom
  },

  // Card Title
  cardTitle: {
    fontSize: scale(14),
    fontWeight: '600', // Semibold for better readability
    color: theme.colors.textPrimary,
    marginBottom: scale(6),
    lineHeight: scale(18),
  },
  cardDescription: {
    fontSize: scale(10), // Increased from 8 to 10 for better readability
    color: theme.colors.textSecondary,
    fontWeight: '400', // Regular
    lineHeight: scale(12), // Adjusted line height
    marginBottom: scale(10),
  },

  // Card Metrics
  cardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    paddingHorizontal: scale(2),
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(1),
    minWidth: 0,
  },
  metricValue: {
    fontSize: scale(12), // Increased from 11 to 12 for better readability
    fontWeight: '600', // Semibold for better visibility
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
    marginBottom: scale(2), // Increased margin
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: scale(7), // Increased from 7 to 9 for better readability
    color: theme.colors.textSecondary,
    fontWeight: '600', // Medium for better visibility
    textAlign: 'center',
    lineHeight: scale(11), // Adjusted line height
  },

  // Card Action
  cardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionText: {
    fontSize: scale(10), // Increased from 8 to 10 for better readability
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
    fontWeight: '500', // Medium for better visibility
    alignSelf: 'flex-end', // Align to the right
    marginTop: 'auto', // Push to bottom
  },

  // Stats Section (if needed for future expansion)
  statsSection: {
    marginBottom: scale(24),
    // Responsive spacing
    ...(isTablet && {
      marginBottom: scale(32),
    }),
    ...(isDesktop && {
      marginBottom: scale(40),
    }),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: scale(16),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(22),
      marginBottom: scale(20),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(24),
      marginBottom: scale(24),
    }),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
    // Responsive layout
    ...(isTablet && {
      gap: scale(16),
    }),
    ...(isDesktop && {
      gap: scale(20),
    }),
  },
  statCard: {
    flex: 1,
    minWidth: isTablet ? '45%' : '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: scale(16),
    padding: scale(20),
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.isDark ? 0.15 : 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Responsive sizing
    ...(isTablet && {
      minWidth: '47%',
      padding: scale(24),
    }),
    ...(isDesktop && {
      minWidth: '30%',
      padding: scale(28),
    }),
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: scale(8),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(26),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(28),
    }),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: moderateScale(16),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
      lineHeight: moderateScale(17),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(18),
    }),
  },

  // Empty state (for future use)
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
  },
  emptyStateText: {
    fontSize: moderateScale(16),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: scale(16),
  },
});
