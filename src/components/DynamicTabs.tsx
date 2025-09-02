import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface ITabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface IDynamicTabsProps {
  tabs: ITabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: any;
  tabStyle?: any;
  activeTabStyle?: any;
  iconStyle?: any;
  activeIconStyle?: any;
  labelStyle?: any;
  activeLabelStyle?: any;
}

/**
 * Reusable component for dynamic tabs that can handle any number of tabs
 * Supports custom styling and dynamic content rendering
 */
const DynamicTabs: React.FC<IDynamicTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
  tabStyle,
  activeTabStyle,
  iconStyle,
  activeIconStyle,
  labelStyle,
  activeLabelStyle
}) => {
  const renderTabs = () => (
    <View style={[styles.tabsContainer, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            tabStyle,
            activeTab === tab.id && styles.activeTab,
            activeTab === tab.id && activeTabStyle
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <View style={[
            styles.iconContainer,
            iconStyle,
            activeTab === tab.id && activeIconStyle
          ]}>
            {tab.icon}
          </View>
          <Text style={[
            styles.tabText,
            labelStyle,
            activeTab === tab.id && styles.activeTabText,
            activeTab === tab.id && activeLabelStyle
          ]}>
            {tab.label}
          </Text>
          {/* Active indicator underline */}
          {activeTab === tab.id && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderActiveContent = () => {
    const activeTabItem = tabs.find(tab => tab.id === activeTab);
    return activeTabItem ? activeTabItem.content : null;
  };

  return (
    <>
      {renderTabs()}
      {renderActiveContent()}
    </>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    margin: 1,
    position: 'relative', // For active indicator positioning
  },
  activeTab: {
    backgroundColor: '#1e3a8a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }], // Slight scale effect for active state
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default DynamicTabs;
