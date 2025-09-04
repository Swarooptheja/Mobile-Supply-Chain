import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createTransactionHistoryScreenStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Filter Section
  filterContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 16,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  filterBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: '#ffffff',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  filterBadgeTextActive: {
    color: '#1e3a8a',
  },

  // Transaction Cards
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statusBadgeSuccess: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  statusBadgeFailed: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextPending: {
    color: '#d97706',
  },
  statusTextSuccess: {
    color: '#059669',
  },
  statusTextFailed: {
    color: '#dc2626',
  },

  // Transaction Details
  transactionDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  // Status-specific containers
  pendingContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  pendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  pendingText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },

  successContainer: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  successText: {
    fontSize: 14,
    color: '#065f46',
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 12,
    color: '#047857',
    fontStyle: 'italic',
  },

  failedContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  failedText: {
    fontSize: 14,
    color: '#991b1b',
    fontWeight: '600',
    marginBottom: 4,
  },
  errorMessageText: {
    fontSize: 12,
    color: '#b91c1c',
    fontStyle: 'italic',
  },

  // Empty and Loading States
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
});
