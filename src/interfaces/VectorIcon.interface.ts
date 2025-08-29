export type IconSet = 
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'Ionicons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Feather'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial'
  | 'Fontisto';

export interface IVectorIconProps {
  name: string;
  size: number;
  color: string;
  iconSet?: IconSet;
  style?: any;
}