/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context';
import AppNavigator from './src/navigation/AppNavigator';
import SimpleDatabaseInitializer from './src/components/SimpleDatabaseInitializer';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  const handleDatabaseInitialization = (success: boolean) => {
    console.log('Database initialization completed:', success);
    setIsDatabaseReady(true);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SimpleDatabaseInitializer onInitializationComplete={handleDatabaseInitialization}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SimpleDatabaseInitializer>
    </SafeAreaProvider>
  );
}

export default App;
