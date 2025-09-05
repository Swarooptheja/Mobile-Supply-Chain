import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { getButtonColor } from './global.styles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions for responsive sizing
const scale = (size: number) => (size * screenWidth) / 375;
const verticalScale = (size: number) => (size * screenHeight) / 812;
const moderateScale = (size: number, factor: number = 0.5) => size + (scale(size) - size) * factor;

// Device size detection
const isSmallDevice = screenWidth <= 375;
const isTablet = screenWidth > 768;

// Create styles function that accepts theme
export const createLoginScreenStyles = (theme: Theme) => StyleSheet.create({
  // LoginScreen Container
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Keyboard Avoiding View
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: verticalScale(20), // Move content up from center
    paddingBottom: verticalScale(80), // Reduced space for fixed logo
  },
  
  // Content Container - Responsive padding and spacing
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: verticalScale(5), // Reduced top padding to move form up
    paddingBottom: verticalScale(15),
    paddingHorizontal: scale(20),
  },
  
  // Login Card - Responsive sizing and positioning
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: scale(12),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(24),
    width: isTablet ? Math.min(screenWidth * 0.6, 500) : screenWidth * 0.9,
    maxWidth: isTablet ? 500 : 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: verticalScale(10), // Further reduced margin for better spacing
    // Responsive margins for different screen sizes
    marginHorizontal: isSmallDevice ? scale(16) : scale(20),
  },
  
  cardTitle: {
    fontSize: moderateScale(24), // Slightly larger as requested
    fontWeight: '700', // Bold as requested
    color: theme.colors.textPrimary, // White text
    textAlign: 'center',
    marginBottom: verticalScale(20), // Further reduced margin for better visual separation
  },
  
  // Input Container - Responsive spacing
  inputContainer: {
    marginBottom: verticalScale(12), // Further reduced spacing between inputs
  },
  
  inputLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: theme.colors.textPrimary, // White text as requested
    marginBottom: verticalScale(10), // Slightly increased for better readability
  },
  
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, // Use surface color for better contrast
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: scale(8),
    paddingHorizontal: scale(12), // Increased horizontal padding for better spacing
    paddingVertical: verticalScale(12), // Increased vertical padding for better touch target
    minHeight: verticalScale(48), // Increased height for better proportions
    // Ensure consistent appearance for both username and password fields
    justifyContent: 'space-between',
  },
  
  input: {
    flex: 1,
    fontSize: moderateScale(14),
    color: theme.colors.textPrimary, // White text as requested
    paddingVertical: verticalScale(2),
    fontWeight: '400',
    // Ensure consistent text input styling
    minHeight: verticalScale(18),
    textAlignVertical: 'center',
  },
  
  inputIcon: {
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(4),
    minWidth: scale(32),
    minHeight: verticalScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure the icon doesn't affect input field layout
    marginRight: scale(8),
    opacity: 0.7, // 70% opacity as recommended
  },

  eyeIcon: {
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(4),
    minWidth: scale(32),
    minHeight: verticalScale(32),
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure the eye icon doesn't affect input field layout
    marginLeft: scale(8),
    opacity: 0.7, // 70% opacity as recommended
  },
  
  errorText: {
    color: theme.colors.error, // Use theme error color for consistency
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
    marginLeft: scale(4),
    fontWeight: '500',
  },
  
  // Login Button - Global button color
  loginButton: {
    marginTop: verticalScale(32), // Increased margin for better spacing
    height: verticalScale(48), // Increased height for better proportions
    minHeight: verticalScale(44), // Ensure touch target is large enough
    borderRadius: scale(8), // Rounded corners for modern look
    backgroundColor: getButtonColor(), // Global button color
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },

  loginButtonText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#FFFFFF', // White text for good contrast with orange background
  },

  // Theme Toggle Button
  themeToggleButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(40),
    minHeight: scale(40),
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // Android shadow
  },
  
  // Bottom Section - Fixed positioning
  bottom: {
    position: 'absolute',
    bottom: verticalScale(60), // Moved up from 20 to 40
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: scale(20),
    flexDirection: 'row',
  },
  
  // Company Section
  company: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoImage: {
    width: isTablet ? scale(280) : scale(220),
    height: isTablet ? scale(280) : scale(220),
    marginBottom: verticalScale(10), // Increased margin for better spacing
    alignSelf: 'center', // Ensure logo is centered
    // Ensure logo doesn't get too large on very small screens
    maxWidth: Math.min(screenWidth * 0.5, 280),
    maxHeight: Math.min(screenHeight * 0.3, 280),
  },
  
  brand: {
    alignItems: 'flex-start',
  },
  
  brandText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(3),
  },
  
  brandPrimary: {
    color: theme.colors.textPrimary,
  },
  
  brandSecondary: {
    color: theme.colors.textSecondary,
  },
  
  tagline: {
    fontSize: moderateScale(12),
    color: '#FF8C00',
    fontWeight: '600',
  },
  
  // Version Text
  version: {
    fontSize: moderateScale(12),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: verticalScale(30),
    fontWeight: '500',
  },



  // Small device adjustments
  smallDeviceCard: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
    marginHorizontal: scale(8),
  },

  smallDeviceTitle: {
    fontSize: moderateScale(20),
    marginBottom: verticalScale(16),
  },

  // Tablet adjustments
  tabletCard: {
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(32),
    marginHorizontal: scale(40),
  },

  tabletTitle: {
    fontSize: moderateScale(28),
    marginBottom: verticalScale(32),
  },
});

// Default styles for when theme is not available
export const defaultLoginScreenStyles = createLoginScreenStyles({
  colors: {
    background: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    text: '#1f2937',
    textTertiary: '#9ca3af',
    primary: '#1e3a8a',
    border: '#e5e7eb',
    separator: '#e5e7eb',
    pillBg: '#f3f4f6',
    pillBgSelected: '#dbeafe',
    pillText: '#374151',
    pillTextSelected: '#1d4ed8',
    buttonBg: '#1e3a8a',
    buttonText: '#ffffff',
    radioBorder: '#9ca3af',
    surface: '#f9fafb',
    shadow: '#000000',
    error: '#dc2626',
    white: '#ffffff',
    success: '#059669',
  },
});
