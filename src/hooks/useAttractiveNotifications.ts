import { useAttractiveNotification } from '../context/AttractiveNotificationContext';

/**
 * Custom hook for showing attractive notifications
 * Provides easy-to-use methods for different notification types
 */
export const useAttractiveNotifications = () => {
  const {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showNotification,
  } = useAttractiveNotification();

  /**
   * Show a success notification with attractive animations
   */
  const showSuccessNotification = (title: string, message?: string, duration?: number) => {
    showSuccess(title, message, duration);
  };

  /**
   * Show an error notification with attractive animations
   */
  const showErrorNotification = (title: string, message?: string, duration?: number) => {
    showError(title, message, duration);
  };

  /**
   * Show an info notification with attractive animations
   */
  const showInfoNotification = (title: string, message?: string, duration?: number) => {
    showInfo(title, message, duration);
  };

  /**
   * Show a warning notification with attractive animations
   */
  const showWarningNotification = (title: string, message?: string, duration?: number) => {
    showWarning(title, message, duration);
  };

  /**
   * Show a custom notification with attractive animations
   */
  const showCustomNotification = (
    type: 'success' | 'error' | 'info' | 'warning',
    title: string,
    message?: string,
    duration?: number
  ) => {
    showNotification({ type, title, message, duration });
  };

  /**
   * Show login success notification
   */
  const showLoginSuccess = (username?: string) => {
    const title = 'Welcome Back! 🎉';
    const message = username ? `Hello ${username}, you've successfully logged in.` : 'You have successfully logged in.';
    showSuccess(title, message, 5000);
  };

  /**
   * Show login error notification
   */
  const showLoginError = (error: string) => {
    let title = 'Login Failed';
    let message = 'Please try again.';

    if (error.includes('Invalid username or password')) {
      title = 'Invalid Credentials';
      message = 'Please check your username and password.';
    } else if (error.includes('Network error')) {
      title = 'Connection Error';
      message = 'Please check your internet connection.';
    } else if (error.includes('Server error')) {
      title = 'Server Error';
      message = 'Please try again later.';
    } else if (error.includes('no assigned responsibilities')) {
      title = 'Access Denied';
      message = 'Your account has no assigned responsibilities.';
    } else {
      message = error;
    }

    showError(title, message, 6000);
  };

  /**
   * Show validation error notification
   */
  const showValidationError = (field: string) => {
    const title = 'Validation Error';
    const message = `Please fill in the ${field} field.`;
    showError(title, message, 4000);
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showInfoNotification,
    showWarningNotification,
    showCustomNotification,
    showLoginSuccess,
    showLoginError,
    showValidationError,
  };
};
