import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { IconSet, IVectorIconProps } from '../interfaces/VectorIcon.interface';



const iconSetMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Feather,
  AntDesign,
  Entypo,
  EvilIcons,
  Foundation,
  Octicons,
  SimpleLineIcons,
  Zocial,
  Fontisto,
};

// Common icon mappings for easy access
export const CommonIcons = {
  // Navigation icons
  back: { name: 'arrow-back', iconSet: 'MaterialIcons' as IconSet },
  home: { name: 'home', iconSet: 'MaterialIcons' as IconSet },
  menu: { name: 'menu', iconSet: 'MaterialIcons' as IconSet },
  close: { name: 'close', iconSet: 'MaterialIcons' as IconSet },
  arrowRight: { name: 'arrow-right', iconSet: 'Fontisto' as IconSet },
  // Action icons
  refresh: { name: 'refresh', iconSet: 'MaterialIcons' as IconSet },
  search: { name: 'search', iconSet: 'MaterialIcons' as IconSet },
  add: { name: 'add', iconSet: 'MaterialIcons' as IconSet },
  edit: { name: 'edit', iconSet: 'MaterialIcons' as IconSet },
  delete: { name: 'delete', iconSet: 'MaterialIcons' as IconSet },
  
  // Media icons
  camera: { name: 'camera-alt', iconSet: 'MaterialIcons' as IconSet },
  video: { name: 'videocam', iconSet: 'MaterialIcons' as IconSet },
  image: { name: 'image', iconSet: 'MaterialIcons' as IconSet },
  
  // Barcode/QR icons
  qrCode: { name: 'qr-code-scanner', iconSet: 'MaterialIcons' as IconSet },
  barcode: { name: 'qr-code', iconSet: 'MaterialIcons' as IconSet },
  
  // Status icons
  check: { name: 'check', iconSet: 'MaterialIcons' as IconSet },
  error: { name: 'error', iconSet: 'MaterialIcons' as IconSet },
  warning: { name: 'warning', iconSet: 'MaterialIcons' as IconSet },
  info: { name: 'info', iconSet: 'MaterialIcons' as IconSet },
  
  // More options icon
  more: { name: 'more-vert', iconSet: 'MaterialIcons' as IconSet },
  dots: { name: 'more-horiz', iconSet: 'MaterialIcons' as IconSet },
  
  // Dashboard icons
  truck: { name: 'local-shipping', iconSet: 'MaterialIcons' as IconSet },
  chart: { name: 'bar-chart', iconSet: 'MaterialIcons' as IconSet },
  settings: { name: 'settings', iconSet: 'MaterialIcons' as IconSet },
  business: { name: 'business', iconSet: 'MaterialIcons' as IconSet },
  lightning: { name: 'flash-on', iconSet: 'MaterialIcons' as IconSet },
};

export const VectorIcon: React.FC<IVectorIconProps> = ({
  name,
  size,
  color,
  iconSet = 'MaterialIcons',
  style,
}) => {
  const IconComponent = iconSetMap[iconSet];
  
  if (!IconComponent) {
    console.warn(`Icon set "${iconSet}" not found, falling back to MaterialIcons`);
    return <MaterialIcons name={name} size={size} color={color} style={style} />;
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

// Convenience component for common icons
export const CommonIcon: React.FC<{
  icon: keyof typeof CommonIcons;
  size: number;
  color: string;
  style?: any;
}> = ({ icon, size, color, style }) => {
  const iconConfig = CommonIcons[icon];
  return (
    <VectorIcon
      name={iconConfig.name}
      size={size}
      color={color}
      iconSet={iconConfig.iconSet}
      style={style}
    />
  );
};

export { VectorIcon };
