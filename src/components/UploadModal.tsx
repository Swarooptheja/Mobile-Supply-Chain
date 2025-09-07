import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonIcon } from './VectorIcon';
import { scale, moderateScale } from 'react-native-size-matters';

export interface IUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  title: string;
  mediaType: 'photo' | 'video';
}

/**
 * Reusable UploadModal component for camera/gallery selection
 * Clean, consistent design that matches the app's styling
 */
export const UploadModal: React.FC<IUploadModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
  title,
  mediaType,
}) => {
  const getIconName = () => {
    return mediaType === 'photo' ? 'camera' : 'video';
  };

  const getGalleryIconName = () => {
    return mediaType === 'photo' ? 'image' : 'video';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CommonIcon icon="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalOptions}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={onCameraPress}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <CommonIcon 
                  icon={getIconName()} 
                  size={24} 
                  color="#3b82f6" 
                />
              </View>
              <Text style={styles.modalOptionText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={onGalleryPress}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconContainer}>
                <CommonIcon 
                  icon={getGalleryIconName()} 
                  size={24} 
                  color="#3b82f6" 
                />
              </View>
              <Text style={styles.modalOptionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: scale(16),
    padding: scale(24),
    marginHorizontal: scale(32),
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(24),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1f2937',
    letterSpacing: 0.3,
  },
  closeButton: {
    padding: scale(4),
  },
  modalOptions: {
    gap: scale(16),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    backgroundColor: '#f9fafb',
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: scale(12),
  },
  optionIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#374151',
  },
});

export default UploadModal;
