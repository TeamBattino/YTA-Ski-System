/**
 * RaceSelector Organism
 * 
 * Dropdown to select a race.
 */

import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Label } from '@/components/atoms';
import { Colors } from '@/constants';
import { Race } from '@/types';

interface RaceSelectorProps {
  races: Race[];
  selectedRace: Race | null;
  onSelect: (race: Race) => void;
  containerStyle?: ViewStyle;
  placeholder?: string;
}

export function RaceSelector({
  races,
  selectedRace,
  onSelect,
  containerStyle,
  placeholder = 'Select a race...',
}: RaceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (race: Race) => {
    onSelect(race);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Label text="Select Race" />
      
      {/* Dropdown Trigger */}
      <TouchableOpacity
        style={[styles.dropdown, isOpen && styles.dropdownOpen]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          !selectedRace && styles.placeholderText
        ]}>
          {selectedRace ? selectedRace.name : placeholder}
        </Text>
        <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Race</Text>
            
            <FlatList
              data={races}
              keyExtractor={(item) => item.race_id}
              renderItem={({ item }) => {
                const isSelected = selectedRace?.race_id === item.race_id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}>
                      {item.name}
                    </Text>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  
  // Dropdown Trigger
  dropdown: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownOpen: {
    borderColor: Colors.primary,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  placeholderText: {
    color: Colors.textPlaceholder,
  },
  arrow: {
    fontSize: 12,
    color: Colors.textMuted,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 340,
    maxHeight: '70%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },

  // Options
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight + '20', // 20% opacity
  },
  optionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  // Cancel Button
  cancelButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
