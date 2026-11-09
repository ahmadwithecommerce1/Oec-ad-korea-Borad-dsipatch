export type DispatchStatus = 'Active' | 'Pending' | 'Inactive';

export interface OECRecord {
  id: string; // Firebase key
  dataInfo: string; // LED Signals Data Info (OEC / Flight)
  boardInfo: string; // Board Info (Destination / Origin)
  progress: string;
  status: DispatchStatus;
  oecNumber?: string;
  countryInfo?: string;
  updatedAt?: number;
  createdAt?: number;
  // Raw fields fallback
  [key: string]: any;
}

export interface OECFormData {
  dataInfo: string;
  boardInfo: string;
  progress: string;
  status: DispatchStatus;
  // Backwards compatibility aliases
  oecNumber?: string;
  countryInfo?: string;
}

export interface BoardTheme {
  id: string;
  name: string;
  category: string;
  primaryColor: string; // Hex e.g. #10b981
  glowColor: string; // rgba e.g. rgba(16, 185, 129, 0.6)
  dotColor: string; // Hex for LED matrix dots
  borderColor: string;
  badgeBg: string;
  textColor: string;
  headerAccent: string;
}

export interface BoardSettings {
  themeId: string;
  animationSpeed: number; // 1 (Slow) to 5 (Fast), default 3
  flipIntervalSeconds: number; // 12s (Slow) -> 7s (Normal) -> 3s (Fast)
  blinkRateSeconds: number; // 1.5s (Slow) -> 0.8s (Normal) -> 0.4s (Fast)
  updatedAt?: number;
}
