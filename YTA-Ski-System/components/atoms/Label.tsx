/**
 * Label Atom
 * 
 * Label for form fields.
 */

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors, Typography } from '@/constants';

interface LabelProps {
  text: string;
  style?: TextStyle;
}

export function Label({ text, style }: LabelProps) {
  return <Text style={[styles.label, style]}>{text}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});

