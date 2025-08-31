import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AppHeader } from '../components/AppHeader';
import NavigationDrawer from '../components/NavigationDrawer';
import { useNavigationDrawer } from '../hooks';
import { CommonIcon, HeaderButton } from '../components';

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

  const handleTransactionHistoryPress = () => {
    navigation.navigate('TransactionHistory');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader 
        title="Dashboard" 
        leftElement={
          <HeaderButton
            icon="menu"
            onPress={openDrawer}
          />
        }
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.cardsRow}>
            {/* Load to Dock Card */}
            <TouchableOpacity 
              style={styles.cardContainer} 
              onPress={handleLoadToDockPress}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <CommonIcon icon="truck" size={24} color="#ffffff" />
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.badgeText}>6</Text>
                </View>
              </View>
              
              <Text style={styles.cardTitle}>Load to Dock</Text>
              <Text style={styles.cardDescription}>
                Manage dock operations and track shipments
              </Text>
              
              <View style={styles.cardMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>12</Text>
                  <Text style={styles.metricLabel}>Today</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>98%</Text>
                  <Text style={styles.metricLabel}>On Time</Text>
                </View>
              </View>
              
              <View style={styles.cardAction}>
                <Text style={styles.actionText}>Manage</Text>
                <CommonIcon icon="arrowRight" size={16} color="#8b5cf6" />
              </View>
            </TouchableOpacity>

            {/* Transaction History Card */}
            <TouchableOpacity 
              style={styles.cardContainer} 
              onPress={handleTransactionHistoryPress}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, styles.chartIconContainer]}>
                  <CommonIcon icon="chart" size={24} color="#ffffff" />
                </View>
                <View style={styles.cardBadge}>
                  <Text style={styles.badgeText}>24</Text>
                </View>
              </View>
              
              <Text style={styles.cardTitle}>Transactions</Text>
              <Text style={styles.cardDescription}>
                View history and sync status
              </Text>
              
              <View style={styles.cardMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>156</Text>
                  <Text style={styles.metricLabel}>Total</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>3</Text>
                  <Text style={styles.metricLabel}>Pending</Text>
                </View>
              </View>
              
              <View style={styles.cardAction}>
                <Text style={styles.actionText}>View All</Text>
                <CommonIcon icon="arrowRight" size={16} color="#ec4899" />
              </View>
            </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  welcomeSection: {
    marginBottom: 32,
    paddingVertical: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 36,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
  },
  dashboardSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    marginTop: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flex: 1,
    minHeight: 160,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  chartIconContainer: {
    backgroundColor: '#ec4899',
    shadowColor: '#ec4899',
  },
  cardBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    color: '#d97706',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    marginBottom: 12,
    flex: 1,
  },
  cardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3b82f6',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 12,
  },
  cardAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default DashboardScreen;


