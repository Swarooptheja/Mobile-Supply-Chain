import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import AppHeader from '../components/AppHeader';
import HamburgerMenu from '../components/HamburgerMenu';
import NavigationDrawer from '../components/NavigationDrawer';
import { useNavigationDrawer } from '../hooks';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { isDrawerVisible, openDrawer, closeDrawer, handleMenuItemPress } = useNavigationDrawer();
  const userName = user?.name || user?.username || 'User';

  const handleLoadToDockPress = () => {
    navigation.navigate('LoadToDock');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const handleOrganizationPress = () => {
    navigation.navigate('Organization');
  };

  const handleTransactionHistoryPress = () => {
    navigation.navigate('TransactionHistory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        title="Dashboard" 
        leftElement={<HamburgerMenu onPress={openDrawer} />}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.tilesSection}>
          
          {/* First Row - 2 tiles */}
          <View style={styles.tileRow}>
            {/* Load to Dock Tile */}
            <View style={styles.tileContainer}>
              <DashboardCard
                title="Load to Dock"
                content={
                  <View style={styles.tileContent}>
                    <Text style={styles.tileIcon}>🚚</Text>
                    <Text style={styles.tileDescription}>
                      Manage delivery items and load them to dock
                    </Text>
                    <View style={styles.tileStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>12</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>In Progress</Text>
                        <Text style={styles.statValue}>5</Text>
                      </View>
                    </View>
                    <View style={styles.tileFooter}>
                      <Text style={styles.footerText}>Last updated: 2 hours ago</Text>
                    </View>
                  </View>
                }
                onPress={handleLoadToDockPress}
              />
            </View>

            {/* Settings Tile */}
            <View style={styles.tileContainer}>
              <DashboardCard
                title="Settings"
                content={
                  <View style={styles.tileContent}>
                    <Text style={styles.tileIcon}>⚙️</Text>
                    <Text style={styles.tileDescription}>
                      Configure app preferences and system settings
                    </Text>
                    <View style={styles.tileStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Active</Text>
                        <Text style={styles.statValue}>8</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>2</Text>
                      </View>
                    </View>
                    <View style={styles.tileFooter}>
                      <Text style={styles.footerText}>Last updated: 1 day ago</Text>
                    </View>
                  </View>
                }
                onPress={handleSettingsPress}
              />
            </View>
          </View>

          {/* Second Row - 2 tiles */}
          <View style={styles.tileRow}>
            {/* Organization Tile */}
            <View style={styles.tileContainer}>
              <DashboardCard
                title="Organization"
                content={
                  <View style={styles.tileContent}>
                    <Text style={styles.tileIcon}>🏢</Text>
                    <Text style={styles.tileDescription}>
                      Manage organization details and structure
                    </Text>
                    <View style={styles.tileStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Departments</Text>
                        <Text style={styles.statValue}>6</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Employees</Text>
                        <Text style={styles.statValue}>24</Text>
                      </View>
                    </View>
                    <View style={styles.tileFooter}>
                      <Text style={styles.footerText}>Last updated: 3 days ago</Text>
                    </View>
                  </View>
                }
                onPress={handleOrganizationPress}
              />
            </View>

            {/* Transaction History Tile */}
            <View style={styles.tileContainer}>
              <DashboardCard
                title="Transaction History"
                content={
                  <View style={styles.tileContent}>
                    <Text style={styles.tileIcon}>📊</Text>
                    <Text style={styles.tileDescription}>
                      View and track all transaction records
                    </Text>
                    <View style={styles.tileStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Today</Text>
                        <Text style={styles.statValue}>8</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statLabel}>This Week</Text>
                        <Text style={styles.statValue}>42</Text>
                      </View>
                    </View>
                    <View style={styles.tileFooter}>
                      <Text style={styles.footerText}>Last updated: 5 minutes ago</Text>
                    </View>
                  </View>
                }
                onPress={handleTransactionHistoryPress}
              />
            </View>
          </View>
        </View>

        <View style={styles.recentActivitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Your recent actions will appear here</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Drawer */}
      <NavigationDrawer
        isVisible={isDrawerVisible}
        onClose={closeDrawer}
        userName={userName}
        onMenuItemPress={handleMenuItemPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  userInfo: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  tilesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  tileRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  tileContainer: {
    flex: 1,
  },
  tileContent: {
    alignItems: 'center',
  },
  tileIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  tileDescription: {
    fontSize: 14,
    color: '#6c7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  tileStats: {
    width: '100%',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tileFooter: {
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  recentActivitySection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  activitySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
});

export default DashboardScreen;

