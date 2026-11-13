import React, { useState, useEffect } from "react";
import { Atom, Settings, LayoutGrid, Lock, Laptop, Shield } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { DashboardCustomization } from "../types";

interface TopNavbarProps {
  coherence: number;
  customization: DashboardCustomization;
  onLockScreen?: () => void;
  onToggleAwayMode: () => void;
  onOpenAppsMatrix: () => void;
  onOpenSettings: () => void;
  isAwayMode: boolean;
  screenWorkMinutes: number;
  onTriggerHealthLockdown: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  coherence,
  customization,
  onLockScreen,
  onToggleAwayMode,
  onOpenAppsMatrix,
  onOpenSettings,
  isAwayMode,
  screenWorkMinutes,
  onTriggerHealthLockdown,
}) => {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-8 py-3 flex items-center justify-between gap-4 text-slate-100 select-none">
      {/* Brand & Commander Identity */}
      <div className="flex items-center gap-3">
        {customization.customLogoUrl ? (
          <img
            src={customization.customLogoUrl}
            alt="Custom Logo"
            className="w-9 h-9 rounded-xl object-cover border border-cyan-400 shadow-md shadow-cyan-950"
          />
        ) : (
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-950/60">
            <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: "14s" }} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-bold text-sm md:text-base tracking-wider text-cyan-400 glow-text-cyan">
              Q-NEXUS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              JARVIS OS
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">COMMANDER: WASI</span>
            <span className="opacity-40">•</span>
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Middle Minimalist Telemetry Pill */}
      <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>QUBIT:</span>
          <span className="font-bold text-cyan-300">{coherence.toFixed(2)}%</span>
        </div>
        <span className="text-slate-700">|</span>
        <button
          onClick={onTriggerHealthLockdown}
          title="Ergonomic Screen Rest Monitor - Click to test mandatory rest"
          className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 cursor-pointer"
        >
          <span>PC WORK:</span>
          <span className="font-bold">{screenWorkMinutes}m / {customization.continuousWorkLimitMinutes}m</span>
          {screenWorkMinutes >= customization.continuousWorkLimitMinutes - 5 && (
            <span className="text-[10px] bg-red-950 text-red-400 px-1 rounded animate-pulse">REST DUE</span>
          )}
        </button>
        <span className="text-slate-700">|</span>
        <div className="text-slate-400 flex items-center gap-1">
          <span>AES-4096:</span>
          <span className="text-purple-400 font-bold">SECURE</span>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2.5">
        {/* Apps Matrix Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenAppsMatrix();
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 font-mono text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-black"
          title="Open Unified Applications & Operations Matrix"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">APPS MATRIX</span>
        </button>

        {/* Away Mode Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onToggleAwayMode();
          }}
          title="Away Mode: Auto-Pilot while you're away from PC"
          className={`p-2 rounded-xl text-xs font-mono border transition flex items-center gap-1.5 cursor-pointer ${
            isAwayMode
              ? "bg-amber-500 text-black border-amber-400 font-bold animate-pulse"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
          }`}
        >
          <Laptop className="w-4 h-4" />
        </button>

        {/* Settings & Customization Button */}
        <button
          onClick={() => {
            soundEffects.playClick();
            onOpenSettings();
          }}
          title="Quantum Customization & Settings Hub"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-400 text-slate-300 hover:text-purple-300 transition cursor-pointer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Security Lock Button */}
        <button
          onClick={() => {
            soundEffects.playAlert();
            onLockScreen?.();
          }}
          title="Lock Quantum Core (Lock screen with username & password)"
          className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition cursor-pointer"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
