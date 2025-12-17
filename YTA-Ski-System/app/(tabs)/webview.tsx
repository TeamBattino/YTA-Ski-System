/**
 * WebView Screen
 * 
 * Displays a web page inside the app.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  return (
    <WebView 
      source={{ uri: 'https://ski.batti.no/dashboard/leaderboard' }} 
      style={styles.container} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
