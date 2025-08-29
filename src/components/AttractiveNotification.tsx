import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import VectorIcon from './VectorIcon';
import { IAttractiveNotificationProps, ITypeConfig } from '../interfaces';

const { width, height } = Dimensions.get('window');

const AttractiveNotification: React.FC<IAttractiveNotificationProps> = ({
  visible,
  type,
  title,
  message,
  duration = 4000,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-200)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset values
      translateY.setValue(-200);
      opacity.setValue(0);
      scale.setValue(0.8);
      rotate.setValue(0);
      progressWidth.setValue(0);

      // Show animation with spring effect
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
      ]).start();

      // Start progress bar animation
      Animated.timing(progressWidth, {
        toValue: width - 32,
        duration: duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
              Animated.timing(scale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
    ]).start(() => {
      onHide();
    });
  };

  const getTypeConfig = (): ITypeConfig => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          iconColor: '#FFFFFF',
          iconName: 'check-circle',
          iconSet: 'Feather',
          gradient: ['#10B981', '#059669'],
          shadowColor: '#10B981',
        };
      case 'error':
        return {
          backgroundColor: '#EF4444',
          iconColor: '#FFFFFF',
          iconName: 'alert-circle',
          iconSet: 'Feather',
          gradient: ['#EF4444', '#DC2626'],
          shadowColor: '#EF4444',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          iconColor: '#FFFFFF',
          iconName: 'alert-triangle',
          iconSet: 'Feather',
          gradient: ['#F59E0B', '#D97706'],
          shadowColor: '#F59E0B',
        };
      case 'info':
        return {
          backgroundColor: '#3B82F6',
          iconColor: '#FFFFFF',
          iconName: 'info',
          iconSet: 'Feather',
          gradient: ['#3B82F6', '#2563EB'],
          shadowColor: '#3B82F6',
        };
      default:
        return {
          backgroundColor: '#6B7280',
          iconColor: '#FFFFFF',
          iconName: 'message-circle',
          iconSet: 'Feather',
          gradient: ['#6B7280', '#4B5563'],
          shadowColor: '#6B7280',
        };
    }
  };

  const typeConfig = getTypeConfig();
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: typeConfig.backgroundColor,
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      {/* Progress Bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        ]}
      />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon Container with Rotation */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <VectorIcon
            name={typeConfig.iconName}
            size={28}
            color={typeConfig.iconColor}
            iconSet={typeConfig.iconSet}
          />
        </Animated.View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>

        {/* Close Button */}
        <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
          <VectorIcon
            name="x"
            size={20}
            color="#FFFFFF"
            iconSet="Feather"
          />
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={[styles.decorativeCircle, styles.circle1]} />
      <View style={[styles.decorativeCircle, styles.circle2]} />
      <View style={[styles.decorativeCircle, styles.circle3]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 1000,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 23,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontWeight: '500',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 20,
    height: 20,
    top: 15,
    right: 60,
  },
  circle2: {
    width: 12,
    height: 12,
    top: 35,
    right: 40,
  },
  circle3: {
    width: 16,
    height: 16,
    bottom: 15,
    right: 80,
  },
});

export default AttractiveNotification;
