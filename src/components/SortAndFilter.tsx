import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView
} from 'react-native';

export interface ISortOption {
  id: string;
  label: string;
  value: string;
}

export interface IFilterOption {
  id: string;
  label: string;
  value: string;
  type: 'status' | 'date' | 'text' | 'boolean';
}

export interface ISortAndFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sortBy: string | null, filters: string[]) => void;
  sortOptions: ISortOption[];
  filterOptions: IFilterOption[];
  currentSort?: string | null;
  currentFilters?: string[];
  title?: string;
}

const SortAndFilter: React.FC<ISortAndFilterProps> = ({
  visible,
  onClose,
  onApply,
  sortOptions,
  filterOptions,
  currentSort = null,
  currentFilters = [],
  title = 'Sort & Filter'
}) => {
  const [selectedSort, setSelectedSort] = useState<string | null>(currentSort);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(currentFilters);

  const handleSortSelect = useCallback((sortValue: string) => {
    setSelectedSort(selectedSort === sortValue ? null : sortValue);
  }, [selectedSort]);

  const handleFilterToggle = useCallback((filterValue: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterValue)
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedSort, selectedFilters);
    onClose();
  }, [selectedSort, selectedFilters, onApply, onClose]);

  const handleReset = useCallback(() => {
    setSelectedSort(null);
    setSelectedFilters([]);
  }, []);

  const isApplyDisabled = selectedSort === currentSort && 
    selectedFilters.length === currentFilters.length &&
    selectedFilters.every(f => currentFilters.includes(f));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedSort === option.value && styles.selectedOptionButton
                  ]}
                  onPress={() => handleSortSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    selectedSort === option.value && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedSort === option.value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Filter Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filter By</Text>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    selectedFilters.includes(option.value) && styles.selectedOptionButton
                  ]}
                  onPress={() => handleFilterToggle(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.optionText,
                    selectedFilters.includes(option.value) && styles.selectedOptionText
                  ]}>
                    {option.label}
                  </Text>
                  {selectedFilters.includes(option.value) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton,
                isApplyDisabled && styles.disabledButton
              ]}
              onPress={handleApply}
              disabled={isApplyDisabled}
              activeOpacity={0.7}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedOptionButton: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#1e40af',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  applyButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default SortAndFilter;
