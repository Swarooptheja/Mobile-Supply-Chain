import { useNotification } from '../context/NotificationContext';

export interface IToastConfig {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

// Hook-based toast functions
export const useToast = () => {
  const { showNotification } = useNotification();

  const showToast = (config: IToastConfig): void => {
    const { type, title, message, duration = 3000 } = config;
    
    showNotification({
      type,
      title,
      message,
      duration,
    });
  };

  const showSuccessToast = (title: string, message?: string, duration?: number): void => {
    showToast({ type: 'success', title, message, duration });
  };

  const showErrorToast = (title: string, message?: string, duration?: number): void => {
    showToast({ type: 'error', title, message, duration });
  };

  const showInfoToast = (title: string, message?: string, duration?: number): void => {
    showToast({ type: 'info', title, message, duration });
  };

  const showWarningToast = (title: string, message?: string, duration?: number): void => {
    showToast({ type: 'warning', title, message, duration });
  };

  // API-specific toast messages
  const showApiErrorToast = (error: string): void => {
    if (error.includes('API call failed')) {
      showErrorToast('Login Failed', 'Invalid username or password. Please check your credentials.');
    } else if (error.includes('Failed to connect')) {
      showErrorToast('Network Error', 'Please check your internet connection and try again.');
    } else if (error.includes('Server error')) {
      showErrorToast('Server Error', 'Please try again later.');
    } else {
      showErrorToast('Error', error);
    }
  };

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    showApiErrorToast,
  };
};
