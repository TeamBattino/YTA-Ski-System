/**
 * SelectButton Molecule
 * 
 * A button with selected/unselected state.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants';

interface SelectButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export function SelectButton({ title, selected, onPress, style }: SelectButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected ? styles.selected : styles.unselected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  unselected: {
    backgroundColor: Colors.primaryLight,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  textSelected: {
    color: Colors.white,
  },
});

