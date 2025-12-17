/**
 * InputField Molecule
 * 
 * Combines Label + Input into a form field.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Label, Input } from '@/components/atoms';

interface InputFieldProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
}

export function InputField({ label, containerStyle, ...inputProps }: InputFieldProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Label text={label} />
      <Input {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

