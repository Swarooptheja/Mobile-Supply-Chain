import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { getSelectionColor, getButtonColor } from './global.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions for responsive sizing
const scale = (size: number) => (size * screenWidth) / 375;
const verticalScale = (size: number) => (size * screenHeight) / 812;

// Device size detection
const isSmallDevice = screenWidth <= 375;

// Create styles function that accepts theme
export const createOrganizationScreenStyles = (theme: Theme) => StyleSheet.create({
  // OrganizationScreen Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Theme-aware background
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0, // Remove bottom padding since sticky footer handles it
  },
  
  // Content Container - Dynamic spacing
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    marginBottom: isSmallDevice ? verticalScale(120) : verticalScale(140), // Dynamic margin based on screen size
  },
  
  // Enhanced Search Container - Better spacing
  searchContainer: { 
    marginTop: verticalScale(20), 
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(4),
  },
  
  // List Content with better spacing - Dynamic padding
  listContent: {
    paddingBottom: isSmallDevice ? verticalScale(20) : verticalScale(30), // Reduced padding to remove extra space
    paddingHorizontal: scale(4),
  },
  
  // Modern Organization Card - Enhanced user-friendly design
  organizationCard: {
    backgroundColor: theme.colors.surface, // Subtle background for better contrast
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    // Subtle shadow for depth without being heavy
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  
  // Selected Card State - Enhanced selection visibility
  organizationCardSelected: {
    borderColor: getSelectionColor(theme.colors.background === '#121212'), // Theme-aware selection color
    backgroundColor: theme.colors.pillBgSelected, // Subtle background highlight
    borderWidth: 2, // Thicker border for better visibility
    shadowColor: getSelectionColor(theme.colors.background === '#121212'),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Card Header with better layout
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
  },
  
  // Left side of card header
  cardHeaderLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    marginRight: 8,
  },
  
  // Enhanced Radio Container
  radioContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Modern Radio Button Outer - Enhanced visibility
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.radioBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    // Subtle shadow for better definition
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Radio Button Outer Selected - Theme-aware selection color
  radioOuterSelected: {
    borderColor: getSelectionColor(theme.colors.background === '#121212'), // Theme-aware selection color
    backgroundColor: getSelectionColor(theme.colors.background === '#121212'),
    shadowColor: getSelectionColor(theme.colors.background === '#121212'),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Radio Button Inner - Enhanced visibility
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
  },
  
  // Organization Info Container
  organizationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Enhanced Organization Name - Better hierarchy
  organizationName: { 
    fontSize: 17, 
    fontWeight: '600', // Slightly less bold for better readability
    color: theme.colors.textPrimary, // Theme-aware text color
    marginBottom: 6,
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  
  // Organization Name Selected - Theme-aware selection color
  organizationNameSelected: {
    color: getSelectionColor(theme.colors.background === '#121212'), // Theme-aware selection color
  },
  
  // Enhanced Organization ID - Better contrast
  organizationId: {
    fontSize: 14,
    color: theme.colors.textSecondary, // Theme-aware secondary text color
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 18,
    opacity: 0.8,
  },
  
  // Modern Code Badge - Centered alignment
  codeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.pillBg,
    borderRadius: 20,
    alignSelf: 'center', // Center the chip
    borderWidth: 1,
    borderColor: theme.colors.border,
    minWidth: 55,
    alignItems: 'center',
    justifyContent: 'center', // Center content within chip
    // Subtle shadow for depth
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  // Code Badge Selected - Theme-aware selection color
  codeBadgeSelected: { 
    backgroundColor: getSelectionColor(theme.colors.background === '#121212'), // Theme-aware selection color
    borderColor: getSelectionColor(theme.colors.background === '#121212'),
  },
  
  // Code Badge Text - Enhanced readability
  codeBadgeText: { 
    color: theme.colors.pillText, 
    fontSize: 13, 
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  
  // Code Badge Text Selected
  codeBadgeTextSelected: { 
    color: theme.colors.background,
  },
  
  // Organization Subtitle (if needed)
  organizationSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 40,
    fontWeight: '400',
    opacity: 0.8,
  },

  // Enhanced Sticky Footer - Dynamic positioning based on screen size
  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: isSmallDevice ? verticalScale(20) : verticalScale(30), // Dynamic bottom positioning
    backgroundColor: theme.colors.background, // Theme-aware background
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(20),
    paddingBottom: isSmallDevice ? verticalScale(20) : verticalScale(24), // Dynamic padding
    borderTopWidth: 1,
    borderTopColor: theme.colors.border, // Theme-aware border
    // No shadows for clean, flat design
    // Responsive margins for different screen sizes
    marginHorizontal: isSmallDevice ? scale(8) : scale(16),
    borderRadius: isSmallDevice ? scale(12) : scale(16),
  },
  
  // Enhanced Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  
  // Empty State Icon Container
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.pillBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  // Empty State Text
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  
  // Empty State Subtext
  emptyStateSubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  
  // Enhanced List Separator - Better visual separation
  listSeparator: {
    height: 1,
    backgroundColor: theme.colors.separator,
    marginLeft: 56, // Aligned with radio button + margin
    marginRight: 20, // Aligned with card padding
    opacity: 0.4, // Slightly more visible
  },
  
  // Loading Container
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading Text
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 12,
    fontWeight: '500',
  },
  
  // Search Results Count
  searchResultsCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  
  // No Results Container
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  // No Results Icon
  noResultsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.pillBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  // No Results Text
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  // No Results Subtext
  noResultsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Responsive footer adjustments for different screen sizes
  smallDeviceFooter: {
    bottom: verticalScale(15),
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    marginHorizontal: scale(4),
  },

  tabletFooter: {
    bottom: verticalScale(40),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    maxWidth: 600,
    alignSelf: 'center',
    left: scale(20),
    right: scale(20),
    marginHorizontal: 0,
  },

  // Responsive content adjustments
  smallDeviceContent: {
    marginBottom: verticalScale(100),
    paddingHorizontal: scale(12),
  },

  tabletContent: {
    marginBottom: verticalScale(180),
    paddingHorizontal: scale(24),
    maxWidth: 800,
    alignSelf: 'center',
  },

  // Desktop-specific styles
  desktopContent: {
    marginBottom: verticalScale(200),
    paddingHorizontal: scale(32),
    maxWidth: 1200,
    alignSelf: 'center',
  },

  desktopFooter: {
    bottom: verticalScale(50),
    paddingHorizontal: scale(32),
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(36),
    maxWidth: 1200,
    alignSelf: 'center',
    left: scale(32),
    right: scale(32),
    marginHorizontal: 0,
  },

  // Confirm Button - Global button color
  confirmButton: {
    backgroundColor: getButtonColor(), // Global button color
    borderColor: getButtonColor(),
    borderRadius: 12, // Smooth border radius
    paddingVertical: 18, // Increased padding for better touch target
    paddingHorizontal: 24,
    // Subtle shadow for better definition
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Confirm Button Text - Enhanced readability
  confirmButtonText: {
    color: '#FFFFFF', // White text for consistency with header
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
});

// Default styles for when theme is not available
export const defaultOrganizationScreenStyles = createOrganizationScreenStyles({
  colors: {
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    text: '#1f2937',
    textTertiary: '#9ca3af',
    primary: '#1e3a8a',
    border: '#e5e7eb',
    separator: '#e5e7eb',
    pillBg: '#f3f4f6',
    pillBgSelected: '#dbeafe',
    pillText: '#374151',
    pillTextSelected: '#1d4ed8',
    buttonBg: '#1e3a8a',
    buttonText: '#ffffff',
    radioBorder: '#9ca3af',
    surface: '#f9fafb',
    shadow: '#000000',
    error: '#dc2626',
    white: '#ffffff',
    success: '#059669',
  },
});
