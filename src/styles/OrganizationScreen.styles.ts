import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

// Create styles function that accepts theme
export const createOrganizationScreenStyles = (theme: Theme) => StyleSheet.create({
  // OrganizationScreen Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 88,
  },
  
  // Content Container
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  
  // Search Container
  searchContainer: { 
    marginTop: 12, 
    marginBottom: 8 
  },
  
  // List Content
  listContent: {
    paddingBottom: 16,
  },
  
  // List Item
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  
  // Item Header
  itemHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  
  // Item Header Left
  itemHeaderLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1, 
    marginRight: 8 
  },
  
  // Item Name
  itemName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: theme.colors.textPrimary, 
    flex: 1, 
    marginLeft: 0 
  },
  
  // Item Subtitle
  itemSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 30,
  },
  
  // Selected State
  selected: {
    color: theme.colors.primary,
  },
  
  // Radio Button Outer
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.radioBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  
  // Radio Button Outer Selected
  radioOuterSelected: {
    borderColor: theme.colors.primary,
  },
  
  // Radio Button Inner
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  
  // Code Pill
  codePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.pillBg,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginLeft: 8,
    flexShrink: 0,
  },
  
  // Code Pill Selected
  codePillSelected: { 
    backgroundColor: theme.colors.pillBgSelected 
  },
  
  // Code Pill Text
  codePillText: { 
    color: theme.colors.pillText, 
    fontSize: 12, 
    fontWeight: '600' 
  },
  
  // Code Pill Text Selected
  codePillTextSelected: { 
    color: theme.colors.pillTextSelected 
  },

  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  
  // Empty State Text
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  
  // Empty State Subtext
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
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
