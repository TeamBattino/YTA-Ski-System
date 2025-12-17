/**
 * Badge Atom
 * 
 * Status badge for success or error messages.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants';

interface BadgeProps {
  text: string;
  variant?: 'success' | 'error' | 'info';
  style?: ViewStyle;
}

export function Badge({ text, variant = 'info', style }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  
  // Variants
  success: {
    backgroundColor: Colors.successBackground,
  },
  error: {
    backgroundColor: Colors.errorBackground,
  },
  info: {
    backgroundColor: '#e0e7ff',
  },
  
  // Text
  text: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  text_success: {
    color: Colors.success,
  },
  text_error: {
    color: Colors.error,
  },
  text_info: {
    color: Colors.primary,
  },
});

