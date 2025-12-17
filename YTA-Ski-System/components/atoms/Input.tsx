/**
 * Input Atom
 * 
 * Basis-TextInput Component.
 */

import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants';

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function Input({ containerStyle, style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor={Colors.textPlaceholder}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});

