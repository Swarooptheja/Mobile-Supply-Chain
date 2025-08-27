import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import OrganizationScreen from '../screen/OrganizationScreen';
import TransactionHistoryScreen from '../screen/TransactionHistoryScreen';
import SettingsScreen from '../screen/SettingsScreen';

export type BottomTabParamList = {
  Organization: undefined;
  TransactionHistory: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Organization') {
            iconName = focused ? '🏢' : '🏢';
          } else if (route.name === 'TransactionHistory') {
            iconName = focused ? '📈' : '📈';
          } else if (route.name === 'Settings') {
            iconName = focused ? '⚙️' : '⚙️';
          } else {
            iconName = '❓';
          }

          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#6c757d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Organization"
        component={OrganizationScreen}
        options={{
          tabBarLabel: 'Organization',
        }}
      />
      <Tab.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{
          tabBarLabel: 'Transactions',
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
