/**
 * LocationSelector Organism
 * 
 * Grid of location buttons for site selection.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Label } from '@/components/atoms';
import { SelectButton } from '@/components/molecules';
import { LOCATIONS } from '@/constants';
import { Location } from '@/types';

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onSelect: (location: Location) => void;
  containerStyle?: ViewStyle;
}

export function LocationSelector({
  selectedLocation,
  onSelect,
  containerStyle,
}: LocationSelectorProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Label text="Choose Your Site" />
      <View style={styles.grid}>
        {LOCATIONS.map((location) => (
          <SelectButton
            key={location}
            title={location}
            selected={selectedLocation === location}
            onPress={() => onSelect(location)}
            style={styles.button}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    minWidth: '47%',
  },
});

