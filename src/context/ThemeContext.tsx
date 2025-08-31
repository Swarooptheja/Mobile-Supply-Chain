import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = {
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    text: string;
    textTertiary: string;
    primary: string;
    border: string;
    separator: string;
    pillBg: string;
    pillBgSelected: string;
    pillText: string;
    pillTextSelected: string;
    buttonBg: string;
    buttonText: string;
    radioBorder: string;
    surface: string;
    shadow: string;
    error: string;
    white: string;
    success: string;
  };
};

const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    textPrimary: '#111827',
    textSecondary: '#6b7280',
    text: '#111827',
    textTertiary: '#9ca3af',
    primary: '#2563eb',
    border: '#E5E7EB',
    separator: '#E5E7EB',
    pillBg: '#F3F4F6',
    pillBgSelected: '#DBEAFE',
    pillText: '#374151',
    pillTextSelected: '#1D4ED8',
    buttonBg: '#2563eb',
    buttonText: '#ffffff',
    radioBorder: '#9CA3AF',
    surface: '#f9fafb',
    shadow: '#000000',
    error: '#dc2626',
    white: '#ffffff',
    success: '#059669',
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#0b0f1a',
    textPrimary: '#e5e7eb',
    textSecondary: '#9ca3af',
    text: '#e5e7eb',
    textTertiary: '#6b7280',
    primary: '#60a5fa',
    border: '#374151',
    separator: '#1f2937',
    pillBg: '#111827',
    pillBgSelected: '#1f2937',
    pillText: '#e5e7eb',
    pillTextSelected: '#93c5fd',
    buttonBg: '#3b82f6',
    buttonText: '#f9fafb',
    radioBorder: '#6b7280',
    surface: '#1f2937',
    shadow: '#000000',
    error: '#ef4444',
    white: '#ffffff',
    success: '#10b981',
  },
};

const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme();
  const theme = useMemo(() => (scheme === 'dark' ? darkTheme : lightTheme), [scheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

// Helper function to get current theme mode
export function useThemeMode(): 'light' | 'dark' {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

// Helper function to toggle theme manually (if needed)
export function useThemeToggle() {
  const currentScheme = useColorScheme();
  
  const toggleTheme = () => {
    // This would need to be implemented with a custom theme state
    // since useColorScheme is read-only
    console.log('Theme toggle not implemented - useColorScheme is read-only');
  };
  
  return { currentScheme, toggleTheme };
}


