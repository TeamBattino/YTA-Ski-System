import { withLayoutContext } from 'expo-router';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants';

const { Navigator } = createMaterialTopTabNavigator();

// Create a custom Tabs component with swipe support
const MaterialTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <MaterialTabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.primary,
          height: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarShowIcon: true,
        swipeEnabled: true,
      }}
      tabBarPosition="bottom"
    >
      <MaterialTabs.Screen
        name="registration"
        options={{
          title: 'Registration',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={24} name="person.badge.plus" color={color} />,
        }}
      />
      <MaterialTabs.Screen
        name="webview"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={24} name="trophy.fill" color={color} />,
        }}
      />
    </MaterialTabs>
  );
}
