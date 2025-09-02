import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createLoadToDockItemsScreenStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingBottom: 140, // Increased from 100 to 140 to prevent content from being hidden behind sticky button
  },
  
  // Header Section - Improved hierarchy with better date alignment
  compactDetailsSection: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 20,
  },
  customerName: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 22,
  },
  salesOrderNumber: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  totalItems: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  dateSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start', // Align with the top of left details
  },
  dateLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  
  // Input Section - Enhanced with icons and better styling
  inputSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8, // Reduced from 16 to 8 for tighter, more natural spacing
  },
  vehicleInputContainer: {
    marginBottom: 8, // Reduced from 16 to 8 for tighter spacing
    minHeight: 52, // Added to match search container height
  },
  vehicleLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
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
    fontWeight: '500',
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
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Increased from 16 to 20 for better spacing
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20, // Increased from 18 to 20 for better section separation
    fontWeight: '800', // Increased from 700 to 800 for bolder appearance
    color: theme.colors.textPrimary,
  },
  itemCount: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    backgroundColor: theme.colors.pillBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: 160, // Increased from 120 to 160 to account for sticky button with extra space
  },
  
  // Item Cards - Improved readability and visual hierarchy with better spacing
  itemCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20, // Increased from 16 to 20 for better breathing room
    marginBottom: 16, // Increased from 12 to 16 for better card separation
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },
  completedItemCard: {
    borderLeftColor: theme.colors.success,
    backgroundColor: theme.colors.white,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12, // Increased from 10 to 12
  },
  itemId: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
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
    fontWeight: '500',
    marginBottom: 14, // Increased from 12 to 14
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  
  // Quantity Section - Better visual hierarchy
  quantityRow: {
    marginBottom: 10, // Increased from 8 to 10
  },
  loadedQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Increased from 12 to 16
    flexWrap: 'wrap',
  },
  quantityLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  quantityInput: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    minWidth: 50,
    textAlign: 'center',
    marginHorizontal: 6,
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
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Media Status - Converted to actionable chips
  mediaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  mediaChipCompleted: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#10b981',
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
    color: '#92400e',
  },
  statusTextCompleted: {
    color: '#065f46',
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
    fontWeight: '500',
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
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  
  // Bottom Button - Sticky and prominent with improved visibility
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    padding: 20, // Increased from 16 to 20 for better touch target
    // paddingBottom is now handled dynamically with safe area insets
    borderTopWidth: 1,
    borderTopColor: theme.colors.separator,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -4 }, // Increased shadow for better visibility
    shadowOpacity: 0.15, // Increased opacity for better visibility
    shadowRadius: 12, // Increased radius for better shadow effect
    elevation: 12, // Increased elevation for Android
    zIndex: 1000, // Ensure button is always on top
  },
  loadToDockButton: {
    backgroundColor: '#1976d2', // Primary Blue as suggested
    // Alternative: backgroundColor: '#4CAF50', // Green option as suggested
    paddingVertical: 18, // Increased from 16 to 18 for better touch target
    borderRadius: 12, // Increased from 10 to 12 for more modern look
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 6 }, // Increased shadow for better depth
    shadowOpacity: 0.4, // Increased opacity for better visibility
    shadowRadius: 12, // Increased radius for better shadow effect
    elevation: 8, // Increased elevation for Android
  },
  disabledButton: {
    backgroundColor: theme.colors.textTertiary,
    shadowOpacity: 0,
    elevation: 0,
  },
  loadToDockButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '800', // Increased from 700 to 800 for bolder text
    textAlign: 'center',
    letterSpacing: 0.8, // Increased from 0.5 to 0.8 for better readability
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
});
