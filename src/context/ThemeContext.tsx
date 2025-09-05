import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    buttonBg: '#1e3a8a',
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
    background: '#121212', // Professional dark gray background
    textPrimary: '#FFFFFF', // Pure white for primary text
    textSecondary: '#9E9E9E', // Light gray for secondary/placeholder text
    text: '#FFFFFF', // Pure white for main text
    textTertiary: '#9E9E9E', // Light gray for tertiary text
    primary: '#1976D2', // Material Blue for consistency
    border: '#3A3A3A', // Subtle dark gray borders
    separator: '#3A3A3A', // Subtle dark gray separators
    pillBg: '#2A2A2A', // Card/input field background
    pillBgSelected: '#3A3A3A', // Selected state background
    pillText: '#FFFFFF', // White text for pills
    pillTextSelected: '#1976D2', // Blue text for selected pills
    buttonBg: '#1976D2', // Material Blue for buttons
    buttonText: '#FFFFFF', // White text on buttons
    radioBorder: '#9E9E9E', // Light gray for radio borders
    surface: '#2A2A2A', // Card/input field background
    shadow: '#000000', // Black shadow
    error: '#FF5252', // Material red for errors
    white: '#FFFFFF', // Pure white
    success: '#4CAF50', // Green for success
  },
};

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeMode: 'system',
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const theme = useMemo(() => {
    if (!isLoaded) return lightTheme; // Default to light theme while loading
    
    if (themeMode === 'system') {
      return systemScheme === 'dark' ? darkTheme : lightTheme;
    }
    
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemScheme, isLoaded]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): Theme {
  const context = useContext(ThemeContext);
  return context.theme;
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}

// Helper function to get current theme mode
export function useThemeMode(): 'light' | 'dark' {
  const { themeMode } = useThemeContext();
  const scheme = useColorScheme();
  
  if (themeMode === 'system') {
    return scheme === 'dark' ? 'dark' : 'light';
  }
  
  return themeMode === 'dark' ? 'dark' : 'light';
}


