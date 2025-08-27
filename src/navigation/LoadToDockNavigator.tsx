import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadToDockListScreen from '../screen/LoadToDockListScreen';
import LoadToDockItemsScreen from '../screen/LoadToDockItemsScreen';
import LoadToDockItemDetailsScreen from '../screen/LoadToDockItemDetailsScreen';

export type LoadToDockStackParamList = {
  LoadToDockList: undefined;
  LoadToDockItems: {
    deliveryItem: {
      deliveryId: string;
      salesOrderNumber: string;
      customerName: string;
      tripNumber: string;
      date: string;
      dock: string;
      itemCount: number;
      status: 'pending' | 'in-progress' | 'completed';
    };
  };
  LoadToDockItemDetails: {
    deliveryItem: {
      deliveryId: string;
      salesOrderNumber: string;
      customerName: string;
      tripNumber: string;
      date: string;
      dock: string;
      itemCount: number;
      status: 'pending' | 'in-progress' | 'completed';
    };
    itemDetail: {
      itemId: string;
      itemSku: string;
      itemDescription: string;
      requestedQuantity: number;
      loadedQuantity: number;
      unit: string;
      hasPhotos: boolean;
      hasVideo: boolean;
    };
  };
};

const Stack = createStackNavigator<LoadToDockStackParamList>();

const LoadToDockNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="LoadToDockList" 
        component={LoadToDockListScreen}
        options={{
          title: 'Load to Dock',
        }}
      />
      <Stack.Screen 
        name="LoadToDockItems" 
        component={LoadToDockItemsScreen}
        options={{
          title: 'Items',
        }}
      />
      <Stack.Screen 
        name="LoadToDockItemDetails" 
        component={LoadToDockItemDetailsScreen}
        options={{
          title: 'Item Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default LoadToDockNavigator;
