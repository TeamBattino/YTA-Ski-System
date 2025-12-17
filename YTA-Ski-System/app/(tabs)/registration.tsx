import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

// Race type (matching webapp)
type Race = {
  race_id: string;
  name: string;
};

// Mock races for now - will be fetched from API later
const MOCK_RACES: Race[] = [
  { race_id: '1', name: 'Alpenhunde 2025' },
  { race_id: '2', name: 'Winter Race 2025' },
];

const LOCATIONS = ['ZRH', 'WAW', 'US', 'DE'];

export default function Registration() {
  const [name, setName] = useState('');
  const [ldap, setLdap] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [skiPass, setSkiPass] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nfcMessage, setNfcMessage] = useState('');

  // NFC Scan Handler
  // Note: Real NFC only works in Development Build, not in Expo Go
  const handleNfcScan = async () => {
    try {
      // Check if we're in Expo Go (NFC won't work)
      // For now, we'll use a mock for testing
      const isExpoGo = true; // TODO: detect properly

      if (isExpoGo) {
        // Mock NFC scan for development
        setNfcMessage('Scanning...');
        setTimeout(() => {
          const mockSerialNumber = '04a2c3d4e5f6'; // Fake ski pass ID
          setSkiPass(mockSerialNumber);
          setNfcMessage(`Scan successful!\n${mockSerialNumber}`);
        }, 1000);
      } else {
        // Real NFC implementation (for Development Build)
        // TODO @Michelmahadeva: Implement with react-native-nfc-manager
        setNfcMessage('NFC scanning...');
      }
    } catch (error) {
      console.error('NFC Error:', error);
      setNfcMessage('Error scanning. Try again!');
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    // Validation
    if (ldap && ldap.includes('@')) {
      Alert.alert('Error', 'LDAP cannot contain "@"');
      return;
    }

    if (!name || !ldap || !skiPass || !selectedLocation || !selectedRace) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API call to create racer
      // const response = await api.createRacer({
      //   name,
      //   ldap,
      //   ski_pass: skiPass,
      //   location: selectedLocation,
      //   race_id: selectedRace.race_id,
      // });

      // Mock success for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Registration successful!');
      
      // Reset form
      setName('');
      setLdap('');
      setSelectedLocation(null);
      setSkiPass(null);
      setSelectedRace(null);
      setNfcMessage('');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <Text style={styles.title}>Registration</Text>

      {/* NFC Scanner */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.scanButton} onPress={handleNfcScan}>
          <Text style={styles.scanButtonText}>Scan Card with Phone</Text>
        </TouchableOpacity>
        {nfcMessage ? <Text style={styles.nfcMessage}>{nfcMessage}</Text> : null}
        {skiPass && (
          <View style={styles.skiPassBadge}>
            <Text style={styles.skiPassText}>Ski Pass: {skiPass}</Text>
          </View>
        )}
      </View>

      {/* Name Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* LDAP Input */}
      <View style={styles.section}>
        <Text style={styles.label}>Your LDAP (without @google.com)</Text>
        <TextInput
          style={styles.input}
          value={ldap}
          onChangeText={setLdap}
          placeholder="Enter your LDAP"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />
      </View>

      {/* Location Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Choose Your Site</Text>
        <View style={styles.locationGrid}>
          {LOCATIONS.map((location) => (
            <TouchableOpacity
              key={location}
              style={[
                styles.locationButton,
                selectedLocation === location && styles.locationButtonActive,
              ]}
              onPress={() => setSelectedLocation(location)}
            >
              <Text
                style={[
                  styles.locationButtonText,
                  selectedLocation === location && styles.locationButtonTextActive,
                ]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Race Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Select Race</Text>
        <View style={styles.raceList}>
          {MOCK_RACES.map((race) => (
            <TouchableOpacity
              key={race.race_id}
              style={[
                styles.raceButton,
                selectedRace?.race_id === race.race_id && styles.raceButtonActive,
              ]}
              onPress={() => setSelectedRace(race)}
            >
              <Text
                style={[
                  styles.raceButtonText,
                  selectedRace?.race_id === race.race_id && styles.raceButtonTextActive,
                ]}
              >
                {race.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={[styles.registerButton, isSubmitting && styles.registerButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Spacer at bottom */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 24,
    marginTop: 10,
  },
  section: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  scanButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nfcMessage: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  skiPassBadge: {
    marginTop: 12,
    backgroundColor: '#d1fae5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  skiPassText: {
    color: '#065f46',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  locationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  locationButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: '47%',
    alignItems: 'center',
  },
  locationButtonActive: {
    backgroundColor: '#2563eb',
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationButtonTextActive: {
    color: '#fff',
  },
  raceList: {
    gap: 10,
  },
  raceButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#60a5fa',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  raceButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  raceButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  raceButtonTextActive: {
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#60a5fa',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

