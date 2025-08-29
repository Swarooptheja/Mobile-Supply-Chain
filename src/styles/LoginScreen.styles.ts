import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

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
  },
  
  // Content Container - Using same background approach as OrganizationScreen
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 25,
    paddingBottom: 25,
  },
  
  // Login Card
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: width * 0.9,
    maxWidth: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  
  // Input Container
  inputContainer: {
    marginBottom: 18,
  },
  
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textPrimary,
    paddingVertical: 2,
    fontWeight: '500',
  },
  
  eyeIcon: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  
  // Login Button
  loginButton: {
    marginTop: 20,
    height: 48,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Bottom Section
  bottom: {
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  // Company Section
  company: {
    alignItems: 'center',
  },
  
  logo: {
    alignItems: 'center',
  },
  
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  
  brand: {
    alignItems: 'flex-start',
  },
  
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  
  brandPrimary: {
    color: theme.colors.textPrimary,
  },
  
  brandSecondary: {
    color: theme.colors.textSecondary,
  },
  
  tagline: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '600',
  },
  
  // Version Text
  version: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
});

// Default styles for when theme is not available
export const defaultLoginScreenStyles = createLoginScreenStyles({
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
