/**
 * Shared Types for the YTA Ski App
 */

// ============================================
// RACER & REGISTRATION
// ============================================

export interface Race {
  race_id: string;
  name: string;
}

export interface Racer {
  racer_id?: string;
  name: string;
  ldap: string;
  ski_pass: string;
  location: Location;
  race_id: string;
}

export type Location = 'ZRH' | 'WAW' | 'US' | 'DE';

// ============================================
// RUNS & LEADERBOARD
// ============================================

export interface Run {
  run_id: string;
  ski_pass: string;
  duration: number;
  start_time: Date;
  race_id: string;
}

export interface FormattedRun extends Run {
  name: string;
  ldap: string;
  location: Location;
}

export interface ConsistencyEntry {
  ski_pass: string;
  name: string;
  ldap: string;
  location: Location;
  consistency: number;
  race_id: string;
}

// ============================================
// NFC
// ============================================

export interface NfcScanResult {
  success: boolean;
  skiPass: string | null;
  rawId: string | null;
  error: string | null;
}

export interface NfcStatus {
  isSupported: boolean;
  isEnabled: boolean;
}

// ============================================
// API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateRacerRequest {
  name: string;
  ldap: string;
  ski_pass: string;
  location: Location;
  race_id: string;
}

