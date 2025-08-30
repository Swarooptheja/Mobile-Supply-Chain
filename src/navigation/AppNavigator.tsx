import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { LoginScreen } from '../screen';
import DashboardScreen from '../screen/DashboardScreen';
import OrganizationScreen from '../screen/OrganizationScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LoadToDockNavigator from './LoadToDockNavigator';

export type RootStackParamList = {
  Login: undefined;
  Organization: undefined;
  Dashboard: undefined;
  LoadToDock: undefined;
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
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Organization" component={OrganizationScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="LoadToDock" component={LoadToDockNavigator} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
