import React from 'react';
import { NavTab } from './TopBar';
import { Heart, Settings, ShieldCheck, ShieldAlert, Sparkles, Mic } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isLocked: boolean;
  intruderAlert: boolean;
  onLockClick: () => void;
  isListening: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onTabChange,
  isLocked,
  intruderAlert,
  onLockClick,
  isListening,
}) => {
  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md">
      {/* Floating Cyberpunk Capsule Dock */}
      <div className="relative rounded-full bg-black/85 backdrop-blur-2xl border-2 border-cyan-500/40 p-1.5 shadow-[0_0_30px_rgba(0,240,255,0.25)] flex items-center justify-between px-3">
        {/* Subtle Neon Underglow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-rose-500/10 to-cyan-500/10 pointer-events-none" />

        {/* 1. Wasu Core (Home / Hologram) */}
        <button
          onClick={() => onTabChange('core')}
          className={`relative px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
            currentTab === 'core'
              ? 'bg-gradient-to-r from-rose-950/80 to-pink-950/80 border border-rose-500/60 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'text-slate-400 hover:text-rose-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${currentTab === 'core' ? 'fill-rose-500 text-rose-400 animate-pulse' : ''}`} />
          <span className="text-xs font-mono font-bold tracking-wider">WASU</span>
        </button>

        {/* 2. Center Face Sentry / Security Quick Action */}
        <button
          onClick={onLockClick}
          className={`relative p-2.5 rounded-full border transition-all flex items-center justify-center ${
            intruderAlert
              ? 'bg-rose-600 border-rose-400 text-white animate-bounce shadow-[0_0_20px_#f43f5e]'
              : isLocked
              ? 'bg-rose-950 border-rose-500 text-rose-300'
              : 'bg-cyan-950/80 border-cyan-400/60 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] hover:scale-105'
          }`}
          title={isLocked ? 'Phone Locked' : 'Face Guard Active - Click to Lock'}
        >
          {intruderAlert ? (
            <ShieldAlert className="w-5 h-5 text-white" />
          ) : isLocked ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-cyan-300" />
          )}

          {/* Micro pulsing status dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </button>

        {/* 3. Settings & Memory Vault */}
        <button
          onClick={() => onTabChange('memory')}
          className={`relative px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
            currentTab === 'memory'
              ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'text-slate-400 hover:text-cyan-200'
          }`}
        >
          <Settings className={`w-4 h-4 ${currentTab === 'memory' ? 'animate-spin text-cyan-300' : ''}`} />
          <span className="text-xs font-mono font-bold tracking-wider">SETTINGS</span>
        </button>
      </div>
    </nav>
  );
};
