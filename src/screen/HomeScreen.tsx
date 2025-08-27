import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user, responsibilities, defaultOrgId } = useAuth();

  const renderResponsibilityCard = (responsibility: string, index: number) => (
    <TouchableOpacity key={index} style={styles.responsibilityCard}>
      <Text style={styles.responsibilityText}>{responsibility}</Text>
      <Text style={styles.responsibilityArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || user?.username}</Text>
          <Text style={styles.userEmail}>{user?.username}</Text>
          {user?.fullName && (
            <Text style={styles.userFullName}>{user.fullName}</Text>
          )}
        </View>

        {/* Organization Info */}
        {defaultOrgId && (
          <View style={styles.orgSection}>
            <Text style={styles.sectionTitle}>Organization</Text>
            <View style={styles.orgCard}>
              <Text style={styles.orgLabel}>Default Organization</Text>
              <Text style={styles.orgValue}>{defaultOrgId}</Text>
              {user?.defaultInvOrgName && (
                <Text style={styles.orgName}>{user.defaultInvOrgName}</Text>
              )}
            </View>
          </View>
        )}

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Array.isArray(responsibilities) ? responsibilities.length : 0}</Text>
            <Text style={styles.statLabel}>Responsibilities</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user?.userId || 'N/A'}</Text>
            <Text style={styles.statLabel}>User ID</Text>
          </View>
        </View>

        {user?.personId && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.personId}</Text>
              <Text style={styles.statLabel}>Person ID</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{user.setOfBookId || 'N/A'}</Text>
              <Text style={styles.statLabel}>Set of Books</Text>
            </View>
          </View>
        )}

        {/* Responsibilities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Responsibilities</Text>
          <Text style={styles.sectionSubtitle}>
            Tap on any responsibility to access its features
          </Text>
          {Array.isArray(responsibilities) && responsibilities.length > 0 ? (
            responsibilities.map((responsibility: string, index: number) =>
              renderResponsibilityCard(responsibility, index)
            )
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No responsibilities assigned</Text>
              <Text style={styles.emptyStateSubtext}>
                Contact your administrator to get access to features
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Help & Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>About App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>VRZ-V1.1.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Project:</Text>
            <Text style={styles.infoValue}>EBS</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Environment:</Text>
            <Text style={styles.infoValue}>20D</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  userFullName: {
    fontSize: 16,
    color: '#495057',
    fontStyle: 'italic',
  },
  orgSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  orgCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#20B2AA',
  },
  orgLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  orgValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  orgName: {
    fontSize: 14,
    color: '#495057',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    marginHorizontal: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  responsibilityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  responsibilityText: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  responsibilityArrow: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#20B2AA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
  },
});

export default HomeScreen;
