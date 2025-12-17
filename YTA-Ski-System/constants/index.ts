/**
 * App-wide Constants
 */

import { Location } from '@/types';

// ============================================
// LOCATIONS
// ============================================

export const LOCATIONS: Location[] = ['ZRH', 'WAW', 'US', 'DE'];

// ============================================
// COLORS
// ============================================

export const Colors = {
  // Primary
  primary: '#2563eb',
  primaryLight: '#60a5fa',
  primaryDark: '#1d4ed8',

  // Background
  background: '#f9fafb',
  backgroundWhite: '#ffffff',

  // Text
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  textPlaceholder: '#9ca3af',

  // Borders
  border: '#d1d5db',
  borderLight: '#e5e7eb',

  // Status
  success: '#065f46',
  successBackground: '#d1fae5',
  error: '#dc2626',
  errorBackground: '#fee2e2',

  // Disabled
  disabled: '#9ca3af',

  // White
  white: '#ffffff',
};

// ============================================
// SPACING
// ============================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// ============================================
// TYPOGRAPHY
// ============================================

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
  },
};

// ============================================
// API
// ============================================

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

