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
import { useI18n } from '../context/I18nContext';
import { createSettingsScreenStyles } from '../styles/SettingsScreen.styles';
import { useNavigation } from '@react-navigation/native';
import { useDatabaseOperations } from '../hooks/useDatabaseOperations';
import { getAvailableLanguages, Language } from '../locales';

const SettingsScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const { toggleTheme, themeMode } = useThemeContext();
  const { language, setLanguage, t } = useI18n();
  const navigation = useNavigation();
  const { clearDatabaseWithSync, isClearing, isSyncing } = useDatabaseOperations();
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
      t('alerts.logoutTitle'),
      t('alerts.logoutMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
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
              Alert.alert(t('common.error'), t('alerts.logoutError'));
            }
          },
        },
      ]
    );
  }, [logout, navigation, t]);

  const handleLogoutAndClearDB = useCallback((): void => {
    if (isClearing || isSyncing) {
      Alert.alert(t('alerts.pleaseWait'), t('alerts.databaseProcessing'));
      return;
    }

    Alert.alert(
      t('alerts.logoutAndClearTitle'),
      t('alerts.logoutAndClearMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logoutAndClearData'),
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
              Alert.alert(t('common.error'), t('alerts.logoutAndClearError'));
            }
          },
        },
      ]
    );
  }, [isClearing, isSyncing, clearDatabaseWithSync, logout, navigation, t]);

  const handleLanguageChange = useCallback((): void => {
    setShowLanguageDropdown(true);
  }, []);

  const handleLanguageSelect = useCallback(async (languageCode: Language) => {
    try {
      await setLanguage(languageCode);
      setShowLanguageDropdown(false);
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), 'Failed to change language. Please try again.');
    }
  }, [setLanguage, t]);

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
        title={t('settings.title')}
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
              t('settings.theme'),
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ 
                  false: theme.colors.border, 
                  true: theme.colors.primary 
                }}
                thumbColor={themeMode === 'dark' ? '#ffffff' : '#f4f3f4'}
                accessibilityLabel={t('settings.toggleTheme')}
              />,
              undefined,
              true,
              false,
              t('settings.toggleTheme')
            )}

            {/* Inventory Org */}
            {renderSettingItem(
              'business',
              t('settings.inventoryOrg'),
              <VectorIcon
                name="chevron-right"
                size={iconSize}
                color={theme.colors.textSecondary}
                iconSet="MaterialIcons"
              />,
              handleInvOrgPress,
              true,
              false,
              t('settings.navigateToOrganization')
            )}

            {/* Language */}
            {renderSettingItem(
              'language',
              t('settings.language'),
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{t(`languages.${language}`)}</Text>
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
              t('settings.selectLanguagePreference')
            )}

            {/* About */}
            {renderSettingItem(
              'info',
              t('settings.about'),
              <VectorIcon
                name="chevron-right"
                size={iconSize}
                color={theme.colors.textSecondary}
                iconSet="MaterialIcons"
              />,
              () => {
                // Handle about navigation
                Alert.alert(t('alerts.aboutTitle'), t('alerts.aboutMessage'));
              },
              true,
              false,
              t('settings.viewAppInfo')
            )}

            {/* Logout */}
            {renderSettingItem(
              'exit-to-app',
              t('settings.logout'),
              undefined,
              handleLogout,
              true,
              true,
              t('settings.signOut')
            )}

            {/* Logout + Clear Data */}
            {renderSettingItem(
              'exit-to-app',
              t('settings.logoutAndClearData'),
              undefined,
              handleLogoutAndClearDB,
              false,
              true,
              t('settings.signOutAndClear')
            )}
          </View>

          {/* Version Info */}
          <Text style={styles.versionText}>{t('settings.version')}</Text>
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
          accessibilityLabel={t('settings.closeLanguageSelection')}
        >
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>{t('settings.selectLanguage')}</Text>
            {getAvailableLanguages().map(({ code, name }) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.dropdownItem,
                  language === code && styles.dropdownItemSelected
                ]}
                onPress={() => handleLanguageSelect(code)}
                accessibilityRole="button"
                accessibilityLabel={t('settings.selectLanguageOption', { language: name })}
                accessibilityState={{ selected: language === code }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  language === code && styles.dropdownItemTextSelected
                ]}>
                  {name}
                </Text>
                {language === code && (
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
