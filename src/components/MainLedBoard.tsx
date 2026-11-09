import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

// Exact Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDOflQBHU_zmXZmgayqiGM4zokzJaTsqOo",
  authDomain: "ok-web-dashboared.firebaseapp.com",
  databaseURL: "https://ok-web-dashboared-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ok-web-dashboared",
  storageBucket: "ok-web-dashboared.firebasestorage.app",
  messagingSenderId: "926104626658",
  appId: "1:926104626658:web:0b33a91fd31f06c146c5bb",
  measurementId: "G-VKPQ5CHB5G"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getDatabase(app);

// Built-in Theme color maps for instant fallback or manual theme keys
export const THEME_PRESETS: Record<string, {
  name: string;
  primaryColor: string;
  glowColor: string;
  dotColor: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
}> = {
  'green': {
    name: 'Classic Green',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    dotColor: '#059669',
    borderColor: '#10b98166',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    textColor: '#34d399',
  },
  'classic-green': {
    name: 'Classic Green',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    dotColor: '#059669',
    borderColor: '#10b98166',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    textColor: '#34d399',
  },
  'amber': {
    name: 'Amber Gold',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    dotColor: '#d97706',
    borderColor: '#f59e0b66',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    textColor: '#fbbf24',
  },
  'amber-gold': {
    name: 'Amber Gold',
    primaryColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    dotColor: '#d97706',
    borderColor: '#f59e0b66',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    textColor: '#fbbf24',
  },
  'cyan': {
    name: 'Cyan Tech',
    primaryColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    dotColor: '#0891b2',
    borderColor: '#06b6d466',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    textColor: '#22d3ee',
  },
  'cyan-tech': {
    name: 'Cyan Tech',
    primaryColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    dotColor: '#0891b2',
    borderColor: '#06b6d466',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    textColor: '#22d3ee',
  },
  'purple': {
    name: 'Purple Neon',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    dotColor: '#9333ea',
    borderColor: '#a855f766',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    textColor: '#c084fc',
  },
  'purple-neon': {
    name: 'Purple Neon',
    primaryColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    dotColor: '#9333ea',
    borderColor: '#a855f766',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    textColor: '#c084fc',
  },
  'red': {
    name: 'Red Alert',
    primaryColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    dotColor: '#dc2626',
    borderColor: '#ef444466',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    textColor: '#f87171',
  },
  'red-alert': {
    name: 'Red Alert',
    primaryColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.75)',
    dotColor: '#dc2626',
    borderColor: '#ef444466',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    textColor: '#f87171',
  },
  'white': {
    name: 'Monochrome',
    primaryColor: '#f4f4f5',
    glowColor: 'rgba(244, 244, 245, 0.6)',
    dotColor: '#a1a1aa',
    borderColor: '#e4e4e766',
    badgeBg: 'rgba(244, 244, 245, 0.15)',
    textColor: '#fafafa',
  },
  'monochrome': {
    name: 'Monochrome',
    primaryColor: '#f4f4f5',
    glowColor: 'rgba(244, 244, 245, 0.6)',
    dotColor: '#a1a1aa',
    borderColor: '#e4e4e766',
    badgeBg: 'rgba(244, 244, 245, 0.15)',
    textColor: '#fafafa',
  },
  'pink': {
    name: 'Tokyo Night',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.7)',
    dotColor: '#db2777',
    borderColor: '#ec489966',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    textColor: '#f472b6',
  },
  'tokyo-night': {
    name: 'Tokyo Night',
    primaryColor: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.7)',
    dotColor: '#db2777',
    borderColor: '#ec489966',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    textColor: '#f472b6',
  },
  'orange': {
    name: 'Sunset Orange',
    primaryColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    dotColor: '#ea580c',
    borderColor: '#f9731666',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    textColor: '#fb923c',
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    primaryColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    dotColor: '#ea580c',
    borderColor: '#f9731666',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    textColor: '#fb923c',
  },
  'blue': {
    name: 'Ice Blue',
    primaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    dotColor: '#0284c7',
    borderColor: '#38bdf866',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    textColor: '#7dd3fc',
  },
  'ice-blue': {
    name: 'Ice Blue',
    primaryColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    dotColor: '#0284c7',
    borderColor: '#38bdf866',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    textColor: '#7dd3fc',
  },
  'yellow': {
    name: 'Cyber Yellow',
    primaryColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    dotColor: '#ca8a04',
    borderColor: '#eab30866',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    textColor: '#fde047',
  },
  'cyber-yellow': {
    name: 'Cyber Yellow',
    primaryColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    dotColor: '#ca8a04',
    borderColor: '#eab30866',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    textColor: '#fde047',
  },
};

interface MainLedBoardProps {
  onClose?: () => void;
  isStandalone?: boolean;
}

export const MainLedBoard: React.FC<MainLedBoardProps> = ({
  onClose,
  isStandalone = false,
}) => {
  // 1. Records from /oec_board
  const [records, setRecords] = useState<any[]>([]);

  // 2. Settings from /oec_board_settings
  const [themeName, setThemeName] = useState('Classic Green');
  const [primaryColor, setPrimaryColor] = useState('#10b981');
  const [glowColor, setGlowColor] = useState('rgba(16, 185, 129, 0.7)');
  const [dotColor, setDotColor] = useState('#059669');
  const [borderColor, setBorderColor] = useState('#10b98166');
  const [badgeBg, setBadgeBg] = useState('rgba(16, 185, 129, 0.15)');
  const [textColor, setTextColor] = useState('#34d399');

  // Animation speed settings (flip cycle & blink rate)
  const [flipIntervalSeconds, setFlipIntervalSeconds] = useState(7);
  const [blinkDuration, setBlinkDuration] = useState('0.8s');

  // Website Scrolling Text settings from /scrolling_text_settings
  const [scrollingText, setScrollingText] = useState('ATTENTION DEPARTING OVERSEAS PERSONNEL: ENSURE VALID OEC STAMP BEFORE REACHING IMMIGRATION • GATE CLOSES 20 MIN PRIOR');
  const [scrollingAnimType, setScrollingAnimType] = useState('Scroll');
  const [scrollingSpeedSec, setScrollingSpeedSec] = useState(15);

  // Pagination & UI states
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [filterMode, setFilterMode] = useState<'ACTIVE_ONLY' | 'ALL'>('ACTIVE_ONLY');
  const [isFlipping, setIsFlipping] = useState(false);

  // KST Clock helper
  const getKSTTimeString = () => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
    } catch (_) {
      return new Date().toLocaleTimeString();
    }
  };

  const [kstTime, setKstTime] = useState(getKSTTimeString);

  // REAL-TIME LISTENER: /oec_board_settings
  useEffect(() => {
    const settingsRef = ref(db, 'oec_board_settings');

    const unsubscribe = onValue(
      settingsRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val && typeof val === 'object') {
          // 1. Resolve Theme
          const themeKey = val.theme || val.themeId || 'green';
          const preset = THEME_PRESETS[themeKey] || THEME_PRESETS['green'];

          setThemeName(val.themeName || preset.name);
          setPrimaryColor(val.primaryColor || preset.primaryColor);
          setGlowColor(val.glowColor || preset.glowColor);
          setDotColor(val.dotColor || preset.dotColor);
          setBorderColor(val.borderColor || preset.borderColor);
          setBadgeBg(val.badgeBg || preset.badgeBg);
          setTextColor(val.textColor || preset.textColor);

          // 2. Resolve Speed & Animation Durations
          let flipSec = 7;
          let blinkSec = 0.8;

          if (val.flipIntervalSeconds) {
            flipSec = Number(val.flipIntervalSeconds);
          } else if (val.speed) {
            // E.g., '5s' or '7s'
            const num = parseInt(val.speed, 10);
            if (!isNaN(num)) flipSec = num;
          }

          if (val.blinkRateSeconds) {
            blinkSec = Number(val.blinkRateSeconds);
          } else {
            // Scale blink relative to flip speed
            if (flipSec <= 3) blinkSec = 0.35;
            else if (flipSec <= 5) blinkSec = 0.55;
            else if (flipSec <= 7) blinkSec = 0.8;
            else if (flipSec <= 9) blinkSec = 1.1;
            else blinkSec = 1.4;
          }

          setFlipIntervalSeconds(flipSec);
          setBlinkDuration(val.blinkDuration || val.blinkAnimationDuration || `${blinkSec}s`);
        }
      },
      (error) => {
        console.error('Error listening to /oec_board_settings:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // REAL-TIME LISTENER: /oec_board
  useEffect(() => {
    const boardRef = ref(db, 'oec_board');

    const unsubscribe = onValue(
      boardRef,
      (snapshot) => {
        const val = snapshot.val();
        const list: any[] = [];
        if (val) {
          if (Array.isArray(val)) {
            val.forEach((item, idx) => {
              if (item) list.push({ ...item, id: String(idx) });
            });
          } else if (typeof val === 'object') {
            Object.entries(val).forEach(([key, item]: [string, any]) => {
              if (item && typeof item === 'object') {
                list.push({ ...item, id: key });
              }
            });
          }
        }
        list.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
        setRecords(list);
      },
      (error) => {
        console.error('Error listening to /oec_board:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // REAL-TIME LISTENER: /scrolling_text_settings (Live Website Scrolling Text)
  useEffect(() => {
    const scrollingRef = ref(db, 'scrolling_text_settings');

    const unsubscribe = onValue(
      scrollingRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val && typeof val === 'object') {
          if (typeof val.text === 'string' && val.text.length > 0) {
            setScrollingText(val.text);
          }
          if (val.animationType) {
            setScrollingAnimType(val.animationType);
          }
          if (val.speedSeconds) {
            setScrollingSpeedSec(Number(val.speedSeconds));
          } else if (val.speedDuration) {
            const num = parseInt(val.speedDuration, 10);
            if (!isNaN(num)) setScrollingSpeedSec(num);
          } else if (val.speed) {
            if (val.speed === 'Slow') setScrollingSpeedSec(28);
            else if (val.speed === 'Fast') setScrollingSpeedSec(6);
            else setScrollingSpeedSec(15);
          }
        }
      },
      (error) => {
        console.error('Error listening to /scrolling_text_settings:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute CSS animation style for 12 scrolling animation styles scaling with selected speed
  const getTickerAnimationStyle = () => {
    const speedRatio = +(scrollingSpeedSec / 15).toFixed(2);
    const scaleSec = (baseSec: number) => {
      const s = Math.max(0.2, +(baseSec * speedRatio).toFixed(2));
      return `${s}s`;
    };

    switch (scrollingAnimType) {
      case 'Scroll':
        return { animation: `marquee-scroll ${scrollingSpeedSec}s linear infinite` };
      case 'Bounce':
        return { animation: `ticker-bounce ${scaleSec(2.5)} ease-in-out infinite alternate` };
      case 'Fade':
        return { animation: `ticker-fade ${scaleSec(2.8)} ease-in-out infinite` };
      case 'Slide Left':
        return { animation: `ticker-slide-left ${scaleSec(4.0)} cubic-bezier(0.4, 0, 0.2, 1) infinite` };
      case 'Slide Right':
        return { animation: `ticker-slide-right ${scaleSec(4.0)} cubic-bezier(0.4, 0, 0.2, 1) infinite` };
      case 'Zoom':
        return { animation: `ticker-zoom ${scaleSec(3.0)} ease-in-out infinite` };
      case 'Flip':
        return { animation: `ticker-flip ${scaleSec(3.5)} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite` };
      case 'Neon Pulse':
        return { animation: `ticker-neon-pulse ${scaleSec(1.8)} ease-in-out infinite` };
      case 'Wave':
        return { animation: `ticker-wave ${scaleSec(1.8)} ease-in-out infinite` };
      case 'Flash':
        return { animation: `ticker-flash ${scaleSec(0.8)} infinite` };
      case 'Slide Up':
        return { animation: `ticker-slide-up ${scaleSec(3.2)} ease-in-out infinite` };
      case 'Typewriter':
        return { borderRight: '2px solid currentColor', animation: `ticker-typewriter ${scaleSec(0.7)} step-end infinite` };
      default:
        return { animation: `marquee-scroll ${scrollingSpeedSec}s linear infinite` };
    }
  };

  // KST Clock interval
  useEffect(() => {
    const timer = setInterval(() => setKstTime(getKSTTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-flip page cycle based on flipIntervalSeconds
  const activeRecords = records.filter((r) => (r.status || 'Active').toLowerCase() === 'active');
  const displayRecords = filterMode === 'ACTIVE_ONLY' ? activeRecords : records;
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(displayRecords.length / pageSize));
  const paginatedRecords = displayRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
        setIsFlipping(false);
      }, 350);
    }, flipIntervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [totalPages, flipIntervalSeconds]);

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
    }
  };

  const handleClose = () => {
    try {
      window.close();
    } catch (_) {}

    if (onClose) {
      onClose();
    } else {
      if (window.location.search) {
        window.history.replaceState({}, '', window.location.pathname);
      }
      window.location.reload();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex flex-col overflow-y-auto selection:bg-transparent ${
        isStandalone ? 'relative min-h-screen' : ''
      }`}
      style={{
        backgroundColor: '#050608',
      }}
    >
      {/* Top Ribbon */}
      <div className="bg-[#0b0c10] border-b border-zinc-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Blinking signal dot with dynamic animationDuration */}
            <span 
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 0 8px ${primaryColor}`,
                animation: `pulse ${blinkDuration} infinite`,
                animationDuration: blinkDuration,
              }}
            />
            <span 
              className="text-xs uppercase font-mono font-bold tracking-widest transition-colors duration-300"
              style={{ color: textColor }}
            >
              Main LED Board Broadcast Feed
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span>|</span>
            <span>Theme: <strong style={{ color: primaryColor }}>{themeName}</strong></span>
            <span>|</span>
            <span>Flip Speed: <strong className="text-zinc-300">{flipIntervalSeconds}s</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active / All Filter */}
          <div className="flex rounded-md bg-[#13151a] border border-zinc-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => { setFilterMode('ACTIVE_ONLY'); setCurrentPage(0); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                filterMode === 'ACTIVE_ONLY' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Active ({activeRecords.length})
            </button>
            <button
              type="button"
              onClick={() => { setFilterMode('ALL'); setCurrentPage(0); }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                filterMode === 'ALL' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({records.length})
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullScreen}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#13151a] border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors cursor-pointer"
            title={isFullScreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Prominent Close Tab Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/70 border border-red-500/40 hover:border-red-500 rounded-md transition-all shadow-sm cursor-pointer group"
            title="Close LED Board tab and return to Admin Console"
          >
            <X className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span>Close Tab</span>
          </button>
        </div>
      </div>

      {/* Main Physical-Style LED Board Container */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl w-full mx-auto justify-between relative overflow-hidden">
        
        {/* LED Matrix Dot Layer (Dynamically recolors with primaryColor) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25 transition-all duration-500"
          style={{
            backgroundImage: `radial-gradient(circle, ${primaryColor} 1.2px, transparent 1.2px)`,
            backgroundSize: '14px 14px',
          }}
        />

        {/* Outer LED Board Bezel with Dynamic Theme Border */}
        <div 
          className="relative bg-[#07080a] rounded-2xl border-2 sm:border-4 p-5 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-500 overflow-hidden"
          style={{
            borderColor: primaryColor,
            boxShadow: `0 0 50px ${glowColor}, inset 0 0 30px rgba(0,0,0,0.9)`,
          }}
        >
          {/* Scanline glow */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none opacity-60 transition-colors duration-500"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}`,
            }}
          />

          <div>
            {/* Top Board Header */}
            <div 
              className="border-b-2 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500"
              style={{ borderColor }}
            >
              <div>
                <div 
                  className="font-mono-led font-black tracking-widest text-2xl sm:text-4xl uppercase drop-shadow transition-all duration-300"
                  style={{
                    color: primaryColor,
                    textShadow: `0 0 16px ${glowColor}`,
                  }}
                >
                  SOUTH KOREA & OEC INFO
                </div>
                <div className="text-zinc-400 font-mono text-xs sm:text-sm tracking-wider mt-1 flex items-center gap-2">
                  <span>DISPATCH BOARD</span>
                  <span className="text-zinc-600">•</span>
                  <span style={{ color: textColor }} className="transition-colors duration-300">
                    AUTOMATED REAL-TIME BROADCAST
                  </span>
                </div>
              </div>

              {/* Online indicator & KST Time */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-[#0e1014] px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <span 
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                    style={{
                      boxShadow: '0 0 8px #34d399',
                      animation: `pulse ${blinkDuration} infinite`,
                      animationDuration: blinkDuration,
                    }}
                  />
                  <span className="text-emerald-400 font-mono font-black text-xs sm:text-sm tracking-widest uppercase">
                    ONLINE
                  </span>
                </div>

                <div 
                  className="bg-[#0e1014] px-3.5 py-1.5 rounded-lg border flex items-center gap-2 transition-colors duration-300"
                  style={{ borderColor }}
                >
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span 
                    className="font-mono-led text-sm sm:text-xl font-bold tracking-widest transition-colors duration-300"
                    style={{
                      color: textColor,
                      textShadow: `0 0 10px ${glowColor}`,
                    }}
                  >
                    KST {kstTime}
                  </span>
                </div>
              </div>
            </div>

            {/* LED Display Column Headers */}
            <div 
              className="grid grid-cols-12 gap-3 pb-3 border-b text-xs sm:text-sm font-mono-led font-black tracking-widest uppercase transition-colors duration-300"
              style={{
                borderColor,
                color: textColor,
              }}
            >
              <div className="col-span-3 flex items-center gap-1.5">
                <span className="text-emerald-400 text-[10px] sm:text-xs">LED SIGNALS</span>
                <span>Data Info</span>
              </div>
              <div className="col-span-4">Board Info</div>
              <div className="col-span-3">Progress</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* Flight Rows with Animated Flip Transition */}
            <div 
              className={`divide-y divide-zinc-900/90 pt-1 transition-all duration-300 ${
                isFlipping ? 'opacity-30 scale-y-95 translate-y-1' : 'opacity-100 scale-y-100 translate-y-0'
              }`}
            >
              {displayRecords.length === 0 ? (
                <div className="py-20 text-center">
                  <p 
                    className="font-mono-led text-base sm:text-lg tracking-widest transition-colors duration-300"
                    style={{
                      color: primaryColor,
                      textShadow: `0 0 10px ${glowColor}`,
                    }}
                  >
                    [ NO ACTIVE FLIGHTS SCHEDULED ON LED BOARD ]
                  </p>
                  <p className="text-zinc-500 font-mono text-xs mt-2">
                    Add records from the OEC Dispatch Admin Console to populate live departures.
                  </p>
                </div>
              ) : (
                paginatedRecords.map((r, i) => {
                  const dataVal = r.dataInfo || r.oecNumber || r.oec || r.flight || 'N/A';
                  const boardVal = r.boardInfo || r.countryInfo || r.country || r.origin || '—';
                  const progress = r.progress || r.time || r.departure || '—';
                  const st = r.status || 'Active';

                  const isPending = st === 'Pending';
                  const isInactive = st === 'Inactive';

                  return (
                    <div
                      key={r.id || i}
                      className="grid grid-cols-12 gap-3 py-4 items-center font-mono-led tracking-wider text-sm sm:text-base border-b border-zinc-900/80 transition-colors"
                      style={{
                        backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                      }}
                    >
                      {/* LED Signals Data Info Column */}
                      <div 
                        className="col-span-3 font-bold text-sm sm:text-lg tracking-widest flex items-center gap-2 truncate transition-colors duration-300"
                        style={{
                          color: primaryColor,
                          textShadow: `0 0 8px ${glowColor}`,
                        }}
                      >
                        {/* Dynamic blinking LED dot */}
                        <span 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            backgroundColor: primaryColor,
                            boxShadow: `0 0 6px ${primaryColor}`,
                            animation: st === 'Active' ? `pulse ${blinkDuration} infinite` : 'none',
                            animationDuration: blinkDuration,
                          }}
                        />
                        <span className="truncate">{dataVal}</span>
                      </div>

                      {/* Board Info Column */}
                      <div className="col-span-4 font-bold text-zinc-100 uppercase tracking-wide truncate sm:text-base text-sm">
                        {boardVal}
                      </div>

                      {/* Progress / Departure */}
                      <div 
                        className="col-span-3 font-semibold tracking-wider truncate sm:text-base text-xs transition-colors duration-300"
                        style={{
                          color: textColor,
                        }}
                      >
                        {progress}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-right font-bold">
                        {isPending ? (
                          <span className="text-amber-400 px-2 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">
                            PENDING
                          </span>
                        ) : isInactive ? (
                          <span className="text-zinc-500 px-2 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs sm:text-sm">
                            INACTIVE
                          </span>
                        ) : (
                          <span 
                            className="px-2.5 py-1 rounded text-xs sm:text-sm tracking-wider font-extrabold uppercase border transition-all inline-block"
                            style={{
                              backgroundColor: badgeBg,
                              borderColor,
                              color: primaryColor,
                              textShadow: `0 0 8px ${glowColor}`,
                              boxShadow: `0 0 12px ${badgeBg}`,
                              animation: `pulse ${blinkDuration} infinite`,
                              animationDuration: blinkDuration,
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* LED Ticker Footer: Powered by /scrolling_text_settings */}
          <div 
            className="mt-8 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-zinc-500 gap-3 transition-colors duration-500"
            style={{ borderColor }}
          >
            <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
              <span 
                className="px-2 py-0.5 rounded font-bold text-[10px] uppercase border shrink-0 transition-colors duration-300 flex items-center gap-1.5"
                style={{
                  backgroundColor: badgeBg,
                  borderColor,
                  color: primaryColor,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                <span>LIVE TICKER</span>
              </span>

              {/* Viewport for animation */}
              <div className="overflow-hidden flex-1 relative h-6 flex items-center bg-black/40 rounded px-2 border border-zinc-900">
                <span 
                  key={`${scrollingAnimType}-${scrollingSpeedSec}-${scrollingText}`}
                  className="font-mono-led text-xs sm:text-sm font-bold tracking-wider inline-block whitespace-nowrap transition-colors duration-300"
                  style={{
                    color: textColor,
                    textShadow: `0 0 8px ${glowColor}`,
                    ...getTickerAnimationStyle(),
                  }}
                >
                  {scrollingText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => (p - 1 + totalPages) % totalPages)}
                    className="p-1 text-zinc-400 hover:text-white rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-zinc-400 px-1">
                    {currentPage + 1}/{totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => (p + 1) % totalPages)}
                    className="p-1 text-zinc-400 hover:text-white rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div 
                className="font-mono text-[10px] sm:text-[11px] font-semibold transition-colors duration-300 flex items-center gap-1.5"
                style={{ color: primaryColor }}
              >
                <span>SYNC: /oec_board • /scrolling_text_settings</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainLedBoard;
