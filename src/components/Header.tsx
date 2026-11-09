import React from 'react';
import { Radio, Monitor, Sparkles, Sliders, Palette } from 'lucide-react';
import { BoardSettings } from '../types';
import { getThemeById } from '../constants/themes';

interface HeaderProps {
  isConnected: boolean;
  recordCount: number;
  settings: BoardSettings;
  onOpenLedPreview: () => void;
  onSeedSampleData: () => void;
  onScrollToSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  recordCount,
  settings,
  onOpenLedPreview,
  onSeedSampleData,
  onScrollToSettings,
}) => {
  const currentTheme = getThemeById(settings.themeId);

  return (
    <header className="border-b border-[#24272c] bg-[#141518]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Title & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                OEC Dispatch Admin Console
              </h1>

              {/* Exact Green Badge requested: 'Live Firebase RTDB' */}
              <div 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                title="Connected to Firebase Realtime Database: oec_board"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Firebase RTDB</span>
              </div>

              {/* Active Theme Badge */}
              <div 
                onClick={onScrollToSettings}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border cursor-pointer hover:opacity-90 transition-opacity bg-[#191b22]"
                style={{
                  borderColor: currentTheme.primaryColor,
                  color: currentTheme.textColor,
                }}
                title="Click to change theme in Display Settings"
              >
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: currentTheme.primaryColor,
                    boxShadow: `0 0 6px ${currentTheme.primaryColor}`,
                  }}
                />
                <span>Theme: {currentTheme.name}</span>
                <span className="text-[10px] text-zinc-500">({settings.flipIntervalSeconds || 7}s)</span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Broadcast direct updates & custom themes to the Main LED Board & Overseas Dispatch Display
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-end sm:self-center flex-wrap">
          {onScrollToSettings && (
            <button
              onClick={onScrollToSettings}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-[#191c22] hover:bg-[#22262e] border border-[#272a30] hover:border-zinc-600 rounded-lg transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-zinc-400" />
              <span>Display Settings</span>
            </button>
          )}

          <button
            onClick={onOpenLedPreview}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-black rounded-lg transition-all shadow-md cursor-pointer group"
            style={{
              backgroundColor: currentTheme.primaryColor,
              boxShadow: `0 0 15px ${currentTheme.glowColor}`,
            }}
          >
            <Monitor className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
            <span>Launch Main LED Board</span>
            <span className="bg-black/25 text-black px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
              {recordCount}
            </span>
          </button>

          <button
            onClick={onSeedSampleData}
            title="Populate test dispatch flights"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-[#191c22] hover:bg-[#22262e] border border-[#272a30] rounded-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Sample Data</span>
          </button>
        </div>
      </div>
    </header>
  );
};
