export interface IAttractiveNotificationProps {
  visible: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onHide: () => void;
}

export interface ITypeConfig {
  backgroundColor: string;
  iconColor: string;
  iconName: string;
  iconSet: string;
  gradient: string[];
  shadowColor: string;
}
