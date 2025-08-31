import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createActivityCardStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  statusIcon: {
    fontSize: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.primary,
    backgroundColor: theme.colors.pillBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.pillBg,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  recordsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.colors.pillBg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordsLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  recordsValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  failedRecords: {
    color: theme.colors.primary,
  },
  retryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.pillBg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  retryButtonText: {
    color: theme.colors.buttonText,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  retryCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  expandedContent: {
    padding: 20,
    backgroundColor: theme.colors.pillBg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    backgroundColor: theme.colors.pillBg,
    padding: 12,
    borderRadius: 8,
  },
  timingContainer: {
    marginBottom: 16,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timingLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  timingValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  retryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  retryInfoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  retryInfoValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  // Status-based border colors
  successColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  errorColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  failureColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  processingColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  blockedColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.textSecondary,
  },
  pendingColor: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.border,
  },
});
