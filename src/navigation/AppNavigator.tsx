import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context';
import { LoginScreen } from '../screen';
import OrganizationScreen from '../screen/OrganizationScreen';
import DashboardScreen from '../screen/DashboardScreen';
import LoadToDockNavigator from './LoadToDockNavigator';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  Organization: undefined;
  Dashboard: undefined;
  LoadToDock: undefined;
  MainTabs: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={isAuthenticated ? 'auth' : 'guest'}
        initialRouteName={isAuthenticated ? 'Organization' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Organization" component={OrganizationScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="LoadToDock" component={LoadToDockNavigator} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
