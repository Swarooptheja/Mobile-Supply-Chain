import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context';
import { LoginScreen } from '../screen';
import OrganizationScreen from '../screen/OrganizationScreen';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: { orgId?: string } | undefined;
  Organization: undefined;
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
            <Stack.Screen name="Dashboard" component={BottomTabNavigator} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
