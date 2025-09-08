import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createTransactionCardStyles = (
  theme: Theme, 
  isTablet: boolean = false, 
  isDesktop: boolean = false
) => StyleSheet.create({
  transactionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    marginBottom: isTablet ? 20 : 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: theme.isDark ? 0.3 : 0.08,
    shadowRadius: isTablet ? 12 : 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderLeftWidth: isTablet ? 5 : 4,
    borderLeftColor: theme.colors.primary,
  },
  transactionCardPending: {
    borderLeftColor: theme.colors.warning,
  },
  transactionCardSuccess: {
    borderLeftColor: theme.colors.success,
  },
  transactionCardFailed: {
    borderLeftColor: theme.colors.error,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 16 : 12,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 12,
  },
  transactionId: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  transactionTimestamp: {
    fontSize: isTablet ? 14 : 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    opacity: 0.8,
  },
  statusBadge: {
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: isTablet ? 20 : 16,
    borderWidth: 1,
  },
  statusBadgePending: {
    backgroundColor: theme.colors.warningBackground,
    borderColor: theme.colors.warning,
  },
  statusBadgeSuccess: {
    backgroundColor: theme.colors.successBackground,
    borderColor: theme.colors.success,
  },
  statusBadgeFailed: {
    backgroundColor: theme.colors.errorBackground,
    borderColor: theme.colors.error,
  },
  statusText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
  },
  statusTextPending: {
    color: theme.colors.warning,
  },
  statusTextSuccess: {
    color: theme.colors.success,
  },
  statusTextFailed: {
    color: theme.colors.error,
  },

  // Transaction Details
  transactionDetails: {
    marginBottom: isTablet ? 16 : 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isTablet ? 12 : 8,
    paddingVertical: isTablet ? 4 : 2,
  },
  detailLabel: {
    fontSize: isTablet ? 16 : 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    opacity: 0.9,
  },
  detailValue: {
    fontSize: isTablet ? 16 : 14,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    letterSpacing: 0.2,
  },

  // Status-specific containers
  pendingContainer: {
    backgroundColor: theme.colors.warningBackground,
    borderRadius: isTablet ? 12 : 8,
    padding: isTablet ? 16 : 12,
  },
  pendingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? 12 : 8,
  },
  pendingDot: {
    width: isTablet ? 10 : 8,
    height: isTablet ? 10 : 8,
    borderRadius: isTablet ? 5 : 4,
    backgroundColor: theme.colors.warning,
  },
  pendingText: {
    fontSize: isTablet ? 16 : 14,
    color: theme.colors.warningText,
    fontWeight: '500',
  },

  successContainer: {
    backgroundColor: theme.colors.successBackground,
    borderRadius: isTablet ? 12 : 8,
    padding: isTablet ? 16 : 12,
  },
  successText: {
    fontSize: isTablet ? 16 : 14,
    color: theme.colors.successText,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: isTablet ? 14 : 12,
    color: theme.colors.successText,
    fontStyle: 'italic',
    opacity: 0.8,
  },

  failedContainer: {
    backgroundColor: theme.colors.errorBackground,
    borderRadius: isTablet ? 12 : 8,
    padding: isTablet ? 16 : 12,
  },
  failedText: {
    fontSize: isTablet ? 16 : 14,
    color: theme.colors.errorText,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorMessageText: {
    fontSize: isTablet ? 14 : 12,
    color: theme.colors.errorText,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
