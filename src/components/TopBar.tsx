import React from 'react';
import { Activity } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type NavTab = 'core' | 'messages' | 'calls' | 'study' | 'battery' | 'memory';

interface TopBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  autoPilotActive: boolean;
  onToggleAutoPilot: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onTabChange,
  autoPilotActive,
  onToggleAutoPilot,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#08070d]/90 backdrop-blur-xl border-b border-rose-950/60 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5">
      {/* Zone 1: Single text element Brand Zone wordmark */}
      <div
        onClick={() => onTabChange('core')}
        className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f5d4]" />
        <span className="font-mono">WASU LOVE CYBER</span>
      </div>

      {/* Zone 2: Clean minimalist cyberpunk navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-slate-300">
        <button
          onClick={() => onTabChange('core')}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentTab === 'core' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <span>❤️</span>
          <span>Wasu Core</span>
        </button>
        <button
          onClick={() => onTabChange('memory')}
          className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentTab === 'memory' ? 'text-cyan-400 font-bold' : ''
          }`}
        >
          <span>⚙️</span>
          <span>Settings & Memory Vault</span>
        </button>
      </nav>

      {/* Zone 3: Actions - Install & Autopilot */}
      <div className="flex items-center gap-2 shrink-0">
        <PWAInstallButton />
        <button
          onClick={onToggleAutoPilot}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            autoPilotActive
              ? 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200 shadow-[0_0_12px_rgba(0,245,212,0.3)]'
              : 'bg-black/50 border-rose-950 text-rose-300 hover:bg-rose-950/40'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${autoPilotActive ? 'text-cyan-400 animate-pulse' : ''}`} />
          <span className="font-mono">{autoPilotActive ? 'CYBER ACTIVE' : 'STANDBY'}</span>
        </button>
      </div>
    </header>
  );
};
