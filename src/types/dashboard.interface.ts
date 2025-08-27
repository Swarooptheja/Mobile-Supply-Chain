export interface INavigationDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  userName: string;
  onMenuItemPress: (item: INavigationMenuItem) => void;
}

export interface INavigationMenuItem {
  id: string;
  title: string;
  icon: string;
  action: () => void;
}

export interface IDashboardCardProps {
  title: string;
  content: React.ReactNode;
  onPress?: () => void;
}
