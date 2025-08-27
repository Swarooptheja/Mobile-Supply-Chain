
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions,
  Animated
} from 'react-native';
import { INavigationDrawerProps, INavigationMenuItem } from '../types/dashboard.interface';

const { width } = Dimensions.get('window');

const NavigationDrawer: React.FC<INavigationDrawerProps> = ({ 
  isVisible, 
  onClose, 
  userName, 
  onMenuItemPress 
}) => {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleMenuItemPress = (item: INavigationMenuItem) => {
    console.log('Menu item pressed:', item.title);
    onMenuItemPress(item);
    onClose();
  };

  const menuItems: INavigationMenuItem[] = [
    { id: 'home', title: 'Home', icon: '🏠', action: () => {} },
    { id: 'chat', title: 'Chat', icon: '💬', action: () => {} },
    { id: 'invOrg', title: 'Inv Org: HOI', icon: '↔️', action: () => {} },
    { id: 'refreshQty', title: 'Refresh On hand Qty', icon: '🔄', action: () => {} },
    { id: 'reload', title: 'Reload', icon: '🔄', action: () => {} },
    { id: 'dataMaintenance', title: 'Data Maintenance', icon: '☁️', action: () => {} },
    { id: 'settings', title: 'Settings', icon: '⚙️', action: () => {} },
    { id: 'healthStatus', title: 'Health Status', icon: '❤️', action: () => {} },
    { id: 'reports', title: 'Reports', icon: '📊', action: () => {} },
    { id: 'analytics', title: 'Analytics', icon: '📈', action: () => {} },
    { id: 'userManagement', title: 'User Management', icon: '👥', action: () => {} },
    { id: 'systemConfig', title: 'System Configuration', icon: '⚙️', action: () => {} },
    { id: 'backup', title: 'Backup & Restore', icon: '💾', action: () => {} },
    { id: 'help', title: 'Help & Support', icon: '❓', action: () => {} },
    { id: 'about', title: 'About', icon: 'ℹ️', action: () => {} },
    { id: 'privacy', title: 'Privacy Policy', icon: '🔒', action: () => {} },
    { id: 'terms', title: 'Terms of Service', icon: '📋', action: () => {} },
    { id: 'feedback', title: 'Send Feedback', icon: '📝', action: () => {} },
    { id: 'documentation', title: 'Documentation', icon: '📚', action: () => {} },
    { id: 'training', title: 'Training Materials', icon: '🎓', action: () => {} },
    { id: 'updates', title: 'System Updates', icon: '🔄', action: () => {} },
    { id: 'maintenance', title: 'Scheduled Maintenance', icon: '🔧', action: () => {} },
    { id: 'security', title: 'Security Settings', icon: '🔐', action: () => {} },
    { id: 'notifications', title: 'Notification Center', icon: '🔔', action: () => {} },
    { id: 'themes', title: 'Theme Settings', icon: '🎨', action: () => {} },
    { id: 'language', title: 'Language Settings', icon: '🌐', action: () => {} },
    { id: 'accessibility', title: 'Accessibility Options', icon: '♿', action: () => {} },
    { id: 'performance', title: 'Performance Monitor', icon: '📊', action: () => {} },
    { id: 'logs', title: 'System Logs', icon: '📝', action: () => {} },
    { id: 'logout', title: 'Logout', icon: '↪️', action: () => {} },
    { id: 'logoutClear', title: 'Logout + Clear Data', icon: '↪️', action: () => {} }
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* Drawer */}
      <Animated.View 
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.userIcon}>👤</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView 
          style={styles.menuContainer}
          contentContainerStyle={styles.menuContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {menuItems.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item)}
                activeOpacity={0.6}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.title}</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version - MSCA2025A-V1.1.0</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  drawer: {
    width: Math.min(width * 0.8, 320),
    height: '100%', // full height
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: 120,
    justifyContent: 'flex-end',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  menuContainer: {
    flex: 1, // take available space
    backgroundColor: '#ffffff',
  },
  menuContent: {
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    minHeight: 56,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 15,
    color: '#2d3748',
    fontWeight: '500',
    flex: 1,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#a0aec0',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
  },
  footer: {
    backgroundColor: '#f7fafc',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 60,
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default NavigationDrawer;
