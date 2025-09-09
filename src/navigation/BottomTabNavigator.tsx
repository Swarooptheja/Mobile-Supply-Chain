import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
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
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Responsive sizing
  const isTablet = screenWidth > 768 && screenWidth <= 1024;
  const isDesktop = screenWidth > 1024;
  const isSmallDevice = screenWidth <= 375;
  
  // Responsive dimensions
  const tabBarHeight = Platform.OS === 'ios' 
    ? (isDesktop ? 100 : isTablet ? 90 : 85)
    : (isDesktop ? 80 : isTablet ? 75 : 70);
    
  const iconSize = isDesktop ? 28 : isTablet ? 24 : 22;
  const fontSize = isDesktop ? 13 : isTablet ? 12 : 11;
  const paddingBottom = Platform.OS === 'ios' 
    ? (isDesktop ? 30 : isTablet ? 25 : 20)
    : (isDesktop ? 15 : isTablet ? 12 : 10);

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
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{
          tabBarLabel: 'Transaction History',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
