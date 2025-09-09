import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createTransactionHistoryScreenStyles = (
  theme: Theme, 
  isTablet: boolean = false, 
  isDesktop: boolean = false
) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isTablet ? 24 : 20,
    paddingBottom: 120, // Responsive padding for bottom navigation
  },
  searchContainer: {
    paddingHorizontal: isTablet ? 32 : 20,
    paddingVertical: isTablet ? 16 : 12,
    backgroundColor: theme.colors.background,
  },
  
  // Empty and Loading States
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isTablet ? 80 : 60,
  },
  emptyTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: isTablet ? 12 : 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: isTablet ? 18 : 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: isTablet ? 28 : 24,
    paddingHorizontal: isTablet ? 40 : 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isTablet ? 80 : 60,
  },
  loadingText: {
    fontSize: isTablet ? 18 : 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});