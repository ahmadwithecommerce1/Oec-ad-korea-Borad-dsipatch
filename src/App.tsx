import React, { useState, useEffect } from 'react';
import AdminConsole from './AdminConsole';
import MainLedBoard from './components/MainLedBoard';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'console' | 'board'>('console');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'board') {
      setViewMode('board');
    }
  }, []);

  if (viewMode === 'board') {
    return (
      <div className="relative min-h-screen bg-black">
        {/* Floating switcher button */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setViewMode('console')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold bg-[#181a20]/95 hover:bg-[#252830] text-zinc-300 hover:text-white rounded-lg border border-zinc-700 shadow-2xl backdrop-blur-md transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Switch to Admin Console</span>
          </button>
        </div>

        <MainLedBoard
          onClose={() => setViewMode('console')}
          isStandalone={true}
        />
      </div>
    );
  }

  return (
    <AdminConsole
      onOpenBoard={() => setViewMode('board')}
    />
  );
}
