import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import DashboardScreen from '../screen/DashboardScreen';
import TransactionHistoryScreen from '../screen/TransactionHistoryScreen';
import SettingsScreen from '../screen/SettingsScreen';
import { VectorIcon } from '../components';

export type BottomTabParamList = {
  Home: undefined;
  TransactionHistory: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// Tab icon component
const TabIcon: React.FC<{ routeName: string; color: string; size: number }> = ({ 
  routeName, 
  color, 
  size 
}) => {
  let iconName: string;
  let iconSet: 'MaterialIcons' | 'Ionicons' = 'MaterialIcons';

  if (routeName === 'Home') {
    iconName = 'home';
  } else if (routeName === 'TransactionHistory') {
    iconName = 'history';
  } else if (routeName === 'Settings') {
    iconName = 'settings';
  } else {
    iconName = 'help';
  }

  return (
    <VectorIcon
      name={iconName}
      size={size}
      color={color}
      iconSet={iconSet}
    />
  );
};

const BottomTabNavigator: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { width: screenWidth } = Dimensions.get('window');
  
  // Responsive sizing
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  
  // Responsive dimensions - Increased heights for better spacing
  const tabBarHeight = Platform.OS === 'ios' 
    ? (isDesktop ? 140 : isTablet ? 130 : 120)
    : (isDesktop ? 120 : isTablet ? 110 : 105);
    
  const fontSize = isDesktop ? 13 : isTablet ? 12 : 11;
  const paddingBottom = Platform.OS === 'ios' 
    ? (isDesktop ? 40 : isTablet ? 35 : 30)
    : (isDesktop ? 25 : isTablet ? 20 : 18);

  const getTabIcon = (routeName: string, color: string, size: number) => (
    <TabIcon routeName={routeName} color={color} size={size} />
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
        tabBarActiveTintColor: theme.isDark ? theme.colors.primary : '#1e3a8a', // Match header color in light theme
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom,
          paddingTop: isDesktop ? 16 : isTablet ? 12 : 10,
          height: tabBarHeight,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: theme.isDark ? 0.3 : 0.1,
          shadowRadius: 4,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: t('dashboard.title'),
        }}
      />
      <Tab.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{
          tabBarLabel: t('transactionHistory.title'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings.title'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
