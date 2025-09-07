import { useState, useCallback } from 'react';

interface UseMediaModalsReturn {
  showPhotoModal: boolean;
  showVideoModal: boolean;
  openPhotoModal: () => void;
  openVideoModal: () => void;
  closePhotoModal: () => void;
  closeVideoModal: () => void;
  closeAllModals: () => void;
}

export const useMediaModals = (): UseMediaModalsReturn => {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const openPhotoModal = useCallback(() => {
    setShowPhotoModal(true);
  }, []);

  const openVideoModal = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const closePhotoModal = useCallback(() => {
    setShowPhotoModal(false);
  }, []);

  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowPhotoModal(false);
    setShowVideoModal(false);
  }, []);

  return {
    showPhotoModal,
    showVideoModal,
    openPhotoModal,
    openVideoModal,
    closePhotoModal,
    closeVideoModal,
    closeAllModals,
  };
};
