import React, { useState, useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Animated
} from 'react-native';
import { VectorIcon, AppHeader, HeaderButton } from '../components';
import { useAuth } from '../context/AuthContext';
import { useTheme, useThemeContext } from '../context/ThemeContext';
import { createSettingsScreenStyles } from '../styles/SettingsScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseOperations } from '../hooks/useDatabaseOperations';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const { toggleTheme, themeMode } = useThemeContext();
  const navigation = useNavigation();
  const { clearDatabaseWithSync, isClearing, isSyncing } = useDatabaseOperations();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  const isLargeDesktop = screenWidth > 1440;
  
  const styles = createSettingsScreenStyles(theme);
  
  // Responsive icon sizes
  const iconSize = isLargeDesktop ? 28 : isDesktop ? 24 : isTablet ? 22 : 20;
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // Animation effect
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogout = useCallback((): void => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (logout) {
                await logout();
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  }, [logout, navigation]);

  const handleLogoutAndClearDB = useCallback((): void => {
    if (isClearing || isSyncing) {
      Alert.alert('Please wait', 'Database is being processed. Please wait...');
      return;
    }

    Alert.alert(
      'Logout & Clear Database',
      'Are you sure you want to logout and clear all local data? This will sync any pending transactions first, then clear the database. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout & Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear database with sync first
              await clearDatabaseWithSync();
              // Then logout
              if (logout) {
                await logout();
              }
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            } catch (error) {
              console.error('Logout & Clear DB error:', error);
              Alert.alert('Error', 'Failed to logout and clear data. Please try again.');
            }
          },
        },
      ]
    );
  }, [isClearing, isSyncing, clearDatabaseWithSync, logout, navigation]);

  const handleLanguageChange = useCallback((): void => {
    setShowLanguageDropdown(true);
  }, []);

  const handleLanguageSelect = useCallback((language: string) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  }, []);

  const handleInvOrgPress = useCallback((): void => {
    navigation.navigate('Organization' as never);
  }, [navigation]);

  const renderSettingItem = useCallback((
    icon: string,
    title: string,
    rightElement?: React.ReactNode,
    onPress?: () => void,
    showDivider: boolean = true,
    isDestructive: boolean = false,
    accessibilityLabel?: string
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, !showDivider && styles.lastSettingItem]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={onPress ? 'Double tap to activate' : undefined}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <VectorIcon
            name={icon}
            size={iconSize}
            color={isDestructive ? (theme.colors.error || "#ef4444") : theme.colors.textSecondary}
            iconSet="MaterialIcons"
          />
        </View>
        <Text style={[styles.settingTitle, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  ), [iconSize, theme.colors, styles]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <AppHeader
        title="Settings"
        leftElement={
          <HeaderButton
            icon="back"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        bounces={true}
        alwaysBounceVertical={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <VectorIcon
                name="person"
                size={isLargeDesktop ? 56 : isDesktop ? 48 : isTablet ? 44 : 40}
                color="#ffffff"
                iconSet="MaterialIcons"
              />
            </View>
            <Text style={styles.profileName}>
              {user?.FULL_NAME || 'John, Mr. Smith'}
            </Text>
          </View>

          {/* Settings List */}
          <View style={styles.settingsCard}>
            {/* Theme */}
            {renderSettingItem(
              'brightness-6',
              'Theme',
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ 
                  false: theme.colors.border, 
                  true: theme.colors.primary 
                }}
                thumbColor={themeMode === 'dark' ? '#ffffff' : '#f4f3f4'}
                accessibilityLabel="Toggle dark mode"
              />,
              undefined,
              true,
              false,
              'Toggle theme between light and dark mode'
            )}

            {/* Inventory Org */}
            {renderSettingItem(
              'business',
              'Inventory Org',
              <VectorIcon
                name="chevron-right"
                size={iconSize}
                color={theme.colors.textSecondary}
                iconSet="MaterialIcons"
              />,
              handleInvOrgPress,
              true,
              false,
              'Navigate to organization selection'
            )}

            {/* Language */}
            {renderSettingItem(
              'language',
              'Language',
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{selectedLanguage}</Text>
                <VectorIcon
                  name="keyboard-arrow-down"
                  size={iconSize}
                  color={theme.colors.textSecondary}
                  iconSet="MaterialIcons"
                />
              </View>,
              handleLanguageChange,
              true,
              false,
              'Select language preference'
            )}

            {/* About */}
            {renderSettingItem(
              'info',
              'About',
              <VectorIcon
                name="chevron-right"
                size={iconSize}
                color={theme.colors.textSecondary}
                iconSet="MaterialIcons"
              />,
              () => {
                // Handle about navigation
                Alert.alert('About', 'App Version 1.0.0\nBuild 2024.01.15');
              },
              true,
              false,
              'View app information and version'
            )}

            {/* Logout */}
            {renderSettingItem(
              'exit-to-app',
              'Logout',
              undefined,
              handleLogout,
              true,
              true,
              'Sign out of the application'
            )}

            {/* Logout + Clear Data */}
            {renderSettingItem(
              'exit-to-app',
              'Logout + Clear Data',
              undefined,
              handleLogoutAndClearDB,
              false,
              true,
              'Sign out and clear all local data'
            )}
          </View>

          {/* Version Info */}
          <Text style={styles.versionText}>Version - MSCA2025A-V1.1.0</Text>
        </Animated.View>
      </ScrollView>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageDropdown(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
          accessibilityRole="button"
          accessibilityLabel="Close language selection"
        >
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Select Language</Text>
            {['English', 'Spanish', 'French'].map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.dropdownItem,
                  selectedLanguage === language && styles.dropdownItemSelected
                ]}
                onPress={() => handleLanguageSelect(language)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${language} language`}
                accessibilityState={{ selected: selectedLanguage === language }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedLanguage === language && styles.dropdownItemTextSelected
                ]}>
                  {language}
                </Text>
                {selectedLanguage === language && (
                  <VectorIcon
                    name="check"
                    size={iconSize}
                    color={theme.colors.primary}
                    iconSet="MaterialIcons"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
