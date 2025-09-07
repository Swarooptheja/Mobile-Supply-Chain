import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { CommonIcon } from './VectorIcon';
import { useTheme } from '../context/ThemeContext';
import { createMediaSelectionModalStyles } from '../styles/MediaSelectionModal.styles';

export interface IMediaSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  title: string;
  mediaType: 'photo' | 'video';
}

/**
 * Custom MediaSelectionModal component that matches the figma design
 * Clean, centered modal with camera/gallery options
 */
export const MediaSelectionModal: React.FC<IMediaSelectionModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  title,
  mediaType,
}) => {
  const theme = useTheme();
  const styles = createMediaSelectionModalStyles(theme);

  const getIconName = () => {
    return mediaType === 'photo' ? 'camera' : 'video';
  };

  const getGalleryIconName = () => {
    return 'image';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CommonIcon icon="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalOptions}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={onCameraPress}
              activeOpacity={0.8}
            >
              <CommonIcon 
                icon={getIconName()} 
                size={24} 
                color={theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a'} 
              />
              <Text style={styles.modalOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={onGalleryPress}
              activeOpacity={0.8}
            >
              <CommonIcon 
                icon={getGalleryIconName()} 
                size={24} 
                color={theme.colors.background === '#121212' ? theme.colors.primary : '#1e3a8a'} 
              />
              <Text style={styles.modalOptionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaSelectionModal;
