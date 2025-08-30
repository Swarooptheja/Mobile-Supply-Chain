import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions for responsive sizing
const scale = (size: number) => (size * screenWidth) / 375;
const verticalScale = (size: number) => (size * screenHeight) / 812;
const moderateScale = (size: number, factor: number = 0.5) => size + (scale(size) - size) * factor;

// Device size detection
const isSmallDevice = screenWidth <= 375;
const isTablet = screenWidth > 768;

// Create styles function that accepts theme
export const createOrganizationScreenStyles = (theme: Theme) => StyleSheet.create({
  // OrganizationScreen Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  
  // Enhanced Search Container - Dynamic spacing
  searchContainer: { 
    marginTop: verticalScale(12), 
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(4),
  },
  
  // List Content with better spacing - Dynamic padding
  listContent: {
    paddingBottom: isSmallDevice ? verticalScale(20) : verticalScale(30), // Reduced padding to remove extra space
    paddingHorizontal: scale(4),
  },
  
  // Modern Organization Card
  organizationCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  
  // Selected Card State
  organizationCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.pillBgSelected,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.15,
    elevation: 6,
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
  
  // Modern Radio Button Outer
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.radioBorder,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  
  // Radio Button Outer Selected
  radioOuterSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Radio Button Inner
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.background,
  },
  
  // Organization Info Container
  organizationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Enhanced Organization Name
  organizationName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: theme.colors.textPrimary, 
    marginBottom: 2,
  },
  
  // Organization Name Selected
  organizationNameSelected: {
    color: theme.colors.primary,
  },
  
  // Enhanced Organization ID
  organizationId: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  
  // Modern Code Badge
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.pillBg,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  // Code Badge Selected
  codeBadgeSelected: { 
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  
  // Code Badge Text
  codeBadgeText: { 
    color: theme.colors.pillText, 
    fontSize: 12, 
    fontWeight: '600',
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
    backgroundColor: theme.colors.background,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: isSmallDevice ? verticalScale(16) : verticalScale(24), // Dynamic padding
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    // Removed shadow properties to eliminate shadow behind button
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
  
  // Enhanced List Separator
  listSeparator: {
    height: 1,
    backgroundColor: theme.colors.separator,
    marginLeft: 48,
    marginRight: 16,
    opacity: 0.5,
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
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '500',
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
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(12),
  },

  tabletFooter: {
    bottom: verticalScale(40),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
    maxWidth: 600,
    alignSelf: 'center',
    left: scale(20),
    right: scale(20),
  },

  // Responsive content adjustments
  smallDeviceContent: {
    marginBottom: verticalScale(100),
    paddingHorizontal: scale(12),
  },

  tabletContent: {
    marginBottom: verticalScale(160),
    paddingHorizontal: scale(24),
  },
});

// Default styles for when theme is not available
export const defaultOrganizationScreenStyles = createOrganizationScreenStyles({
  colors: {
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#1e3a8a',
    border: '#e5e7eb',
    separator: '#e5e7eb',
    pillBg: '#f3f4f6',
    pillBgSelected: '#dbeafe',
    pillText: '#374151',
    pillTextSelected: '#1d4ed8',
    buttonBg: '#2563eb',
    buttonText: '#ffffff',
    radioBorder: '#9ca3af',
  },
});
