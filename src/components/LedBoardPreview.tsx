import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Radio, Activity, Volume2, Clock } from 'lucide-react';
import { OECRecord } from '../types';

interface LedBoardPreviewProps {
  records: OECRecord[];
  onClose: () => void;
}

export const LedBoardPreview: React.FC<LedBoardPreviewProps> = ({ records, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [filterMode, setFilterMode] = useState<'ACTIVE_ONLY' | 'ALL'>('ACTIVE_ONLY');
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const displayRecords = filterMode === 'ACTIVE_ONLY'
    ? records.filter((r) => (r.status || 'Active').toLowerCase() === 'active')
    : records;

  return (
    <div className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8 overflow-y-auto ${isFullScreen ? 'p-0 sm:p-0' : ''}`}>
      {/* Container simulating high-res airport LED display */}
      <div className={`max-w-6xl w-full mx-auto bg-[#08090b] border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col overflow-hidden my-auto relative ${isFullScreen ? 'h-screen rounded-none border-0' : ''}`}>
        
        {/* Top Control Bar (Admin only) */}
        <div className="bg-[#121318] px-4 py-3 border-b border-[#232730] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-emerald-400">
                LED Board Live Feed Monitor
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              | Real-Time Matrix Mode
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex rounded-md bg-[#191b22] border border-[#272b36] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('ACTIVE_ONLY')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  filterMode === 'ACTIVE_ONLY'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Active Only ({records.filter(r => (r.status || 'Active').toLowerCase() === 'active').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  filterMode === 'ALL'
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All Flights ({records.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 text-zinc-400 hover:text-white bg-[#191b22] border border-[#272b36] rounded-md transition-colors cursor-pointer"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Display'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-red-400 bg-[#191b22] border border-[#272b36] rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Actual LED Board Surface */}
        <div className="p-6 sm:p-10 flex-1 bg-black relative overflow-hidden flex flex-col justify-between select-none">
          {/* Subtle LED Grid texture background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          <div>
            {/* LED Board Header */}
            <div className="border-b-2 border-emerald-500/50 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-emerald-400 font-mono-led font-black tracking-widest text-2xl sm:text-3xl uppercase drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]">
                  OVERSEAS DISPATCH BOARD
                </div>
                <div className="text-zinc-400 font-mono text-xs sm:text-sm tracking-wider mt-1">
                  OFFICIAL EMPLOYMENT CERTIFICATE (OEC) • DEPARTURE STATUS
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="bg-[#0e1014] px-4 py-2 rounded-lg border border-emerald-500/30">
                  <span className="text-[10px] text-zinc-500 block uppercase font-mono">SYS TIME</span>
                  <span className="text-amber-400 font-mono-led text-xl font-bold tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                    {currentTime}
                  </span>
                </div>
              </div>
            </div>

            {/* LED Display Column Headers */}
            <div className="grid grid-cols-12 gap-3 pb-3 border-b border-zinc-800 text-xs sm:text-sm font-mono-led font-bold tracking-widest text-emerald-500/90 uppercase">
              <div className="col-span-3">OEC / FLIGHT</div>
              <div className="col-span-4">DESTINATION / ORIGIN</div>
              <div className="col-span-3">PROGRESS / TIME</div>
              <div className="col-span-2 text-right">STATUS</div>
            </div>

            {/* LED Flight Rows */}
            <div className="divide-y divide-zinc-900/90 pt-1">
              {displayRecords.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-amber-400 font-mono-led text-base tracking-widest drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                    [ NO ACTIVE FLIGHTS SCHEDULED ON LED BOARD ]
                  </p>
                  <p className="text-zinc-500 font-mono text-xs mt-2">
                    Submit records with 'Active' status to display them here in real-time.
                  </p>
                </div>
              ) : (
                displayRecords.map((r, i) => {
                  const oec = r.oecNumber || (r as any).oec || (r as any).flight || 'N/A';
                  const country = r.countryInfo || (r as any).country || (r as any).origin || '—';
                  const progress = r.progress || (r as any).time || (r as any).departure || '—';
                  const st = r.status || 'Active';

                  const isPending = st === 'Pending';
                  const isInactive = st === 'Inactive';

                  return (
                    <div
                      key={r.id || i}
                      className="grid grid-cols-12 gap-3 py-3.5 items-center font-mono-led tracking-wider text-sm sm:text-base hover:bg-emerald-950/20 transition-colors"
                    >
                      {/* OEC Column */}
                      <div className="col-span-3 font-bold text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{oec}</span>
                      </div>

                      {/* Country Info */}
                      <div className="col-span-4 font-semibold text-zinc-100 uppercase tracking-wide truncate">
                        {country}
                      </div>

                      {/* Progress / Departure */}
                      <div className="col-span-3 text-amber-300 font-medium drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] truncate">
                        {progress}
                      </div>

                      {/* Status */}
                      <div className="col-span-2 text-right font-bold">
                        {isPending ? (
                          <span className="text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/50 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                            PENDING
                          </span>
                        ) : isInactive ? (
                          <span className="text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-xs sm:text-sm">
                            INACTIVE
                          </span>
                        ) : (
                          <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/60 text-xs sm:text-sm drop-shadow-[0_0_10px_rgba(16,185,129,0.9)] animate-pulse-subtle">
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

          {/* LED Ticker Footer */}
          <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] uppercase">
                TICKER
              </span>
              <span className="text-zinc-400 animate-pulse truncate">
                ALL OVERSEAS CONTRACT WORKERS MUST VERIFY OEC CLEARANCE BEFORE BOARDING • GATE CLOSES 20 MIN PRIOR
              </span>
            </div>
            <div className="shrink-0 text-emerald-500/70 hidden sm:block">
              CONNECTED: RTDB [oec_board]
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
