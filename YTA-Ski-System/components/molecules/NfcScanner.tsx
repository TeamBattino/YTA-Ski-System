/**
 * NfcScanner Molecule
 * 
 * NFC scan button with status display.
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Button, Badge } from '@/components/atoms';
import { Colors } from '@/constants';

interface NfcScannerProps {
  onScan: () => void;
  isScanning: boolean;
  skiPass: string | null;
  message: string;
  containerStyle?: ViewStyle;
}

export function NfcScanner({
  onScan,
  isScanning,
  skiPass,
  message,
  containerStyle,
}: NfcScannerProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Button
        title={isScanning ? 'Scanning...' : '📱 Scan Card with Phone'}
        onPress={onScan}
        loading={isScanning}
        disabled={isScanning}
        fullWidth
      />

      {message && !skiPass && (
        <Text style={styles.message}>{message}</Text>
      )}

      {skiPass && (
        <Badge
          text={`✅ Ski Pass: ${skiPass}`}
          variant="success"
          style={styles.badge}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  badge: {
    marginTop: 12,
  },
});

