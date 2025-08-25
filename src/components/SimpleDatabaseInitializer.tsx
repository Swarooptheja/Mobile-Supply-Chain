import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { simpleDatabaseService } from '../services/simpleDatabase';

const { height } = Dimensions.get('window');

interface ISimpleDatabaseInitializerProps {
  children: React.ReactNode;
  onInitializationComplete: (success: boolean) => void;
}

const SimpleDatabaseInitializer: React.FC<ISimpleDatabaseInitializerProps> = ({ 
  children, 
  onInitializationComplete 
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationStep, setInitializationStep] = useState('');

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsInitializing(true);
      setInitializationStep('Initializing SQLite database...');
      
      console.log('Starting database initialization...');
      
      const success = await simpleDatabaseService.init();
      
      if (success) {
        console.log('Database initialized successfully');
        setInitializationStep('Database ready!');
        
        // Small delay to show completion message
        setTimeout(() => {
          setIsInitializing(false);
          onInitializationComplete(true);
        }, 500);
        
      } else {
        console.error('Database initialization failed');
        setInitializationStep('Database initialization failed');
        
        // Small delay to show error message
        setTimeout(() => {
          setIsInitializing(false);
          onInitializationComplete(false);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Database initialization error:', error);
      setInitializationStep('Database initialization error');
      
      // Small delay to show error message
      setTimeout(() => {
        setIsInitializing(false);
        onInitializationComplete(false);
      }, 1000);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {/* App Logo/Title */}
          <View style={styles.headerSection}>
            <Text style={styles.appTitle}>React Native App</Text>
            <Text style={styles.appSubtitle}>SQLite Database</Text>
          </View>

          {/* Loading Section */}
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{initializationStep}</Text>
          </View>

          {/* Progress Info */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              Setting up your database...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.1,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },

  // Loading Section
  loadingSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginTop: 20,
  },

  // Progress Section
  progressSection: {
    alignItems: 'center',
    paddingBottom: height * 0.1,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SimpleDatabaseInitializer;
