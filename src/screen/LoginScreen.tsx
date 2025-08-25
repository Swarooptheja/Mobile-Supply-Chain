import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: username.trim(), password });
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.appTitle}>Mobile Supply Chain</Text>
        </View>

        {/* Login Form Section */}
        <View style={styles.formSection}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👥</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            <View style={styles.separator} />

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.eyeIconText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>

        {/* Footer Section with Background Image - Fixed Position */}
        <View style={styles.footerSection}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }}
            style={styles.backgroundImage}
            imageStyle={styles.backgroundImageStyle}
          >
            <View style={styles.brandContainer}>
              <Text style={styles.logoIcon}>≫≫≫</Text>
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandText}>
                  <Text style={styles.brandPrimary}>Propel</Text>
                  <Text style={styles.brandSecondary}> Apps</Text>
                </Text>
                <Text style={styles.tagline}>Transform Tomorrow. Today.</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: height * 0.06,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Form Section - Adjusted to be above footer
  formSection: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: height * 0.3, // Add bottom padding to avoid footer overlap
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10, // Ensure inputs are above background
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 16,
    color: '#6B7280',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 8,
    fontWeight: '400',
  },
  eyeIcon: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  eyeIconText: {
    fontSize: 18,
    color: '#6B7280',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },

  // Login Button
  loginButton: {
    backgroundColor: '#20B2AA', // Teal color like in the image
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    zIndex: 10, // Ensure button is above background
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Offline Mode Notice
  offlineNotice: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  offlineText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Footer Section - Fixed Position
  footerSection: {
    height: height * 0.25,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    opacity: 0.3,
    resizeMode: 'cover',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  logoIcon: {
    fontSize: 24,
    color: '#FF8C00', // Orange color like in the image
    marginRight: 12,
  },
  brandTextContainer: {
    alignItems: 'flex-start',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  brandPrimary: {
    color: '#1F2937',
  },
  brandSecondary: {
    color: '#6B7280',
  },
  tagline: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default LoginScreen;
