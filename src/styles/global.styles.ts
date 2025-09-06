import { StyleSheet } from 'react-native';
import { Theme } from '../context/ThemeContext';

// Global theme-aware styles
export const createGlobalStyles = (theme: Theme) => StyleSheet.create({
  // Layout utilities
  flex: {
    flex: 1,
  },
  
  flexRow: {
    flexDirection: 'row',
  },
  
  flexCol: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  centerHorizontal: {
    alignItems: 'center',
  },
  
  centerVertical: {
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  flexEnd: {
    justifyContent: 'flex-end',
  },
  
  selfCenter: {
    alignSelf: 'center',
  },
  
  selfStart: {
    alignSelf: 'flex-start',
  },
  
  selfEnd: {
    alignSelf: 'flex-end',
  },
  
  // Spacing utilities
  padding: {
    padding: 16,
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
  
  paddingTop: {
    paddingTop: 16,
  },
  
  paddingBottom: {
    paddingBottom: 16,
  },
  
  paddingLeft: {
    paddingLeft: 16,
  },
  
  paddingRight: {
    paddingRight: 16,
  },
  
  margin: {
    margin: 16,
  },
  
  marginHorizontal: {
    marginHorizontal: 16,
  },
  
  marginVertical: {
    marginVertical: 16,
  },
  
  marginTop: {
    marginTop: 16,
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  marginLeft: {
    marginLeft: 16,
  },
  
  marginRight: {
    marginRight: 16,
  },
  
  // Text utilities
  textCenter: {
    textAlign: 'center',
  },
  
  textLeft: {
    textAlign: 'left',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // Common component styles
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  
  // Responsive utilities
  fullWidth: {
    width: '100%',
  },
  
  fullHeight: {
    height: '100%',
  },
  
  // Shadow utilities
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Border utilities
  rounded: {
    borderRadius: 8,
  },
  
  roundedLarge: {
    borderRadius: 12,
  },
  
  roundedFull: {
    borderRadius: 9999,
  },
  
  // Opacity utilities
  opacity50: {
    opacity: 0.5,
  },
  
  opacity75: {
    opacity: 0.75,
  },
  
  // Position utilities
  absolute: {
    position: 'absolute',
  },
  
  relative: {
    position: 'relative',
  },
  
  // Z-index utilities
  z10: {
    zIndex: 10,
  },
  
  z20: {
    zIndex: 20,
  },
  
  z50: {
    zIndex: 50,
  },
});

// Default global styles
export const defaultGlobalStyles = createGlobalStyles({
  colors: {
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    text: '#1f2937',
    textTertiary: '#9ca3af',
    primary: '#1e3a8a',
    border: '#e5e7eb',
    separator: '#e5e7eb',
    surface: '#ffffff',
    shadow: '#000000',
    pillBg: '#f3f4f6',
    pillBgSelected: '#dbeafe',
    pillText: '#374151',
    pillTextSelected: '#1d4ed8',
    buttonBg: '#2563eb',
    buttonText: '#ffffff',
    radioBorder: '#9ca3af',
    success: '#059669',
    error: '#dc2626',
    white: '#ffffff',
  },
});

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// Common border radius values
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
} as const;

// Common font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// Common font weights
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Global Color Constants
export const COLORS = {
  // Primary Brand Colors
  PRIMARY: '#1e3a8a', // Header blue color
  ORANGE: '#FF7032', // Orange color for buttons and highlights
  
  // Text Colors
  TEXT_PRIMARY: '#212121', // Main text color
  TEXT_SECONDARY: '#757575', // Secondary text color
  TEXT_WHITE: '#FFFFFF', // White text
  
  // Background Colors
  BACKGROUND_LIGHT: '#FAFAFA', // Light theme background
  BACKGROUND_DARK: '#121212', // Dark theme background
  SURFACE_LIGHT: '#FFFFFF', // Light surface color
  SURFACE_DARK: '#2A2A2A', // Dark surface color
  
  // Border Colors
  BORDER_LIGHT: '#E0E0E0', // Light theme border
  BORDER_DARK: '#3A3A3A', // Dark theme border
  
  // Status Colors
  SUCCESS: '#059669', // Success green
  ERROR: '#dc2626', // Error red
  WARNING: '#F59E0B', // Warning yellow
  
  // Shadow Colors
  SHADOW: '#000000', // Shadow color
  
  // Pill/Badge Colors
  PILL_BG_LIGHT: '#F3F4F6', // Light theme pill background
  PILL_BG_DARK: '#2A2A2A', // Dark theme pill background
  PILL_BG_SELECTED_LIGHT: '#DBEAFE', // Light theme selected pill background
  PILL_BG_SELECTED_DARK: '#3A3A3A', // Dark theme selected pill background
  PILL_TEXT_LIGHT: '#374151', // Light theme pill text
  PILL_TEXT_DARK: '#FFFFFF', // Dark theme pill text
  
  // Radio Button Colors
  RADIO_BORDER_LIGHT: '#9CA3AF', // Light theme radio border
  RADIO_BORDER_DARK: '#9E9E9E', // Dark theme radio border
} as const;

/**
 * Theme-aware color helper functions
 * These functions return the appropriate color based on the current theme
 */
export const getThemeColors = (isDark: boolean) => ({
  // Primary colors
  primary: COLORS.PRIMARY,
  orange: COLORS.ORANGE,
  
  // Text colors
  textPrimary: isDark ? COLORS.TEXT_WHITE : COLORS.TEXT_PRIMARY,
  textSecondary: isDark ? '#B0B0B0' : COLORS.TEXT_SECONDARY,
  textWhite: COLORS.TEXT_WHITE,
  
  // Background colors
  background: isDark ? COLORS.BACKGROUND_DARK : COLORS.BACKGROUND_LIGHT,
  surface: isDark ? COLORS.SURFACE_DARK : COLORS.SURFACE_LIGHT,
  
  // Border colors
  border: isDark ? COLORS.BORDER_DARK : COLORS.BORDER_LIGHT,
  
  // Pill colors
  pillBg: isDark ? COLORS.PILL_BG_DARK : COLORS.PILL_BG_LIGHT,
  pillBgSelected: isDark ? COLORS.PILL_BG_SELECTED_DARK : COLORS.PILL_BG_SELECTED_LIGHT,
  pillText: isDark ? COLORS.PILL_TEXT_DARK : COLORS.PILL_TEXT_LIGHT,
  
  // Radio button colors
  radioBorder: isDark ? COLORS.RADIO_BORDER_DARK : COLORS.RADIO_BORDER_LIGHT,
  
  // Status colors
  success: COLORS.SUCCESS,
  error: COLORS.ERROR,
  warning: COLORS.WARNING,
  
  // Shadow
  shadow: COLORS.SHADOW,
});

/**
 * Selection colors based on theme
 * Returns orange for dark theme, primary blue for light theme
 */
export const getSelectionColor = (isDark: boolean) => 
  isDark ? COLORS.ORANGE : COLORS.PRIMARY;

/**
 * Button colors based on theme
 * Returns orange for both themes (as per current design)
 */
export const getButtonColor = () => COLORS.ORANGE;

/**
 * Header colors
 * Returns primary blue for both themes
 */
export const getHeaderColor = () => COLORS.PRIMARY;
