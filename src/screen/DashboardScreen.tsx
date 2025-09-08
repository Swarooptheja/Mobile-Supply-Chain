import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme, useThemeContext } from '../context/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import NavigationDrawer from '../components/NavigationDrawer';
import { useNavigationDrawer } from '../hooks';
import { HeaderButton, VectorIcon } from '../components';
import { createDashboardStyles } from '../styles/DashboardScreen.styles';
import AuthGuard from '../components/AuthGuard';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();
  const { isDrawerVisible, openDrawer, closeDrawer, handleMenuItemPress } = useNavigationDrawer();
  const userName = user?.name || user?.username || 'User';
  
  const styles = createDashboardStyles(theme);

  const handleLoadToDockPress = () => {
    navigation.navigate('LoadToDock');
  };

  const handleTransactionHistoryPress = () => {
    navigation.navigate('TransactionHistory');
  };

  return (
    <AuthGuard allowBack={true}>
      <SafeAreaView style={styles.container}>
        <AppHeader 
          title="Dashboard" 
          leftElement={
            <HeaderButton
              icon="menu"
              onPress={openDrawer}
            />
          }
          rightElement={
            <HeaderButton
              icon={theme.colors.background === '#121212' ? "sun" : "moon"}
              onPress={toggleTheme}
            />
          }
        />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {/* Load to Dock Card */}
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.cardContent}
              onPress={handleLoadToDockPress}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopSection}>
                <View style={styles.cardIcon}>
                  <VectorIcon
                    name="local-shipping"
                    size={20}
                    color={theme.colors.white}
                    iconSet="MaterialIcons"
                  />
                </View>
                <View style={styles.metricsContainer}>
                  <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>12</Text>
                      <Text style={styles.metricLabel}>Today</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>98%</Text>
                      <Text style={styles.metricLabel}>On Time</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardTitle}>Load to Dock</Text>
                <Text style={styles.cardDescription}>
                  Manage dock operations and track shipments
                </Text>
                <Text style={styles.actionText}>Manage →</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Transaction History Card */}
          <View style={styles.cardContainer}>
            <TouchableOpacity 
              style={styles.cardContent}
              onPress={handleTransactionHistoryPress}
              activeOpacity={0.8}
            >
              <View style={styles.cardTopSection}>
                <View style={styles.cardIcon}>
                  <VectorIcon
                    name="history"
                    size={20}
                    color={theme.colors.white}
                    iconSet="MaterialIcons"
                  />
                </View>
                <View style={styles.metricsContainer}>
                  <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>156</Text>
                      <Text style={styles.metricLabel}>Today</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricValue}>03</Text>
                      <Text style={styles.metricLabel}>Pending</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <View style={styles.cardBottomSection}>
                <Text style={styles.cardTitle}>Transactions</Text>
                <Text style={styles.cardDescription}>
                  View history and sync status
                </Text>
                <Text style={styles.actionText}>View all →</Text>
              </View>
            </TouchableOpacity>
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
    </AuthGuard>
  );
};

export default DashboardScreen;


