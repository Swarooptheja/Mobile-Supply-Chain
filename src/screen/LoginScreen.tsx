import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import VectorIcon from '../components/VectorIcon';
import { ENV } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAttractiveNotifications } from '../hooks';
import { ILoginForm } from '../interfaces';
import { createLoginScreenStyles } from '../styles/LoginScreen.styles';

// Validation schema
const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showErrorNotification, showValidationError } = useAttractiveNotifications();
  const theme = useTheme();
  const styles = createLoginScreenStyles(theme);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
  } = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
  });


  const handleLogin = async (data: ILoginForm): Promise<void> => {
    if (!data.username?.trim() || !data.password?.trim()) {
      showValidationError('all required');
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: data.username.trim(), password: data.password });
      // Navigation will happen automatically based on authentication state
    } catch (error) {
      // Show attractive error notification
      if (error instanceof Error) {
        showErrorNotification('Login Failed', error.message);
      } else {
        showErrorNotification('Login Failed', 'An unexpected error occurred. Please try again.');
      }
      console.error('Login error in LoginScreen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Header Section - Using AppHeader for consistency */}
      <AppHeader title={ENV.APP_NAME} />

      {/* Content Area */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {/* White Card with Login Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Login</Text>
            
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter username"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setValue('username', text)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  {...register('username')}
                />
              </View>
              {errors.username && (
                <Text style={styles.errorText}>{errors.username.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputField}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={(text) => setValue('password', text)}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                  selectionColor={theme.colors.primary}
                  {...register('password')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <VectorIcon 
                    name={showPassword ? "visibility" : "visibility-off"} 
                    size={20} 
                    color="#6B7280" 
                    iconSet="MaterialIcons" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Login Button */}
            <Button
              title="LOGIN"
              onPress={handleSubmit(handleLogin)}
              loading={isLoading}
              disabled={isLoading}
              size="lg"
              variant="solid"
              fullWidth
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>

          {/* Bottom Section - Always Visible */}
          <View style={styles.bottom}>
            {/* Company Logo and Tagline */}
            <View style={styles.company}>
              <View style={styles.logo}>
                {/* Company Logo - Using actual propel.logo.png image */}
                <Image
                  source={require('../assets/images/propel.logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

