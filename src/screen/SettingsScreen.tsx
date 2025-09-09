import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View
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
  
  const styles = createSettingsScreenStyles(theme);
  
  // Responsive icon sizes
  const iconSize = isDesktop ? 24 : isTablet ? 22 : 20;

  const handleLogout = (): void => {
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
  };

  const handleLogoutAndClearDB = (): void => {
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
  };

  const handleLanguageChange = (): void => {
    setShowLanguageDropdown(true);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
  };

  const handleInvOrgPress = (): void => {
    navigation.navigate('Organization' as never);
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    rightElement?: React.ReactNode,
    onPress?: () => void,
    showDivider: boolean = true
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, !showDivider && styles.lastSettingItem]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <VectorIcon
            name={icon}
            size={iconSize}
            color={theme.colors.textPrimary}
            iconSet="MaterialIcons"
          />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

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

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitials}>
            {user?.FULL_NAME?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JS'}
          </Text>
        </View>
        <Text style={styles.profileName}>
          {user?.FULL_NAME || 'John, Mr. Smith'}
        </Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsCard}>
        <Text style={styles.settingsTitle}>Settings</Text>
        
        {/* Dark Mode */}
        {renderSettingItem(
          'dark-mode',
          'Dark Mode',
          <Switch
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#e9ecef', true: theme.colors.primary }}
            thumbColor={themeMode === 'dark' ? '#ffffff' : '#f4f3f4'}
          />
        )}

        {/* Inv Org Switch */}
        {renderSettingItem(
          'business',
          'Inv Org',
          <VectorIcon
            name="chevron-right"
            size={iconSize}
            color={theme.colors.textSecondary}
            iconSet="MaterialIcons"
          />,
          handleInvOrgPress
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
          handleLanguageChange
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
          false
        )}
      </View>

      {/* Logout Buttons */}
      <View style={styles.logoutButtonsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <VectorIcon
            name="exit-to-app"
            size={iconSize}
            color={theme.colors.white}
            iconSet="MaterialIcons"
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.clearDbButton, (isClearing || isSyncing) && styles.disabledButton]} 
          onPress={handleLogoutAndClearDB}
          disabled={isClearing || isSyncing}
        >
          <VectorIcon
            name={(isClearing || isSyncing) ? "hourglass-empty" : "delete-forever"}
            size={iconSize}
            color={theme.colors.white}
            iconSet="MaterialIcons"
          />
          <Text style={styles.clearDbButtonText}>
            {isSyncing ? 'Syncing...' : isClearing ? 'Clearing...' : 'Logout + ClearDB'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Version Info */}
      <Text style={styles.versionText}>Version - LoadToDock.V1.25C</Text>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageDropdown(false)}
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
