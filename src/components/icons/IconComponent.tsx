import React from 'react';
import { View, StyleSheet } from 'react-native';

// Import React Feather icons directly
import {
  Camera,
  Video,
  Image,
  FileText,
  Clipboard,
  MapPin,
  Navigation,
  Plus,
  Minus,
  Edit3,
  Trash2,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  AlertTriangle,
  Info,
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  Settings,
  Home,
  ShoppingCart,
  Package,
  Truck,
  Star,
  Heart,
  Share,
  Mail,
  Phone,
  Calendar,
  Clock,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Loader,
  Database,
  RefreshCw,
  Menu,
  BarChart,
  // Add more icons as needed
} from 'react-native-feather';

export interface IIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: any;
}

/**
 * Pure React Feather icon component
 * Provides professional vector icons for consistent app design
 */
const IconComponent: React.FC<IIconProps> = ({
  name,
  size = 16,
  color = '#6b7280',
  style
}) => {
  // Icon mapping using React Feather icons
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    // Camera icons
    'camera': Camera,
    'photo': Camera,
    'image': Image,
    
    // Video icons
    'video': Video,
    'video-camera': Video,
    'film': Video,
    
    // Document icons
    'file': FileText,
    'document': FileText,
    'clipboard': Clipboard,
    
    // Location icons
    'map-pin': MapPin,
    'location': MapPin,
    'navigation': Navigation,
    
    // Action icons
    'plus': Plus,
    'minus': Minus,
    'edit': Edit3,
    'delete': Trash2,
    'search': Search,
    'filter': Filter,
    'sort': ArrowUp, // Using ArrowUp as sort icon
    'scan': BarChart, // Using BarChart as scan/barcode icon
    'refresh': RefreshCw,
    'menu': Menu,
    
    // Status icons
    'check': Check,
    'x': X,
    'warning': AlertTriangle,
    'info': Info,
    'check-circle': CheckCircle,
    'x-circle': XCircle,
    'loader': Loader,
    'database': Database,
    
    // Navigation icons
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up': ArrowUp,
    'arrow-down': ArrowDown,
    
    // User icons
    'user': User,
    'users': Users,
    'settings': Settings,
    'home': Home,
    
    // Business icons
    'shopping-cart': ShoppingCart,
    'package': Package,
    'truck': Truck,
    'warehouse': Home, // Using Home as warehouse icon
    
    // Social icons
    'star': Star,
    'heart': Heart,
    'share': Share,
    
    // Communication icons
    'mail': Mail,
    'phone': Phone,
    
    // Time icons
    'calendar': Calendar,
    'clock': Clock,
    
    // File operations
    'download': Download,
    'upload': Upload,
    
    // Visibility icons
    'eye': Eye,
    'eye-off': EyeOff,
    
    // Security icons
    'lock': Lock,
    'unlock': Unlock,
    
    // Default fallback
    'default': Info
  };

  const IconComponent = iconMap[name] || iconMap['default'];

  return (
    <View style={[styles.iconContainer, style]}>
      <IconComponent 
        size={size} 
        color={color}
        strokeWidth={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconComponent;
