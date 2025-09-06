import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';

const { width: screenWidth } = Dimensions.get('window');

// Device type detection
const isTablet = screenWidth > 768 && screenWidth <= 1024;
const isDesktop = screenWidth > 1024;

export const createLoadToDockItemsScreenStyles = (theme: Theme, isTablet: boolean, isDesktop: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: scale(140), // Responsive padding
    // Responsive adjustments
    ...(isTablet && {
      paddingBottom: scale(160),
    }),
    ...(isDesktop && {
      paddingBottom: scale(180),
    }),
  },
  
  // Header Section - Improved hierarchy with better date alignment
  compactDetailsSection: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: scale(16),
    marginTop: scale(12),
    marginBottom: scale(8),
    padding: scale(16),
    borderRadius: scale(4), // Reduced from 12 to 4 for consistency
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4, // Added left border
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    // Responsive adjustments
    ...(isTablet && {
      marginHorizontal: scale(24),
      padding: scale(20),
    }),
    ...(isDesktop && {
      marginHorizontal: scale(32),
      padding: scale(24),
    }),
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftDetails: {
    flex: 1,
  },
  rightDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    fontWeight: '700', // Increased to 700 for bolder appearance
    marginBottom: scale(4),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(13),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
    }),
  },
  detailValue: {
    fontSize: moderateScale(16),
    color: theme.colors.textPrimary,
    fontWeight: '800', // Increased to 800 for bolder appearance
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
  customerName: {
    fontSize: moderateScale(18),
    color: theme.colors.textPrimary,
    fontWeight: '900', // Increased to 900 for bolder appearance
    marginBottom: scale(8),
    lineHeight: moderateScale(22),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(20),
      lineHeight: moderateScale(24),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(22),
      lineHeight: moderateScale(26),
    }),
  },
  salesOrderNumber: {
    fontSize: moderateScale(14),
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    fontWeight: '700', // Increased to 700 for bolder appearance
    marginBottom: scale(6),
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(15),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(16),
    }),
  },
  totalItems: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
  },
  dateSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start', // Align with the top of left details
  },
  dateLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '700', // Increased to 700 for bolder appearance
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '800', // Increased to 800 for bolder appearance
  },
  
  // Input Section - Enhanced with icons and better styling
  inputSection: {
    paddingHorizontal: scale(16),
    marginBottom: scale(16),
    gap: scale(8), // Reduced from 16 to 8 for tighter, more natural spacing
    // Responsive adjustments
    ...(isTablet && {
      paddingHorizontal: scale(24),
      marginBottom: scale(20),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
      marginBottom: scale(24),
    }),
  },
  vehicleInputContainer: {
    marginBottom: 8, // Reduced from 16 to 8 for tighter spacing
    minHeight: 52, // Added to match search container height
  },
  vehicleLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '700', // Increased to 700 for bolder appearance
    marginBottom: 6, // Reduced from 8 to 6 for better proportion with reduced container spacing
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleLabelText: {
    marginLeft: 8,
  },
  vehicleInput: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    fontWeight: '600', // Increased to 600 for bolder appearance
    minHeight: 52, // Added to ensure consistent height with search bar
  },
  vehicleInputRequired: {
    borderColor: theme.colors.error,
  },
  vehicleInputFocused: {
    borderColor: theme.colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Increased from 12 to 16 for better spacing
    minHeight: 52, // Added to ensure consistent height
  },
  searchBarWrapper: {
    flex: 1,
    minHeight: 52, // Added minimum height to match vehicle input
  },
  
  // Items Section - Better spacing and typography
  itemsSection: {
    flex: 1,
    paddingHorizontal: scale(16),
    // Responsive adjustments
    ...(isTablet && {
      paddingHorizontal: scale(24),
    }),
    ...(isDesktop && {
      paddingHorizontal: scale(32),
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20), // Increased from 16 to 20 for better spacing
    paddingHorizontal: scale(4),
    // Responsive adjustments
    ...(isTablet && {
      marginBottom: scale(24),
    }),
    ...(isDesktop && {
      marginBottom: scale(28),
    }),
  },
  sectionTitle: {
    fontSize: moderateScale(20), // Increased from 18 to 20 for better visibility
    fontWeight: '800', // Increased to 800 for bolder appearance
    color: theme.colors.textPrimary,
    // Responsive typography
    ...(isTablet && {
      fontSize: moderateScale(22),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(24),
    }),
  },
  itemCount: {
    fontSize: moderateScale(12), // Reduced from 13 to 12 for consistency
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
    backgroundColor: theme.colors.pillBg,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(6), // Reduced from 16 to 6 for consistency
    // Responsive adjustments
    ...(isTablet && {
      fontSize: moderateScale(13),
      paddingHorizontal: scale(14),
      paddingVertical: scale(8),
    }),
    ...(isDesktop && {
      fontSize: moderateScale(14),
      paddingHorizontal: scale(16),
      paddingVertical: scale(10),
    }),
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: 160, // Increased from 120 to 160 to account for sticky button with extra space
  },
  
  // Item Cards - Updated to match reference design
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(8), // Increased for more rounded corners like reference
    padding: scale(16), // Increased padding for better spacing
    marginBottom: scale(12), // Increased margin for better separation
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Responsive adjustments
    ...(isTablet && {
      padding: scale(18),
      marginBottom: scale(14),
    }),
    ...(isDesktop && {
      padding: scale(20),
      marginBottom: scale(16),
    }),
  },
  completedItemCard: {
    borderLeftColor: theme.colors.success,
    backgroundColor: theme.colors.white,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6, // Further reduced from 10 to 6 for more compact layout
  },
  itemId: {
    fontSize: 16,
    fontWeight: '800', // Increased to 800 for bolder appearance
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    letterSpacing: 0.5, // Increased for better readability
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.pillBg,
    borderRadius: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
    marginBottom: 8, // Further reduced from 12 to 8 for more compact layout
    lineHeight: 18, // Reduced from 20 to 18 for more compact text
    letterSpacing: 0.2, // Increased for better readability
  },
  
  // Quantity Section - Better visual hierarchy
  quantityRow: {
    marginBottom: 4, // Further reduced from 8 to 4 for more compact layout
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Further reduced from 12 to 8 for more compact layout
    flexWrap: 'wrap',
  },
  quantityLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12, // More rounded like a chip
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    minWidth: 45,
    textAlign: 'center',
    marginHorizontal: 4,
    fontWeight: '600',
  },
  quantityBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  quantityBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700', // Increased to 700 for bolder appearance
  },
  
  // Media Status - Converted to actionable chips
  mediaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Reduced from 8 to 6 for tighter spacing
    flexWrap: 'wrap',
  },
  mediaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  mediaChipPending: {
    backgroundColor: theme.colors.error + '20', // Use theme error color with opacity
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  mediaChipCompleted: {
    backgroundColor: theme.colors.success + '20', // Use theme success color with opacity
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statusTextPending: {
    color: theme.colors.error,
  },
  statusTextCompleted: {
    color: theme.colors.success,
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600', // Increased to 600 for bolder appearance
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontWeight: '500', // Increased to 500 for bolder appearance
  },
  
  // Bottom Button - Sticky and prominent with improved visibility
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: scale(20), // Increased from 16 to 20 for better touch target
    // paddingBottom is now handled dynamically with safe area insets
    borderTopWidth: 1,
    borderTopColor: theme.colors.separator,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -4 }, // Increased shadow for better visibility
    shadowOpacity: theme.colors.background === '#121212' ? 0.25 : 0.15, // Increased opacity for better visibility
    shadowRadius: 12, // Increased radius for better shadow effect
    elevation: 12, // Increased elevation for Android
    zIndex: 1000, // Ensure button is always on top
    // Responsive adjustments
    ...(isTablet && {
      padding: scale(24),
    }),
    ...(isDesktop && {
      padding: scale(28),
    }),
  },
  loadToDockButton: {
    // Override button color to match login button
    backgroundColor: '#FF7032', // Orange color like login button
    shadowColor: '#FF7032',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Match login button elevation
  },
  loadToDockButtonText: {
    // Override text styling to match login button
    color: '#FFFFFF', // White text for good contrast with orange background
    fontSize: moderateScale(15),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  
  // Vehicle Icon Container
  vehicleIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleIcon: {
    width: 20,
    height: 20,
    tintColor: theme.colors.primary,
  },
  
  // New styles for reference design
  pillTag: {
    backgroundColor: '#8b5cf6', // Purple color like reference
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12), // Pill shape
    alignSelf: 'flex-start',
    marginBottom: scale(8),
  },
  pillText: {
    color: '#ffffff',
    fontSize: moderateScale(12),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  quantitySection: {
    marginVertical: scale(8),
  },
  quantityValue: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  mediaTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(12),
    gap: scale(8),
  },
  mediaTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
    backgroundColor: '#1e3a8a', // Header color for pending state
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: '#1e3a8a',
    gap: scale(6),
  },
  pendingTab: {
    backgroundColor: '#1e3a8a', // Header color for pending
    borderColor: '#1e3a8a',
  },
  completedTab: {
    backgroundColor: '#10b981', // Green color for completed
    borderColor: '#10b981',
  },
  mediaTabText: {
    fontSize: moderateScale(12),
    color: '#ffffff', // White text for all tabs
    fontWeight: '500',
  },
  completedTabText: {
    color: '#ffffff', // White text for completed tabs
    fontWeight: '600',
  },
  
  // Reference Design Styles - Matching the Figma design exactly
  referenceCard: {
    backgroundColor: theme.colors.surface, // Use theme surface color
    borderRadius: scale(8), // 8px border radius as per Figma
    padding: scale(16), // 16px padding all around
    marginBottom: scale(12),
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.colors.background === '#121212' ? 0.15 : 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4, // 4-6px thick left border
    borderLeftColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Use theme primary color
    // Responsive adjustments
    ...(isTablet && {
      padding: scale(18),
      marginBottom: scale(14),
    }),
    ...(isDesktop && {
      padding: scale(20),
      marginBottom: scale(16),
    }),
  },
  // Card with shadow when media is pending
  referenceCardWithShadow: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(8),
    padding: scale(16),
    marginBottom: scale(12),
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.colors.background === '#121212' ? 0.25 : 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    // Responsive adjustments
    ...(isTablet && {
      padding: scale(18),
      marginBottom: scale(14),
    }),
    ...(isDesktop && {
      padding: scale(20),
      marginBottom: scale(16),
    }),
  },
  // Item ID Tag (pill-shaped background)
  itemIdContainer: {
    backgroundColor: theme.colors.pillBg,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(12), // Pill shape
    alignSelf: 'flex-start',
    marginBottom: scale(8),
  },
  itemIdText: {
    fontSize: moderateScale(12),
    fontWeight: '600', // Increased weight for better visibility
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Match header color
    // theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a'// Use theme primary color
    letterSpacing: 0.2,
  },
  referenceDescription: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // Use theme text color
    fontWeight: '500', // Increased weight for better visibility
    marginBottom: scale(12),
    lineHeight: moderateScale(20),
  },
  referenceQuantitySection: {
    marginBottom: scale(12),
  },
  // Two column layout for quantity section
  figmaQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: scale(16), // 16px gap between columns
  },
  quantityColumn: {
    flex: 1,
  },
  figmaQuantityLabel: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary, // Use theme secondary text color
    fontWeight: '500', // Increased weight for better visibility
    marginBottom: scale(2),
  },
  figmaQuantityValue: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // Use theme primary text color
    fontWeight: '700', // Increased weight for better visibility
  },
  loadedQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referenceQuantityInput: {
    borderWidth: 1,
    borderColor: theme.colors.border, // Use theme border color
    borderRadius: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // Use theme text color
    backgroundColor: theme.colors.surface, // Use theme surface color
    minWidth: scale(40),
    textAlign: 'center',
    marginRight: scale(4),
    fontWeight: '600', // Increased weight for better visibility
  },
  quantityOfText: {
    fontSize: moderateScale(14),
    color: theme.colors.textSecondary, // Use theme secondary text color
    fontWeight: '500', // Increased weight for better visibility
  },
  referenceActionButtons: {
    backgroundColor: theme.colors.pillBg,
    borderRadius: scale(2),
    paddingVertical: scale(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(8), // 8px gap between buttons
  },
  referenceActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(6), // 6px vertical padding as per Figma
    paddingHorizontal: scale(8), // 8px horizontal padding as per Figma
    borderRadius: scale(6), // 6px border radius as per Figma
    gap: scale(6), // 6px gap between icon and text
  },
  referenceActionButtonPending: {
    backgroundColor: theme.colors.pillBg, // Use theme pill background
  },
  referenceActionButtonCompleted: {
    backgroundColor: theme.colors.pillBg, // Use theme pill background
  },
  referenceActionButtonText: {
    fontSize: moderateScale(12),
    fontWeight: '500', // Increased weight for better visibility
    letterSpacing: 0.2,
  },
  pendingButtonText: {
    color: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a', // Use theme primary color
  },
  completedButtonText: {
    color: '#10B981', // Green text for completed state
  },
  referenceActionButtonIcon: {
    // Icon container for proper alignment
  },
  
  // Missing styles that LoadToDockItemCard expects
  referenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  referenceItemNumber: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
  referenceArrow: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  referenceQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(4),
    flexWrap: 'wrap',
  },
  referenceQuantityLabel: {
    fontSize: moderateScale(14),
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginRight: scale(8),
  },
  referenceQuantityValue: {
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
});
