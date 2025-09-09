import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { LoginScreen } from '../screen';
import DashboardScreen from '../screen/DashboardScreen';
import OrganizationScreen from '../screen/OrganizationScreen';
import ActivityScreen from '../screen/ActivityScreen';
import TransactionHistoryScreen from '../screen/TransactionHistoryScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LoadToDockNavigator from './LoadToDockNavigator';

export type RootStackParamList = {
  Login: undefined;
  Organization: undefined;
  Activity: {
    selectedOrgId: string;
    responsibilities: string[];
  };
  Dashboard: undefined;
  LoadToDock: undefined;
  TransactionHistory: undefined;
  MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
            headerLeft: () => null, // Remove back button
          }}
        />
        <Stack.Screen 
          name="Organization" 
          component={OrganizationScreen}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
            headerLeft: () => null, // Remove back button
          }}
        />
        <Stack.Screen 
          name="Activity" 
          component={ActivityScreen}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
            headerLeft: () => null, // Remove back button
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={BottomTabNavigator}
          options={{
            gestureEnabled: false, // Disable swipe back gesture
            headerLeft: () => null, // Remove back button
          }}
        />
        <Stack.Screen 
          name="LoadToDock" 
          component={LoadToDockNavigator}
          options={{
            gestureEnabled: true, // Allow back navigation in main app
          }}
        />
        <Stack.Screen 
          name="TransactionHistory" 
          component={TransactionHistoryScreen}
          options={{
            gestureEnabled: true, // Allow back navigation in main app
          }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={BottomTabNavigator}
          options={{
            gestureEnabled: true, // Allow back navigation in main app
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
