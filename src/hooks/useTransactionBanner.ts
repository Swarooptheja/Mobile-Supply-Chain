import { useState, useCallback, useRef, useEffect } from 'react';

export interface TransactionBannerState {
  visible: boolean;
  status: 'uploading' | 'success' | 'error' | 'offline';
  message: string;
  showProgress: boolean;
  progress: number;
  autoHide: boolean;
  autoHideDelay: number;
}

export interface TransactionBannerConfig {
  autoHide?: boolean;
  autoHideDelay?: number;
  showProgress?: boolean;
}

const DEFAULT_CONFIG: Required<TransactionBannerConfig> = {
  autoHide: true,
  autoHideDelay: 3000,
  showProgress: true,
};

export function useTransactionBanner(config: TransactionBannerConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { autoHide, autoHideDelay, showProgress } = finalConfig;

  const [bannerState, setBannerState] = useState<TransactionBannerState>({
    visible: false,
    status: 'uploading',
    message: '',
    showProgress,
    progress: 0,
    autoHide,
    autoHideDelay,
  });

  const isVisibleRef = useRef(false);
  const autoHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = null;
      }
    };
  }, []);

  // Clear existing timeout
  const clearAutoHideTimeout = useCallback(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
      autoHideTimeoutRef.current = null;
    }
  }, []);

  // Set auto-hide timeout
  const setAutoHideTimeout = useCallback((callback: () => void, delay: number) => {
    clearAutoHideTimeout();
    autoHideTimeoutRef.current = setTimeout(callback, delay);
  }, [clearAutoHideTimeout]);

  // Hide banner method (defined first to avoid dependency issues)
  const hideBanner = useCallback(() => {
    clearAutoHideTimeout();
    setBannerState(prev => ({ ...prev, visible: false }));
    isVisibleRef.current = false;
  }, [clearAutoHideTimeout]);

  // Generic method to show banner with different statuses
  const showBanner = useCallback((
    status: TransactionBannerState['status'],
    message: string,
    options: { 
      showProgress?: boolean; 
      autoHide?: boolean; 
      autoHideDelay?: number;
      progress?: number;
    } = {}
  ) => {
    const {
      showProgress: showProgressOption = status === 'uploading' ? showProgress : false,
      autoHide: autoHideOption = status === 'success' || status === 'offline' ? autoHide : false,
      autoHideDelay: autoHideDelayOption = autoHideDelay,
      progress: progressOption = status === 'success' || status === 'offline' ? 100 : 0,
    } = options;

    clearAutoHideTimeout();
    
    setBannerState({
      visible: true,
      status,
      message,
      showProgress: showProgressOption,
      progress: progressOption,
      autoHide: autoHideOption,
      autoHideDelay: autoHideDelayOption,
    });
    
    isVisibleRef.current = true;

    // Set auto-hide timeout if enabled
    if (autoHideOption) {
      setAutoHideTimeout(() => {
        hideBanner();
      }, autoHideDelayOption);
    }
  }, [showProgress, autoHide, autoHideDelay, clearAutoHideTimeout, setAutoHideTimeout, hideBanner]);

  const showUploading = useCallback((
    message: string, 
    options: { showProgress?: boolean; autoHide?: boolean; autoHideDelay?: number } = {}
  ) => {
    showBanner('uploading', message, options);
  }, [showBanner]);

  const updateProgress = useCallback((progress: number, message?: string) => {
    if (!isVisibleRef.current) return;

    setBannerState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
      message: message || prev.message,
    }));
  }, []);

  const showSuccess = useCallback((
    message: string, 
    options: { autoHide?: boolean; autoHideDelay?: number } = {}
  ) => {
    showBanner('success', message, options);
  }, [showBanner]);

  const showError = useCallback((
    message: string, 
    options: { autoHide?: boolean; autoHideDelay?: number } = {}
  ) => {
    showBanner('error', message, options);
  }, [showBanner]);

  const showOffline = useCallback((
    message: string, 
    options: { autoHide?: boolean; autoHideDelay?: number } = {}
  ) => {
    showBanner('offline', message, options);
  }, [showBanner]);

  const resetBanner = useCallback(() => {
    clearAutoHideTimeout();
    setBannerState({
      visible: false,
      status: 'uploading',
      message: '',
      showProgress,
      progress: 0,
      autoHide,
      autoHideDelay,
    });
    isVisibleRef.current = false;
  }, [showProgress, autoHide, autoHideDelay, clearAutoHideTimeout]);

  return {
    bannerState,
    showUploading,
    updateProgress,
    showSuccess,
    showError,
    showOffline,
    hideBanner,
    resetBanner,
    isVisible: () => isVisibleRef.current,
    getCurrentStatus: () => bannerState.status,
  };
}
