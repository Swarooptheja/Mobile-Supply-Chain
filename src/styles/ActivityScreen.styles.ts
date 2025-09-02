import { StyleSheet } from 'react-native';

export const createActivityScreenStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light gray background for better contrast
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 12, // Reduced from 14 to 12 for more compact look
    paddingBottom: 80, // Reduced from 100 to 80 for more compact look
  },
  smallDeviceContent: {
    padding: 8, // Reduced from 10 to 8 for more compact look
  },
  tabletContent: {
    padding: 16, // Reduced from 20 to 16 for more compact look
    maxWidth: 900,
    alignSelf: 'center',
  },
  
  // Header styles - Enhanced with better balance and softer styling
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12, // Ensure 44px minimum touch target
    backgroundColor: 'transparent', // Outline style
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F87171', // Softer red
    shadowColor: '#F87171',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    minHeight: 44, // Ensure 44px minimum touch target
  },
  logoutButtonText: {
    color: '#DC2626', // Softer red text
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginLeft: 4,
  },

  // Progress overview styles - Enhanced with better visual hierarchy
  progressOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Reduced from 16 to 14 for more compact look
    padding: 10, // Reduced from 12 to 10 for more compact look
    marginBottom: 10, // Reduced from 12 to 10 for more compact look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to the left instead of center
    marginBottom: 6, // Reduced from 8 to 6 for more compact look
  },
  progressIconContainer: {
    marginRight: 8, // Reduced from 10 to 8 for more compact look
    padding: 4, // Reduced from 5 to 4 for more compact look
    backgroundColor: '#DBEAFE', // Light blue background for sync icon
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
  },
  progressIcon: {
    // Icon styling handled in component
  },
  progressTitle: {
    fontSize: 14, // Reduced from 15 to 14 for more compact look
    fontWeight: '700', // Bold for section title as shown in image
    color: '#1E293B', // Dark blue text
    textAlign: 'left', // Align to the left instead of center
    letterSpacing: 0.3,
  },
  
  // Last sync info styles
  lastSyncInfo: {
    alignItems: 'center',
    marginBottom: 6, // Reduced from 8 to 6 for more compact look
  },
  lastSyncText: {
    fontSize: 10, // Reduced from 11 to 10 for more compact look
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Progress section styles
  progressSection: {
    marginBottom: 10, // Reduced from 12 to 10 for more compact look
    alignItems: 'flex-start', // Ensure left alignment
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 3, // Reduced from 4 to 3 for more compact look
  },
  progressLabel: {
    fontSize: 13, // Reduced from 14 to 13 for more compact look
    fontWeight: '700', // Bold as shown in image
    color: '#1E293B',
    marginBottom: 3, // Reduced from 4 to 3 for more compact look
    textAlign: 'left',
    alignSelf: 'flex-start', // Ensure left alignment
  },
  progressBarContainer: {
    marginBottom: 6, // Reduced from 8 to 6 for more compact look
    position: 'relative', // For centered percentage
    alignSelf: 'stretch', // Ensure full width
  },
  progressBar: {
    height: 12, // Reduced from 14 to 12 for more compact look
    backgroundColor: '#E2E8F0', // Light gray background for progress bar
    borderRadius: 8, // More rounded
    marginBottom: 0, // Remove bottom margin since percentage is centered
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6', // Blue progress bar as shown in image
    borderRadius: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  progressPercentage: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    fontWeight: '700',
    color: '#1E293B', // Dark color since it's not on the progress bar
    textAlign: 'right',
    minWidth: 50, // Ensure consistent width
  },
  progressStats: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping for 2x2 grid
    justifyContent: 'space-between',
    gap: 8, // Reduced from 10 to 8 for more compact look
    marginTop: 4, // Reduced from 6 to 4 for more compact look
  },
  statItem: {
    alignItems: 'center',
    width: '48%', // Two items per row with gap
    padding: 8, // Reduced from 10 to 8 for more compact look
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 4, // Reduced from 6 to 4 for more compact look
  },
  statItemCompleted: {
    backgroundColor: '#D1FAE5', // Light green background
    borderColor: '#10B981',
  },
  statItemFailed: {
    backgroundColor: '#FEE2E2', // Light red background
    borderColor: '#EF4444',
  },
  statItemTotal: {
    backgroundColor: '#F8FAFC', // Light gray/white background
    borderColor: '#E2E8F0',
  },
  statItemRecords: {
    backgroundColor: '#DBEAFE', // Light blue background
    borderColor: '#3B82F6',
  },
  statIconContainer: {
    marginBottom: 2, // Reduced from 3 to 2 for more compact look
    padding: 2, // Reduced from 3 to 2 for more compact look
    backgroundColor: 'rgba(255,255,255,0.7)', // More transparent white for subtle effect
    borderRadius: 4, // Reduced from 5 to 4 for more compact look
  },
  statIcon: {
    // Icon styling handled in component
  },
  statNumber: {
    fontSize: 16, // Reduced from 18 to 16 for more compact look
    fontWeight: '900', // Bold numbers as shown in image
    marginBottom: 0, // Reduced from 1 to 0 for more compact look
    letterSpacing: 0.3,
  },
  statNumberCompleted: {
    color: '#10B981', // Green text on light green background
  },
  statNumberFailed: {
    color: '#EF4444', // Red text on light red background
  },
  statNumberTotal: {
    color: '#64748B', // Gray text on light gray background
  },
  statNumberRecords: {
    color: '#3B82F6', // Blue text on light blue background
  },
  statLabel: {
    fontSize: 7, // Reduced from 8 to 7 for more compact look
    textAlign: 'center',
    fontWeight: '800', // Extra bold as shown in image
    textTransform: 'uppercase',
    letterSpacing: 0.6, // Reduced from 0.8 to 0.6 for more compact look
  },
  statLabelCompleted: {
    color: '#10B981', // Green text on light green background
  },
  statLabelFailed: {
    color: '#EF4444', // Red text on light red background
  },
  statLabelTotal: {
    color: '#64748B', // Gray text on light gray background
  },
  statLabelRecords: {
    color: '#3B82F6', // Blue text on light blue background
  },

  // Sync card styles - Enhanced with better layout and spacing
  syncCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Reduced from 12 to 10 for more compact look
    marginBottom: 10, // Reduced from 12 to 10 for more compact look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderTouchable: {
    // No additional styling needed - inherits from parent
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12, // Reduced from 16 to 12 for more compact look
    paddingLeft: 16, // Reduced from 20 to 16 for more compact look (account for accent bar)
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Reduced from 12 to 8 for more compact look
  },
  cardIcon: {
    marginRight: 12, // Reduced from 16 to 12 for more compact look
    padding: 8, // Reduced from 10 to 8 for more compact look
    backgroundColor: '#F1F5F9',
    borderRadius: 8, // Reduced from 10 to 8 for more compact look
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14, // Reduced from 15 to 14 for more compact look
    fontWeight: '700', // Bold for card title
    color: '#1E293B',
    marginBottom: 4, // Reduced from 6 to 4 for more compact look
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 10, // Reduced from 11 to 10 for more compact look
    fontWeight: '500', // Medium for meta
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748B', // Muted color
  },
  
  // Right side card content
  cardRightSide: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minWidth: 70, // Reduced from 80 to 70 for more compact look
  },
  cardRecordCount: {
    fontSize: 20, // Reduced from 22 to 20 for more compact look
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 2, // Reduced from 3 to 2 for more compact look
  },
  cardTimestamp: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4, // Reduced from 6 to 4 for more compact look
  },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced from 6 to 4 for more compact look
  },
  
  // Inserted Records section
  insertedRecordsSection: {
    backgroundColor: '#D1FAE5', // Light green background
    marginHorizontal: 16, // Reduced from 20 to 16 for more compact look
    marginBottom: 12, // Reduced from 16 to 12 for more compact look
    padding: 16, // Reduced from 20 to 16 for more compact look
    borderRadius: 10, // Reduced from 12 to 10 for more compact look
    alignItems: 'center',
  },
  insertedRecordsNumber: {
    fontSize: 28, // Reduced from 32 to 28 for more compact look
    fontWeight: '900',
    color: '#059669', // Dark green
    marginBottom: 6, // Reduced from 8 to 6 for more compact look
  },
  insertedRecordsLabel: {
    fontSize: 14, // Reduced from 16 to 14 for more compact look
    fontWeight: '600',
    color: '#059669', // Dark green
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 44, // Better alignment
    gap: 8, // Vertical rhythm: 8px
    minWidth: 0, // Prevent text overflow
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Vertical rhythm: 8px
    flexWrap: 'nowrap', // Prevent wrapping
  },
  syncRow: {
    marginBottom: 8, // Vertical rhythm: 8px
  },
  insertedRow: {
    marginTop: 8, // Vertical rhythm: 8px
  },
  debugRow: {
    marginTop: 8, // Vertical rhythm: 8px
  },
  recordsText: {
    fontSize: 14, // Body: 14-15 regular
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 2,
    flex: 1,
    flexShrink: 1, // Allow shrinking if needed
  },
  syncTimeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    flexShrink: 1, // Allow shrinking if needed
  },
  insertedText: {
    fontSize: 12, // Smaller for pill badge
    color: '#059669', // Modern green
    fontWeight: '600',
    backgroundColor: '#D1FAE5', // Light green background
    paddingHorizontal: 12, // Increased horizontal padding
    paddingVertical: 6, // Increased vertical padding
    borderRadius: 12, // More rounded for pill shape
    alignSelf: 'flex-start',
    overflow: 'hidden', // Ensure text doesn't overflow
  },
  debugText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusContainer: {
    justifyContent: 'flex-start', // Move to top
    alignItems: 'center',
    marginLeft: 12, // Reduced from 14 to 12 for more compact look
    marginTop: 2, // Reduced from 3 to 2 for more compact look
    alignSelf: 'flex-start', // Ensure it stays at top
  },
  statusIndicator: {
    width: 36, // Reduced from 40 to 36 for more compact look
    height: 36, // Reduced from 40 to 36 for more compact look
    borderRadius: 18, // Reduced from 20 to 18 for more compact look
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // Error expansion styles - Enhanced for better readability
  errorExpansion: {
    backgroundColor: '#FEF2F2', // Light red background
    padding: 16, // Reduced from 20 to 16 for more compact look
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
    marginTop: 0,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced from 12 to 10 for more compact look
  },
  errorIcon: {
    marginRight: 8, // Reduced from 10 to 8 for more compact look
  },
  errorTitle: {
    fontSize: 15, // Reduced from 16 to 15 for more compact look
    fontWeight: '700',
    color: '#DC2626', // Red color for error information
    marginBottom: 8, // Add some spacing between title and URL
  },
  errorMessage: {
    fontSize: 13, // Reduced from 14 to 13 for more compact look
    color: '#1E40AF', // Blue color for URL to make it stand out
    marginBottom: 12, // Reduced from 16 to 12 for more compact look
    lineHeight: 18, // Reduced from 20 to 18 for more compact look
    backgroundColor: '#F0F9FF', // Light blue background for URL
    padding: 12, // Increased padding for better readability
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
    borderWidth: 1,
    borderColor: '#DBEAFE', // Light blue border
    fontFamily: 'monospace', // Monospace font for URL
    fontWeight: '500',
    textAlign: 'center', // Center the URL text
  },
  
  errorMetadata: {
    marginBottom: 12, // Reduced from 16 to 12 for more compact look
    backgroundColor: '#FFFFFF',
    padding: 10, // Reduced from 12 to 10 for more compact look
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorMetaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6, // Reduced from 8 to 6 for more compact look
    paddingVertical: 1, // Reduced from 2 to 1 for more compact look
  },
  errorMetaLabel: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    fontWeight: '600', // Medium for meta
    color: '#6B7280',
  },
  errorMetaValue: {
    fontSize: 12, // Reduced from 13 to 12 for more compact look
    color: '#374151',
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 18, // Reduced from 20 to 18 for more compact look
    paddingVertical: 10, // Reduced from 12 to 10 for more compact look
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
    alignSelf: 'flex-start',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 40, // Reduced from 44 to 40 for more compact look
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13, // Reduced from 14 to 13 for more compact look
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Empty state styles - Enhanced for better visual appeal
  emptyState: {
    alignItems: 'center',
    padding: 32, // Reduced from 40 to 32 for more compact look
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Reduced from 16 to 14 for more compact look
    marginTop: 16, // Reduced from 20 to 16 for more compact look
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateIconContainer: {
    marginBottom: 12, // Reduced from 16 to 12 for more compact look
    padding: 16, // Reduced from 20 to 16 for more compact look
    backgroundColor: '#F1F5F9',
    borderRadius: 16, // Reduced from 20 to 16 for more compact look
  },
  emptyStateIcon: {
    // Icon styling handled in component
  },
  emptyStateTitle: {
    fontSize: 16, // Reduced from 18 to 16 for more compact look
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8, // Reduced from 10 to 8 for more compact look
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 13, // Reduced from 14 to 13 for more compact look
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18, // Reduced from 20 to 18 for more compact look
    maxWidth: 280,
    marginBottom: 12, // Reduced from 16 to 12 for more compact look
  },
  emptyStateTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10, // Reduced from 12 to 10 for more compact look
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
    maxWidth: 280,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipIcon: {
    marginRight: 6, // Reduced from 8 to 6 for more compact look
  },
  tipText: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    color: '#94A3B8',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 14, // Reduced from 16 to 14 for more compact look
  },

  // Action section styles - Enhanced for better visual hierarchy
  actionSection: {
    marginBottom: 16, // Reduced from 20 to 16 for more compact look
    padding: 16, // Reduced from 20 to 16 for more compact look
    backgroundColor: '#F8FAFC',
    borderRadius: 14, // Reduced from 16 to 14 for more compact look
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced from 12 to 10 for more compact look
    justifyContent: 'center',
  },
  actionIcon: {
    marginRight: 8, // Reduced from 10 to 8 for more compact look
    padding: 5, // Reduced from 6 to 5 for more compact look
    backgroundColor: '#DBEAFE',
    borderRadius: 6, // Reduced from 8 to 6 for more compact look
  },
  actionTitle: {
    fontSize: 15, // Reduced from 16 to 15 for more compact look
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  retryHint: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8, // Reduced from 10 to 8 for more compact look
    fontStyle: 'italic',
    lineHeight: 14, // Reduced from 16 to 14 for more compact look
  },

  // Additional utility styles
  notificationCount: {
    fontSize: 15, // Reduced from 16 to 15 for more compact look
    fontWeight: '700',
    color: '#3B82F6',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6, // Reduced from 8 to 6 for more compact look
    paddingVertical: 3, // Reduced from 4 to 3 for more compact look
    borderRadius: 8, // Reduced from 10 to 8 for more compact look
    minWidth: 26, // Reduced from 28 to 26 for more compact look
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  expandButton: {
    padding: 4, // Reduced from 5 to 4 for more compact look
  },
  expandIcon: {
    fontSize: 14, // Reduced from 15 to 14 for more compact look
    color: '#64748B',
    fontWeight: '600',
  },

  // Collapsed summary styles
  collapsedSummary: {
    paddingHorizontal: 12, // Reduced from 16 to 12 for more compact look
    paddingBottom: 8, // Reduced from 12 to 8 for more compact look
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  collapsedSummaryText: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Success message styles for non-expandable successful cards
  successMessage: {
    paddingHorizontal: 12, // Reduced from 16 to 12 for more compact look
    paddingBottom: 8, // Reduced from 12 to 8 for more compact look
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  successMessageText: {
    fontSize: 11, // Reduced from 12 to 11 for more compact look
    color: '#059669',
    fontWeight: '500',
    textAlign: 'center',
  },
  dashboardReadyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  dashboardReadyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

// Additional style functions for the new components
export const createProgressOverviewStyles = () => StyleSheet.create({
  progressOverview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 6,
  },
  progressIconContainer: {
    marginRight: 8,
    padding: 4,
    backgroundColor: '#DBEAFE',
    borderRadius: 6,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'left',
    letterSpacing: 0.3,
  },
  dashboardReadyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  dashboardReadyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSection: {
    marginBottom: 10,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  progressBarContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconContainer: {
    marginBottom: 4,
    padding: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 0,
    letterSpacing: 0.3,
  },
  statLabel: {
    fontSize: 7,
    textAlign: 'center',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statItemCompleted: {
    borderColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  statNumberCompleted: {
    color: '#059669',
  },
  statLabelCompleted: {
    color: '#047857',
  },
  statItemFailed: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  statNumberFailed: {
    color: '#DC2626',
  },
  statLabelFailed: {
    color: '#B91C1C',
  },
  statItemTotal: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  statNumberTotal: {
    color: '#64748B',
  },
  statLabelTotal: {
    color: '#475569',
  },
  statItemRecords: {
    borderColor: '#DBEAFE',
    backgroundColor: '#F0F9FF',
  },
  statNumberRecords: {
    color: '#3B82F6',
  },
  statLabelRecords: {
    color: '#1D4ED8',
  },
});

export const createActivityCardStyles = () => StyleSheet.create({
  syncCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  cardHeaderTouchable: {
    padding: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    marginRight: 10,
    padding: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardRightSide: {
    alignItems: 'flex-end',
  },
  cardRecordCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardTimestamp: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  cardStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    padding: 6,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButton: {
    padding: 4,
  },
  collapsedSummary: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  collapsedSummaryText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  successMessage: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  successMessageText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '500',
    textAlign: 'center',
  },
  insertedRecordsSection: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  insertedRecordsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  insertedRecordsLabel: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '500',
  },
  errorExpansion: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626', // Red color for error information
    marginBottom: 8, // Add spacing between title and URL
  },
  errorMessage: {
    fontSize: 11,
    color: '#1E40AF', // Blue color for URL to make it stand out
    marginBottom: 12,
    lineHeight: 16,
    backgroundColor: '#F0F9FF', // Light blue background for URL
    padding: 12, // Increased padding for better readability
    borderRadius: 6, // Rounded corners
    borderWidth: 1,
    borderColor: '#DBEAFE', // Light blue border
    fontFamily: 'monospace', // Monospace font for URL
    fontWeight: '500',
    textAlign: 'center', // Center the URL text
  },
  
  // Organization ID section styles
  orgIdSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#FEF3F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  orgIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
    marginRight: 8,
  },
  orgIdValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    fontFamily: 'monospace',
  },
  
  errorMetadata: {
    marginBottom: 12,
  },
  errorMetaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  errorMetaLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  errorMetaValue: {
    fontSize: 10,
    color: '#1E293B',
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export const createEmptyStateStyles = () => StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIconContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 50,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyStateTip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

export const createActionButtonsStyles = () => StyleSheet.create({
  actionSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginLeft: 8,
  },
  retryHint: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 14,
  },
});
