import { BoardTheme, BoardSettings } from '../types';

export const LED_THEMES: BoardTheme[] = [
  {
    id: 'classic-green',
    name: 'Classic Green',
    category: 'Vintage',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    dotColor: '#059669',
    borderColor: '#10b98166',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    textColor: '#34d399',
    headerAccent: '#059669',
  },
  {
    id: 'amber-gold',
    name: 'Amber Gold',
    category: 'Airport Classic',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    dotColor: '#d97706',
    borderColor: '#f59e0b66',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    textColor: '#fbbf24',
    headerAccent: '#d97706',
  },
  {
    id: 'cyan-tech',
    name: 'Cyan Tech',
    category: 'Sci-Fi Air Traffic',
    primaryColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    dotColor: '#0891b2',
    borderColor: '#06b6d466',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    textColor: '#22d3ee',
    headerAccent: '#0891b2',
  },
  {
    id: 'purple-neon',
    name: 'Purple Neon',
    category: 'Synthwave',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    dotColor: '#9333ea',
    borderColor: '#a855f766',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    textColor: '#c084fc',
    headerAccent: '#9333ea',
  },
  {
    id: 'red-alert',
    name: 'Red Alert',
    category: 'Tactical Urgent',
    primaryColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    dotColor: '#dc2626',
    borderColor: '#ef444466',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    textColor: '#f87171',
    headerAccent: '#dc2626',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'Minimalist Clean',
    primaryColor: '#f4f4f5',
    glowColor: 'rgba(244, 244, 245, 0.6)',
    dotColor: '#a1a1aa',
    borderColor: '#e4e4e766',
    badgeBg: 'rgba(244, 244, 245, 0.15)',
    textColor: '#fafafa',
    headerAccent: '#71717a',
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'Cyberpunk Pink',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.7)',
    dotColor: '#db2777',
    borderColor: '#ec489966',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    textColor: '#f472b6',
    headerAccent: '#be185d',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    category: 'Industrial',
    primaryColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    dotColor: '#ea580c',
    borderColor: '#f9731666',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    textColor: '#fb923c',
    headerAccent: '#c2410c',
  },
  {
    id: 'ice-blue',
    name: 'Ice Blue',
    category: 'Arctic Polar',
    primaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    dotColor: '#0284c7',
    borderColor: '#38bdf866',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    textColor: '#7dd3fc',
    headerAccent: '#0369a1',
  },
  {
    id: 'lime-velocity',
    name: 'Lime Velocity',
    category: 'High-Voltage',
    primaryColor: '#84cc16',
    glowColor: 'rgba(132, 204, 22, 0.7)',
    dotColor: '#65a30d',
    borderColor: '#84cc1666',
    badgeBg: 'rgba(132, 204, 22, 0.15)',
    textColor: '#a3e635',
    headerAccent: '#4d7c0f',
  },
  {
    id: 'cyber-yellow',
    name: 'Cyber Yellow',
    category: 'Hazard Safety',
    primaryColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    dotColor: '#ca8a04',
    borderColor: '#eab30866',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    textColor: '#fde047',
    headerAccent: '#a16207',
  },
  {
    id: 'phosphor-crt',
    name: 'Phosphor CRT',
    category: '1980s Retro Mainframe',
    primaryColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.75)',
    dotColor: '#16a34a',
    borderColor: '#22c55e66',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    textColor: '#4ade80',
    headerAccent: '#15803d',
  },
];

export const DEFAULT_BOARD_SETTINGS: BoardSettings = {
  themeId: 'classic-green',
  animationSpeed: 3, // 1 to 5: 1=Slow, 3=Normal, 5=Fast
  flipIntervalSeconds: 7, // 7-second flip animation as requested
  blinkRateSeconds: 0.8,
};

// Calculate flipInterval and blinkRate from speed slider (1 to 5)
export function calculateSpeedParameters(speed: number): { flipInterval: number; blinkRate: number; label: string } {
  // Speed 1 (Slow): flip = 12s, blink = 1.4s
  // Speed 2 (Moderate-Slow): flip = 9s, blink = 1.1s
  // Speed 3 (Normal / Standard): flip = 7s, blink = 0.8s (User requested 7-second flip)
  // Speed 4 (Brisk): flip = 5s, blink = 0.55s
  // Speed 5 (Fast): flip = 3s, blink = 0.35s
  switch (speed) {
    case 1:
      return { flipInterval: 12, blinkRate: 1.4, label: 'Slow (12s flip / 1.4s blink)' };
    case 2:
      return { flipInterval: 9, blinkRate: 1.1, label: 'Moderate (9s flip / 1.1s blink)' };
    case 3:
      return { flipInterval: 7, blinkRate: 0.8, label: 'Normal (7s flip / 0.8s blink)' };
    case 4:
      return { flipInterval: 5, blinkRate: 0.55, label: 'Fast (5s flip / 0.5s blink)' };
    case 5:
      return { flipInterval: 3, blinkRate: 0.35, label: 'Ultra Fast (3s flip / 0.3s blink)' };
    default:
      return { flipInterval: 7, blinkRate: 0.8, label: 'Normal (7s flip / 0.8s blink)' };
  }
}

export function getThemeById(themeId: string): BoardTheme {
  const found = LED_THEMES.find((t) => t.id === themeId);
  return found || LED_THEMES[0];
}
