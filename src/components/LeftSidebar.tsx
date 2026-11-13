import React, { useState, useEffect } from "react";
import { Atom, Settings, LayoutGrid, Lock, Laptop, Shield, Mic, Activity, Clock, Terminal, Cpu, Radio, Sparkles, ChevronRight } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { DashboardCustomization } from "../types";
import { AutoMorphingQuantumLogo, QuantumThemeColor } from "./AutoMorphingQuantumLogo";

interface LeftSidebarProps {
  coherence: number;
  customization: DashboardCustomization;
  currentTheme?: QuantumThemeColor;
  onThemeUpdate?: (theme: QuantumThemeColor) => void;
  onLockScreen: () => void;
  onToggleAwayMode: () => void;
  onOpenAppsMatrix: () => void;
  onOpenVoiceModal: () => void;
  onOpenSettings: () => void;
  isAwayMode: boolean;
  screenWorkMinutes: number;
  onTriggerHealthLockdown: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  coherence,
  customization,
  currentTheme,
  onThemeUpdate,
  onLockScreen,
  onToggleAwayMode,
  onOpenAppsMatrix,
  onOpenVoiceModal,
  onOpenSettings,
  isAwayMode,
  screenWorkMinutes,
  onTriggerHealthLockdown,
}) => {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

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
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside
      className="relative z-30 w-full md:w-80 md:h-screen md:sticky md:top-0 shrink-0 bg-slate-950/95 border-b md:border-b-0 md:border-r flex flex-col justify-between p-4 backdrop-blur-2xl text-slate-100 select-none overflow-y-auto font-rajdhani shadow-2xl transition-all duration-700"
      style={{
        borderRightColor: currentTheme ? `${currentTheme.hex}40` : "rgba(6, 182, 212, 0.25)",
        boxShadow: currentTheme ? `0 0 35px ${currentTheme.glow}15` : undefined,
      }}
    >
      {/* Top Brand & Commander Clearance */}
      <div className="space-y-4">
        {/* Auto-Morphing UHD Brand Header */}
        <div
          className="p-3 rounded-2xl bg-slate-900/90 border flex items-center gap-3 shadow-lg transition-all duration-700"
          style={{
            borderColor: currentTheme ? `${currentTheme.hex}50` : "rgba(6, 182, 212, 0.4)",
            boxShadow: currentTheme ? `0 0 20px ${currentTheme.glow}30` : undefined,
          }}
        >
          {customization.customLogoUrl ? (
            <img
              src={customization.customLogoUrl}
              alt="Logo"
              className="w-11 h-11 rounded-xl object-cover border border-cyan-400"
            />
          ) : (
            <AutoMorphingQuantumLogo
              size="sm"
              onThemeUpdate={onThemeUpdate}
              showCaption={false}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-orbitron font-extrabold text-base tracking-wider transition-colors duration-700 truncate"
                style={{ color: currentTheme?.hex || "#06b6d4" }}
              >
                Q-NEXUS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-700">
                UHD 4K
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                style={{ backgroundColor: currentTheme?.hex || "#06b6d4" }}
              ></span>
              <span className="truncate">{currentTheme?.styleName || "Tachyon Reactor Core"}</span>
            </div>
          </div>
        </div>

        {/* Commander Identity Card with Live Clock */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold text-slate-200">COMMANDER: WASI</span>
            </span>
            <span className="text-[10px] text-cyan-400">{dateStr}</span>
          </div>
          <div className="text-xl font-orbitron font-bold text-cyan-300 glow-text-cyan tracking-wider">
            {timeStr}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Clearance: Level 5</span>
            <span className="text-emerald-400">Bio-Link Active</span>
          </div>
        </div>

        {/* Quantum Telemetry Stack */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-1">
            System Telemetry
          </div>

          {/* Qubit Coherence */}
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Qubit Coherence</span>
            </span>
            <span className="font-bold text-cyan-300">{coherence.toFixed(2)}%</span>
          </div>

          {/* PC Screen Work Time & Health Guard */}
          <button
            type="button"
            onClick={onTriggerHealthLockdown}
            title="Ergonomic Screen Rest Monitor - Click to test mandatory 5m rest"
            className="w-full p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-400/50 flex items-center justify-between text-xs font-mono transition cursor-pointer text-left group"
          >
            <span className="flex items-center gap-1.5 text-slate-400 group-hover:text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>PC Screen Time</span>
            </span>
            <span className="font-bold text-amber-400">
              {screenWorkMinutes}m / {customization.continuousWorkLimitMinutes}m
            </span>
          </button>

          {/* Security & Network Status */}
          <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Cryptographic Core</span>
            </span>
            <span className="text-purple-400 font-bold">AES-4096</span>
          </div>
        </div>

        {/* Navigation Action Hub */}
        <div className="space-y-2 pt-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 px-1">
            Operation Controls
          </div>

          {/* Apps Matrix Button */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAppsMatrix();
            }}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-slate-200 hover:text-cyan-300 font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-between cursor-pointer group shadow-lg shadow-black/50"
          >
            <span className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
              <span>APPLICATIONS MATRIX</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 group-hover:text-cyan-300 transition" />
          </button>

          {/* Voice Jarvis Trigger */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playBeepConfirm();
              onOpenVoiceModal();
            }}
            className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-500/40 hover:border-blue-400 text-slate-200 hover:text-blue-300 font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-between cursor-pointer group shadow-lg shadow-black/50"
          >
            <span className="flex items-center gap-2.5">
              <Mic className="w-4 h-4 text-blue-400 group-hover:scale-110 transition" />
              <span>VOICE JARVIS</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/80">
              "Hi Nexus"
            </span>
          </button>

          {/* Away Mode Screensaver */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onToggleAwayMode();
            }}
            className={`w-full p-3 rounded-2xl border font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-between cursor-pointer group ${
              isAwayMode
                ? "bg-amber-500 text-black border-amber-400 animate-pulse"
                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4 text-amber-400" />
              <span>AWAY AUTO-PILOT</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Standby</span>
          </button>

          {/* Customize HUD Settings */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="w-full p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-400 text-slate-300 hover:text-purple-300 font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-between cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-purple-400 group-hover:rotate-45 transition" />
              <span>CUSTOMIZE HUD</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">Themes</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Lock Core Action Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            soundEffects.playAlert();
            onLockScreen();
          }}
          className="w-full py-3 px-4 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-200 font-orbitron font-bold text-xs tracking-wider transition flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-red-950/40"
        >
          <Lock className="w-4 h-4" />
          <span>LOCK QUANTUM CORE</span>
        </button>
      </div>
    </aside>
  );
};
