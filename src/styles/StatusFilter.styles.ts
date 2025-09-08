import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

export const createStatusFilterStyles = (
  theme: Theme, 
  isTablet: boolean = false, 
  isDesktop: boolean = false
) => StyleSheet.create({
  filterContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: isTablet ? 20 : 16,
  },
  filterScrollContent: {
    paddingHorizontal: isTablet ? 24 : 20,
    gap: isTablet ? 16 : 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 8,
    borderRadius: isTablet ? 24 : 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: isTablet ? 12 : 8,
    minWidth: isTablet ? 120 : 100,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
    borderColor: theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a',
  },
  filterButtonText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterButtonTextActive: {
    color: theme.colors.surface,
  },
  filterBadge: {
    backgroundColor: theme.colors.border,
    paddingHorizontal: isTablet ? 8 : 6,
    paddingVertical: isTablet ? 4 : 2,
    borderRadius: isTablet ? 12 : 10,
    minWidth: isTablet ? 24 : 20,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: theme.colors.surface,
  },
  filterBadgeText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: theme.colors.primary,
  },
});
