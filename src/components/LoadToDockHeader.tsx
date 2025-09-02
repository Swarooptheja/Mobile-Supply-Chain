import React from 'react';
import { View } from 'react-native';
import { AppHeader } from './AppHeader';
import HeaderButton from './HeaderButton';

interface LoadToDockHeaderProps {
  deliveryId: string;
  onBack: () => void;
  onHome: () => void;
}

export const LoadToDockHeader: React.FC<LoadToDockHeaderProps> = ({
  deliveryId,
  onBack,
  onHome,
}) => (
  <AppHeader 
    title={`Pick Slip #${deliveryId}`}
    leftElement={
      <HeaderButton
        icon="back"
        onPress={onBack}
        backgroundColor="rgba(255, 255, 255, 0.2)"
      />
    }
    rightElement={
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <HeaderButton
          icon="home"
          onPress={onHome}
          backgroundColor="rgba(255, 255, 255, 0.2)"
        />
      </View>
    }
  />
);
