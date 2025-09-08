import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Theme } from '../context/ThemeContext';
import { TransactionHistoryItem } from '../services/transactionHistoryService';
import { createTransactionCardStyles } from '../styles/TransactionCard.styles';

interface TransactionCardProps {
  transaction: TransactionHistoryItem;
  theme: Theme;
  isTablet?: boolean;
  isDesktop?: boolean;
  onPress?: (transaction: TransactionHistoryItem) => void;
  testID?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = memo(({
  transaction,
  theme,
  isTablet = false,
  isDesktop = false,
  onPress,
  testID
}) => {
  const styles = createTransactionCardStyles(theme, isTablet, isDesktop);
  
  const status = transaction.sharePointTransactionStatus;
  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isFailed = status === 'failed';

  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return timestamp;
    }
  };

  const handlePress = () => {
    onPress?.(transaction);
  };

  return (
    <TouchableOpacity
      style={[
        styles.transactionCard,
        isPending && styles.transactionCardPending,
        isSuccess && styles.transactionCardSuccess,
        isFailed && styles.transactionCardFailed
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={testID}
    >
      {/* Header with status */}
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionId}>
            ID: {transaction.MobileTransactionId}
          </Text>
          <Text style={styles.transactionTimestamp}>
            {formatTimestamp(transaction.CreatedAt)}
          </Text>
        </View>
        <View style={[
          styles.statusBadge,
          isPending && styles.statusBadgePending,
          isSuccess && styles.statusBadgeSuccess,
          isFailed && styles.statusBadgeFailed
        ]}>
          <Text style={[
            styles.statusText,
            isPending && styles.statusTextPending,
            isSuccess && styles.statusTextSuccess,
            isFailed && styles.statusTextFailed
          ]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Transaction Details */}
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery ID:</Text>
          <Text style={styles.detailValue}>{transaction.DeliveryLineId}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehicle Number:</Text>
          <Text style={styles.detailValue}>{transaction.VehicleNumber}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dock Door:</Text>
          <Text style={styles.detailValue}>{transaction.DockDoor}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>LPN Number:</Text>
          <Text style={styles.detailValue}>{transaction.LpnNumber}</Text>
        </View>
      </View>

      {/* Status-specific content */}
      {isPending && (
        <View style={styles.pendingContainer}>
          <View style={styles.pendingIndicator}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Transaction is being processed...</Text>
          </View>
        </View>
      )}

      {isSuccess && (
        <View style={styles.successContainer}>
          {transaction.Message && (
            <Text style={styles.messageText}>{transaction.Message}</Text>
          )}
        </View>
      )}

      {isFailed && (
        <View style={styles.failedContainer}>
          {transaction.Message && (
            <Text style={styles.errorMessageText}>{transaction.Message}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
});

TransactionCard.displayName = 'TransactionCard';

export default TransactionCard;
