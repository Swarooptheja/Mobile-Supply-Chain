/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, ThemeProvider } from './src/context';
import { AttractiveNotificationProvider } from './src/context/AttractiveNotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import SimpleDatabaseInitializer from './src/components/SimpleDatabaseInitializer';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [_isDatabaseReady, setIsDatabaseReady] = useState(false);

  const handleDatabaseInitialization = (success: boolean) => {
    console.log('Database initialization completed:', success);
    setIsDatabaseReady(true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ThemeProvider>
        <AttractiveNotificationProvider>
          <SimpleDatabaseInitializer onInitializationComplete={handleDatabaseInitialization}>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </SimpleDatabaseInitializer>
        </AttractiveNotificationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
