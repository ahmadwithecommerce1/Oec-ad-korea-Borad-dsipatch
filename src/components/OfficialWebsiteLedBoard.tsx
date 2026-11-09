/**
 * Official Website Main LED Board Component
 * 
 * Drop this complete component directly into your official website or host it standalone.
 * It connects to your Firebase RTDB and listens to:
 * 1) /oec_board (records)
 * 2) /oec_board_settings (themes, LED colors, and animationDuration speed)
 */
import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// Your exact Firebase configuration
const firebaseConfig = {
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
const database = getDatabase(app);

export interface OfficialBoardProps {
  className?: string;
}

export const OfficialWebsiteLedBoard: React.FC<OfficialBoardProps> = ({ className = '' }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [settings, setSettings] = useState({
    themeId: 'classic-green',
    themeName: 'Classic Green',
    primaryColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    dotColor: '#059669',
    borderColor: '#10b98166',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    textColor: '#34d399',
    flipIntervalSeconds: 7,
    blinkRateSeconds: 0.8,
    blinkAnimationDuration: '0.8s',
  });

  const [currentPage, setCurrentPage] = useState(0);
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

  // 1. Real-time settings listener (/oec_board_settings)
  useEffect(() => {
    const settingsRef = ref(database, 'oec_board_settings');
    const unsubSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && typeof data === 'object') {
        setSettings((prev) => ({
          ...prev,
          themeId: data.themeId || prev.themeId,
          themeName: data.themeName || prev.themeName,
          primaryColor: data.primaryColor || prev.primaryColor,
          glowColor: data.glowColor || prev.glowColor,
          dotColor: data.dotColor || prev.dotColor,
          borderColor: data.borderColor || prev.borderColor,
          badgeBg: data.badgeBg || prev.badgeBg,
          textColor: data.textColor || prev.textColor,
          flipIntervalSeconds: Number(data.flipIntervalSeconds) || prev.flipIntervalSeconds,
          blinkRateSeconds: Number(data.blinkRateSeconds) || prev.blinkRateSeconds,
          blinkAnimationDuration: data.blinkAnimationDuration || `${data.blinkRateSeconds || 0.8}s`,
        }));
      }
    });

    return () => unsubSettings();
  }, []);

  // 2. Real-time records listener (/oec_board)
  useEffect(() => {
    const recordsRef = ref(database, 'oec_board');
    const unsubRecords = onValue(recordsRef, (snapshot) => {
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
      setRecords(list);
    });

    return () => unsubRecords();
  }, []);

  // 3. Clock interval
  useEffect(() => {
    const timer = setInterval(() => setKstTime(getKSTTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Auto flip pagination based on settings.flipIntervalSeconds
  const activeRecords = records.filter((r) => (r.status || 'Active').toLowerCase() === 'active');
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(activeRecords.length / pageSize));
  const currentRecords = activeRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
        setIsFlipping(false);
      }, 350);
    }, (settings.flipIntervalSeconds || 7) * 1000);

    return () => clearInterval(interval);
  }, [totalPages, settings.flipIntervalSeconds]);

  return (
    <div 
      className={`w-full min-h-[600px] bg-black text-white p-4 sm:p-8 flex flex-col justify-between font-mono relative overflow-hidden select-none ${className}`}
      style={{
        backgroundColor: '#050608',
      }}
    >
      {/* Dynamic LED dot background reacting to primaryColor */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 transition-all duration-500"
        style={{
          backgroundImage: `radial-gradient(circle, ${settings.primaryColor} 1.2px, transparent 1.2px)`,
          backgroundSize: '14px 14px',
        }}
      />

      {/* LED Bezel Outer Frame */}
      <div 
        className="relative bg-[#07080a] rounded-2xl border-2 sm:border-4 p-5 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-500"
        style={{
          borderColor: settings.primaryColor,
          boxShadow: `0 0 50px ${settings.glowColor}, inset 0 0 30px rgba(0,0,0,0.9)`,
        }}
      >
        {/* Header matching user's exact screenshot */}
        <div 
          className="border-b-2 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500"
          style={{ borderColor: settings.borderColor }}
        >
          <div>
            <div 
              className="font-black tracking-widest text-2xl sm:text-4xl uppercase drop-shadow transition-all duration-300"
              style={{
                color: settings.primaryColor,
                textShadow: `0 0 16px ${settings.glowColor}`,
              }}
            >
              SOUTH KOREA & OEC INFO
            </div>
            <div className="text-zinc-400 text-xs sm:text-sm tracking-wider mt-1 flex items-center gap-2">
              <span>DISPATCH BOARD</span>
              <span className="text-zinc-600">•</span>
              <span style={{ color: settings.textColor }} className="transition-colors duration-300">
                AUTOMATED REAL-TIME BROADCAST
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0e1014] px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <span 
                className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                style={{
                  boxShadow: '0 0 8px #34d399',
                  animation: `pulse ${settings.blinkRateSeconds}s infinite`,
                  animationDuration: settings.blinkAnimationDuration,
                }}
              />
              <span className="text-emerald-400 font-black text-xs sm:text-sm tracking-widest uppercase">
                ONLINE
              </span>
            </div>

            <div 
              className="bg-[#0e1014] px-3.5 py-1.5 rounded-lg border transition-colors duration-300"
              style={{ borderColor: settings.borderColor }}
            >
              <span 
                className="text-base sm:text-xl font-bold tracking-widest transition-colors duration-300"
                style={{
                  color: settings.textColor,
                  textShadow: `0 0 10px ${settings.glowColor}`,
                }}
              >
                KST {kstTime}
              </span>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div 
          className="grid grid-cols-12 gap-3 pb-3 border-b text-xs sm:text-sm font-black tracking-widest uppercase transition-colors duration-300"
          style={{
            borderColor: settings.borderColor,
            color: settings.textColor,
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

        {/* Rows with animated flip */}
        <div 
          className={`divide-y divide-zinc-900/90 pt-1 transition-all duration-300 ${
            isFlipping ? 'opacity-30 scale-y-95 translate-y-1' : 'opacity-100 scale-y-100 translate-y-0'
          }`}
        >
          {currentRecords.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-sm">
              [ NO ACTIVE RECORDS BROADCASTING ]
            </div>
          ) : (
            currentRecords.map((r, i) => {
              const dataVal = r.dataInfo || r.oecNumber || r.oec || r.flight || 'N/A';
              const boardVal = r.boardInfo || r.countryInfo || r.country || r.origin || '—';
              const progressVal = r.progress || r.time || r.departure || '—';

              return (
                <div 
                  key={r.id || i}
                  className="grid grid-cols-12 gap-3 py-4 items-center text-sm sm:text-base border-b border-zinc-900/80"
                >
                  <div 
                    className="col-span-3 font-bold text-sm sm:text-lg tracking-widest flex items-center gap-2 truncate transition-colors duration-300"
                    style={{
                      color: settings.primaryColor,
                      textShadow: `0 0 8px ${settings.glowColor}`,
                    }}
                  >
                    {/* Blinking signal dot with dynamic animationDuration */}
                    <span 
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: settings.primaryColor,
                        boxShadow: `0 0 6px ${settings.primaryColor}`,
                        animation: `pulse ${settings.blinkRateSeconds}s infinite`,
                        animationDuration: settings.blinkAnimationDuration,
                      }}
                    />
                    <span className="truncate">{dataVal}</span>
                  </div>

                  <div className="col-span-4 font-bold text-zinc-100 uppercase tracking-wide truncate sm:text-base text-sm">
                    {boardVal}
                  </div>

                  <div 
                    className="col-span-3 font-semibold tracking-wider truncate sm:text-base text-xs transition-colors duration-300"
                    style={{ color: settings.textColor }}
                  >
                    {progressVal}
                  </div>

                  <div className="col-span-2 text-right font-bold">
                    <span 
                      className="px-2.5 py-1 rounded text-xs sm:text-sm tracking-wider font-extrabold uppercase border transition-all inline-block"
                      style={{
                        backgroundColor: settings.badgeBg,
                        borderColor: settings.borderColor,
                        color: settings.primaryColor,
                        textShadow: `0 0 8px ${settings.glowColor}`,
                        boxShadow: `0 0 12px ${settings.badgeBg}`,
                        animation: `pulse ${settings.blinkRateSeconds}s infinite`,
                        animationDuration: settings.blinkAnimationDuration,
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div 
          className="mt-8 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-500 gap-3 transition-colors duration-500"
          style={{ borderColor: settings.borderColor }}
        >
          <div className="truncate">
            <span 
              className="px-2 py-0.5 rounded font-bold text-[10px] uppercase border mr-2 transition-colors duration-300"
              style={{
                backgroundColor: settings.badgeBg,
                borderColor: settings.borderColor,
                color: settings.primaryColor,
              }}
            >
              LIVE
            </span>
            <span>AUTO-FLIP EVERY {settings.flipIntervalSeconds}s • BLINK: {settings.blinkAnimationDuration}</span>
          </div>

          <div style={{ color: settings.primaryColor }} className="text-right text-[11px] font-semibold transition-colors duration-300">
            SYNCED: /oec_board_settings
          </div>
        </div>
      </div>
    </div>
  );
};
