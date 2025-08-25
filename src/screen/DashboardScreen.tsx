import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Dashboard</Text>
        <Text style={styles.subtitle}>
          Use the bottom navigation to explore different sections
        </Text>
        <Text style={styles.userInfo}>
          Logged in as: {user?.name || 'User'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  userInfo: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default DashboardScreen;
