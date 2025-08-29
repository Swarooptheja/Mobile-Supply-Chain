import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DynamicTabs, IconComponent, ITabItem } from './index';

/**
 * Example component demonstrating how to use DynamicTabs with React Feather icons
 * Shows different configurations and how to easily add new tabs
 */
const DynamicTabsExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('photos');

  // Example 1: Media tabs (similar to LoadToDockItemDetailsScreen)
  const mediaTabs: ITabItem[] = [
    {
      id: 'photos',
      label: 'PHOTOS',
      icon: <IconComponent name="camera" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>📷 Photo capture interface</Text>
          <Text style={styles.contentSubtext}>This is where photo functionality would go</Text>
          <Text style={styles.iconNote}>Uses React Feather Camera icon</Text>
        </View>
      )
    },
    {
      id: 'video',
      label: 'VIDEO',
      icon: <IconComponent name="video" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>🎥 Video recording interface</Text>
          <Text style={styles.contentSubtext}>This is where video functionality would go</Text>
          <Text style={styles.iconNote}>Uses React Feather Video icon</Text>
        </View>
      )
    }
  ];

  // Example 2: Business process tabs
  const businessTabs: ITabItem[] = [
    {
      id: 'orders',
      label: 'ORDERS',
      icon: <IconComponent name="shopping-cart" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>🛒 Order management</Text>
          <Text style={styles.contentSubtext}>View and manage customer orders</Text>
          <Text style={styles.iconNote}>Uses React Feather ShoppingCart icon</Text>
        </View>
      )
    },
    {
      id: 'inventory',
      label: 'INVENTORY',
      icon: <IconComponent name="home" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>🏭 Inventory tracking</Text>
          <Text style={styles.contentSubtext}>Monitor stock levels and locations</Text>
          <Text style={styles.iconNote}>Uses React Feather Home icon (as warehouse)</Text>
        </View>
      )
    },
    {
      id: 'shipping',
      label: 'SHIPPING',
      icon: <IconComponent name="truck" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>🚚 Shipping details</Text>
          <Text style={styles.contentSubtext}>Track shipments and delivery status</Text>
          <Text style={styles.iconNote}>Uses React Feather Truck icon</Text>
        </View>
      )
    }
  ];

  // Example 3: User management tabs
  const userTabs: ITabItem[] = [
    {
      id: 'profile',
      label: 'PROFILE',
      icon: <IconComponent name="user" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>👤 User profile</Text>
          <Text style={styles.contentSubtext}>Manage personal information</Text>
          <Text style={styles.iconNote}>Uses React Feather User icon</Text>
        </View>
      )
    },
    {
      id: 'settings',
      label: 'SETTINGS',
      icon: <IconComponent name="settings" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>⚙️ App settings</Text>
          <Text style={styles.contentSubtext}>Configure app preferences</Text>
          <Text style={styles.iconNote}>Uses React Feather Settings icon</Text>
        </View>
      )
    },
    {
      id: 'notifications',
      label: 'NOTIFICATIONS',
      icon: <IconComponent name="info" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>ℹ️ Notification center</Text>
          <Text style={styles.contentSubtext}>Manage app notifications</Text>
          <Text style={styles.iconNote}>Uses React Feather Info icon</Text>
        </View>
      )
    }
  ];

  // Example 4: Document management tabs
  const documentTabs: ITabItem[] = [
    {
      id: 'files',
      label: 'FILES',
      icon: <IconComponent name="file" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>📄 File management</Text>
          <Text style={styles.contentSubtext}>Upload and organize documents</Text>
          <Text style={styles.iconNote}>Uses React Feather FileText icon</Text>
        </View>
      )
    },
    {
      id: 'clipboard',
      label: 'CLIPBOARD',
      icon: <IconComponent name="clipboard" size={14} color="#6b7280" />,
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.contentText}>📋 Clipboard items</Text>
          <Text style={styles.contentSubtext}>View copied items and history</Text>
          <Text style={styles.iconNote}>Uses React Feather Clipboard icon</Text>
        </View>
      )
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>DynamicTabs with React Feather Icons</Text>
      
      <Text style={styles.subtitle}>
        Professional vector icons for a polished, consistent app appearance
      </Text>
      
      {/* Example 1: Media Tabs (2 tabs) */}
      <Text style={styles.sectionTitle}>1. Media Tabs (2 tabs):</Text>
      <DynamicTabs
        tabs={mediaTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeIconStyle={{ color: '#ffffff' }}
        activeLabelStyle={{ color: '#ffffff' }}
      />

      {/* Example 2: Business Process Tabs (3 tabs) */}
      <Text style={styles.sectionTitle}>2. Business Process Tabs (3 tabs):</Text>
      <DynamicTabs
        tabs={businessTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.customTabs}
        activeIconStyle={{ color: '#10b981' }}
        activeLabelStyle={{ color: '#10b981' }}
      />

      {/* Example 3: User Management Tabs (3 tabs) */}
      <Text style={styles.sectionTitle}>3. User Management Tabs (3 tabs):</Text>
      <DynamicTabs
        tabs={userTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.roundedTabs}
        activeIconStyle={{ color: '#8b5cf6' }}
        activeLabelStyle={{ color: '#8b5cf6' }}
      />

      {/* Example 4: Document Tabs (2 tabs) */}
      <Text style={styles.sectionTitle}>4. Document Management Tabs (2 tabs):</Text>
      <DynamicTabs
        tabs={documentTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.documentTabs}
        activeIconStyle={{ color: '#f59e0b' }}
        activeLabelStyle={{ color: '#f59e0b' }}
      />

      {/* How to add new tabs */}
      <Text style={styles.sectionTitle}>How to Add New Tabs:</Text>
      <View style={styles.codeBlock}>
        <Text style={styles.codeText}>
          // Simply add new tab objects to the tabs array:{'\n\n'}
          const tabs = [{'\n'}
          {'  '}{'{'}{'\n'}
          {'    '}id: 'new-feature',{'\n'}
          {'    '}label: 'NEW FEATURE',{'\n'}
          {'    '}icon: {'<'}IconComponent name="plus" size={14} /{'>'},{'\n'}
          {'    '}content: renderNewFeatureTab(){'\n'}
          {'  '}{'}'}{'\n'}
          {'  '}// ... existing tabs{'\n'}
          ];{'\n\n'}
          // The DynamicTabs component will automatically{'\n'}
          // handle the new tab without any code changes!
        </Text>
      </View>

      {/* Icon Benefits */}
      <Text style={styles.sectionTitle}>React Feather Icon Benefits:</Text>
      <Text style={styles.benefitText}>
        • Professional vector icons only{'\n'}
        • Scalable to any size without quality loss{'\n'}
        • Consistent stroke width and style{'\n'}
        • Better performance and accessibility{'\n'}
        • Easy to customize colors and sizes{'\n'}
        • 24x24px optimized for mobile apps{'\n'}
        • Clean, modern appearance
      </Text>

      {/* Installation Note */}
      <View style={styles.installNote}>
        <Text style={styles.installTitle}>📦 Installation Required</Text>
        <Text style={styles.installText}>
          To use React Feather icons: npm install react-native-feather{'\n'}
          See ICON_INSTALLATION_GUIDE.md for complete setup instructions.{'\n'}
          No emoji fallbacks - only professional vector icons.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
  },
  tabContent: {
    padding: 20,
    backgroundColor: '#ffffff',
    margin: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  contentSubtext: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  iconNote: {
    fontSize: 12,
    color: '#10b981',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  customTabs: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  roundedTabs: {
    borderRadius: 12,
    backgroundColor: '#fef3c7',
  },
  documentTabs: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  codeBlock: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
  },
  codeText: {
    color: '#f9fafb',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginTop: 8,
  },
  installNote: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  installTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  installText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});

export default DynamicTabsExample;
