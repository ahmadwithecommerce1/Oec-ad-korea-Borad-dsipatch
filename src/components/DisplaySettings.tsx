import React from 'react';
import { 
  Palette, 
  Sliders, 
  Sparkles, 
  Check, 
  Radio, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  Clock 
} from 'lucide-react';
import { BoardSettings, BoardTheme } from '../types';
import { LED_THEMES, calculateSpeedParameters } from '../constants/themes';

interface DisplaySettingsProps {
  settings: BoardSettings;
  onUpdateSettings: (newSettings: Partial<BoardSettings>) => Promise<void>;
  isSaving: boolean;
  lastSavedAt: number | null;
}

export const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  settings,
  onUpdateSettings,
  isSaving,
  lastSavedAt,
}) => {
  const currentSpeed = settings.animationSpeed || 3;
  const speedDetails = calculateSpeedParameters(currentSpeed);
  const selectedTheme = LED_THEMES.find((t) => t.id === settings.themeId) || LED_THEMES[0];

  const handleSelectTheme = (themeId: string) => {
    onUpdateSettings({ themeId });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const details = calculateSpeedParameters(val);
    onUpdateSettings({
      animationSpeed: val,
      flipIntervalSeconds: details.flipInterval,
      blinkRateSeconds: details.blinkRate,
    });
  };

  const handleReset = () => {
    onUpdateSettings({
      themeId: 'classic-green',
      animationSpeed: 3,
      flipIntervalSeconds: 7,
      blinkRateSeconds: 0.8,
    });
  };

  return (
    <div className="bg-[#16181d] border border-[#24272c] rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Dynamic ambient header accent reflecting selected theme color */}
      <div 
        className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${selectedTheme.primaryColor}, transparent)`,
          boxShadow: `0 0 15px ${selectedTheme.primaryColor}`,
        }}
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-[#24272c] gap-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-300"
            style={{
              backgroundColor: selectedTheme.badgeBg,
              borderColor: selectedTheme.borderColor,
            }}
          >
            <Palette 
              className="w-4 h-4 transition-colors duration-300" 
              style={{ color: selectedTheme.primaryColor }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-display">
                Display Settings (Main LED Board)
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#111215] text-zinc-400 border border-[#2b2f38]">
                RTDB: /oec_board_settings
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live broadcast customization: Colors, matrix dots, and animation speed for the public LED board
            </p>
          </div>
        </div>

        {/* Live sync badge & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {isSaving ? (
            <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              <Radio className="w-3 h-3 animate-spin" />
              <span>Broadcasting...</span>
            </span>
          ) : (
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Synced Live</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded bg-[#20232a] border border-[#2d313a] hover:border-zinc-500 transition-colors cursor-pointer"
            title="Reset theme and speed to default"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. 12 LED Themes Selection Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-bold text-zinc-200 tracking-wider uppercase font-display">
                1. Select LED Theme (12 Themes)
              </label>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Active: <strong style={{ color: selectedTheme.primaryColor }}>{selectedTheme.name}</strong>
            </span>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {LED_THEMES.map((theme) => {
              const isSelected = theme.id === settings.themeId;

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelectTheme(theme.id)}
                  className={`p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer relative group flex flex-col justify-between overflow-hidden ${
                    isSelected
                      ? 'bg-[#1e222a] shadow-lg scale-[1.02]'
                      : 'bg-[#101114] hover:bg-[#191c22] border-[#252830] hover:border-zinc-600'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primaryColor : undefined,
                    boxShadow: isSelected ? `0 0 15px ${theme.glowColor}` : undefined,
                  }}
                >
                  {/* Miniature LED dots preview bar */}
                  <div className="flex items-center gap-1 mb-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                      style={{ 
                        backgroundColor: theme.primaryColor,
                        boxShadow: `0 0 6px ${theme.primaryColor}`,
                      }}
                    />
                    <span 
                      className="w-2 h-2 rounded-full opacity-70"
                      style={{ backgroundColor: theme.dotColor }}
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full opacity-40"
                      style={{ backgroundColor: theme.primaryColor }}
                    />

                    {isSelected && (
                      <span className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-black/60 text-white">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {theme.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-sans truncate">
                      {theme.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. LED Animation Speed Control Slider */}
        <div className="bg-[#101114] border border-[#252830] rounded-lg p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <label className="text-xs font-bold text-zinc-200 tracking-wider uppercase font-display">
                2. LED Animation Speed Control
              </label>
            </div>

            {/* Live pulsing simulation dot matching blink rate */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Live Pulse Preview:</span>
              <div className="flex items-center gap-1.5 bg-[#181a20] px-2.5 py-1 rounded border border-[#282c35]">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: selectedTheme.primaryColor,
                    boxShadow: `0 0 8px ${selectedTheme.primaryColor}`,
                    animation: `pulse ${speedDetails.blinkRate}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                  }}
                />
                <span className="text-[11px] font-mono text-zinc-300">
                  {speedDetails.blinkRate}s blink
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Range Slider */}
            <div className="relative py-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={currentSpeed}
                onChange={handleSpeedChange}
                className="w-full h-2.5 bg-[#20232a] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                style={{
                  accentColor: selectedTheme.primaryColor,
                }}
              />
            </div>

            {/* Slider Scale Labels: Slow to Fast */}
            <div className="flex items-center justify-between text-xs font-mono font-medium text-zinc-400 px-1">
              <span className={currentSpeed === 1 ? 'font-bold text-white' : ''}>
                🐢 Slow (12s)
              </span>
              <span className={currentSpeed === 2 ? 'font-bold text-white' : ''}>
                Moderate (9s)
              </span>
              <span className={currentSpeed === 3 ? 'font-bold text-emerald-400' : 'text-zinc-400'}>
                ⚡ Standard (7s Flip)
              </span>
              <span className={currentSpeed === 4 ? 'font-bold text-white' : ''}>
                Brisk (5s)
              </span>
              <span className={currentSpeed === 5 ? 'font-bold text-white' : ''}>
                🚀 Fast (3s)
              </span>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-[#16181f] p-3 rounded-lg border border-[#232731] gap-2">
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Controls the <strong>7-second flip cycle</strong> and the <strong>blinking indicator LEDs</strong> on the physical & digital board.
              </span>
            </div>
            <div className="shrink-0 text-emerald-400 font-mono font-semibold text-right">
              {speedDetails.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
