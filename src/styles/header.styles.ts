import { StyleSheet } from 'react-native';

// Header-specific styles for consistent theming across all screens
export const headerStyles = StyleSheet.create({
  // Header container styles
  headerContainer: {
    backgroundColor: '#1e3a8a', // Dark blue color for consistency across all screens
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  // Header icon button styles
  headerIconButton: {
    backgroundColor: 'transparent', // Transparent background for better header consistency
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle white border
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Header icon button pressed state
  headerIconButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle highlight when pressed
  },

  // Header icon button hover state (for web)
  headerIconButtonHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Very subtle highlight on hover
  },

  // Header title styles
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Header content layout
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    minHeight: 56,
  },

  // Header button containers
  headerButtonContainer: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },

  // Header title container
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  // Sync Activity specific header styles
  syncActivityHeader: {
    backgroundColor: '#3B82F6', // Blue theme for Sync Activity
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  // Sync Activity header title
  syncActivityTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});

// Header color constants for consistent theming
export const headerColors = {
  primary: '#1e3a8a', // Main header background
  syncActivity: '#3B82F6', // Blue theme for Sync Activity
  text: '#ffffff', // Header text color
  icon: '#ffffff', // Header icon color
  border: 'rgba(255, 255, 255, 0.2)', // Header button border
  pressed: 'rgba(255, 255, 255, 0.1)', // Button pressed state
  hover: 'rgba(255, 255, 255, 0.05)', // Button hover state
  shadow: 'rgba(0, 0, 0, 0.15)', // Header shadow
} as const;

// Header spacing constants
export const headerSpacing = {
  horizontal: 16,
  vertical: 12,
  buttonSize: 44,
  iconSize: 24,
  borderRadius: 8,
} as const;

