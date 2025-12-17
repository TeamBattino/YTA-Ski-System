/**
 * Registration Screen
 * 
 * UI for user registration with ski pass scanning.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, Badge } from '@/components/atoms';
import { InputField, NfcScanner } from '@/components/molecules';
import { LocationSelector, RaceSelector } from '@/components/organisms';
import { Colors, Typography } from '@/constants';
import { Race, Location } from '@/types';

// Mock races - will be fetched from API later
const MOCK_RACES: Race[] = [
  { race_id: '1', name: '2026' },
  { race_id: '2', name: '2025' },
];

export default function Registration() {
  // Form State
  const [name, setName] = useState('');
  const [ldap, setLdap] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  
  // NFC State
  const [skiPass, setSkiPass] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [nfcMessage, setNfcMessage] = useState('');
  
  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Implement NFC scan
  const handleNfcScan = () => {
    setIsScanning(true);
    setNfcMessage('Scanning...');
    
    // TODO: Replace with real NFC implementation
    setTimeout(() => {
      setSkiPass('04a2c3d4e5f6');
      setNfcMessage('Scan successful!');
      setIsScanning(false);
    }, 1000);
  };

  // TODO: Implement form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // TODO: Replace with real API call
    setTimeout(() => {
      console.log('Registration data:', {
        name,
        ldap,
        location: selectedLocation,
        race: selectedRace,
        skiPass,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <Text style={styles.title}>Registration</Text>

      {/* NFC Scanner */}
      <View style={styles.section}>
        <NfcScanner
          onScan={handleNfcScan}
          isScanning={isScanning}
          skiPass={skiPass}
          message={nfcMessage}
        />
      </View>

      {/* Name Input */}
      <View style={styles.section}>
        <InputField
          label="Your Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      {/* LDAP Input */}
      <View style={styles.section}>
        <InputField
          label="Your LDAP (without @google.com)"
          value={ldap}
          onChangeText={setLdap}
          placeholder="Enter your LDAP"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Location Selector */}
      <View style={styles.section}>
        <LocationSelector
          selectedLocation={selectedLocation}
          onSelect={setSelectedLocation}
        />
      </View>

      {/* Race Selector */}
      <View style={styles.section}>
        <RaceSelector
          races={MOCK_RACES}
          selectedRace={selectedRace}
          onSelect={setSelectedRace}
        />
      </View>

      {/* Register Button */}
      <View style={styles.section}>
        <Button
          title={isSubmitting ? 'Registering...' : 'Register'}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          fullWidth
        />
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    color: Colors.primary,
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 20,
  },
  spacer: {
    height: 40,
  },
});
