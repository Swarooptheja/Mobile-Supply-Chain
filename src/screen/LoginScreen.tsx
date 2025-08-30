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
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import VectorIcon from '../components/VectorIcon';
import { ENV } from '../config/env';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAttractiveNotification } from '../context/AttractiveNotificationContext';
import { ILoginForm } from '../interfaces';
import { createLoginScreenStyles } from '../styles/LoginScreen.styles';
import type { RootStackParamList } from '../navigation/AppNavigator';

// Validation schema
const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showWarning } = useAttractiveNotification();
  const theme = useTheme();
  const styles = createLoginScreenStyles(theme);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Login'>>();

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
      showWarning('Validation Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Pass a callback that will be called after successful login and notification
      await login({ username: data.username.trim(), password: data.password }, () => {
        // This callback will be executed after the success notification is shown
        // Now navigate to the Organization screen
        navigation.navigate('Organization');
      });
    } catch (error) {
      // Show attractive error notification
      if (error instanceof Error) {
        showError('Login Failed', error.message);
      } else {
        showError('Login Failed', 'An unexpected error occurred. Please try again.');
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
                  selectionColor={theme.colors.primary}
                  {...register('username')}
                />
                {/* Empty view to maintain consistent layout with password field */}
                <View style={styles.eyeIcon} />
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
                  autoCapitalize="none"
                  autoCorrect={false}
                  {...register('password')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  activeOpacity={0.7}
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

