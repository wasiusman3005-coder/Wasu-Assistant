import React, { useState, useEffect } from "react";
import {
  Activity,
  Terminal,
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  Database,
  Eye,
  EyeOff,
  Mic,
  Shield,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";
import { QUANTUM_FIELDS_DATA } from "../../data/jarvisCatalog";

interface VectorHudGuiThemeProps {
  userProfile: UserProfile;
  customization: DashboardCustomization;
  coherence: number;
  screenWorkMinutes: number;
  onOpenVoiceModal: () => void;
  onOpenAppsMatrix: () => void;
  onOpenModule?: (moduleId: any) => void;
  onOpenSettings: () => void;
  onTriggerHealthLockdown: () => void;
  onLockScreen?: () => void;
  onToggleAwayMode?: () => void;
  onSelectTheme: (themeId: JarvisInterfaceThemeId) => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const VectorHudGuiTheme: React.FC<VectorHudGuiThemeProps> = ({
  customization,
  coherence,
  onOpenVoiceModal,
  onOpenAppsMatrix,
  onOpenModule,
  onOpenSettings,
  onLockScreen,
  onToggleAwayMode,
  onSelectTheme,
  language,
  voiceGender,
}) => {
  const [radarDegree, setRadarDegree] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const [eqBars, setEqBars] = useState<number[]>([
    22, 34, 48, 42, 60, 74, 65, 82, 92, 85, 76, 68, 84, 72, 64, 52, 46, 58, 44, 38, 30, 24,
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarDegree((prev) => (prev + 1.4) % 360);
      setWaveOffset((prev) => (prev + 4) % 100);
      setEqBars((prev) =>
        prev.map((val) => Math.min(100, Math.max(15, Math.floor(val + (Math.random() * 14 - 7)))))
      );
    }, 85);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#020510] text-slate-200 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Outer Chamfered Vector Wireframe Border (Exact match to vector-hud-gui-interface-004_e93adaf2.jpg) */}
      <div className="fixed inset-2 md:inset-3 border border-cyan-400/35 rounded-2xl pointer-events-none z-0">
        <div className="absolute top-0 left-12 right-44 h-px bg-gradient-to-r from-cyan-400/70 via-slate-500/40 to-cyan-400/70" />
        <div className="absolute top-0 right-4 bg-[#020510] px-2 -mt-2 text-[10px] font-orbitron font-bold text-white tracking-widest flex items-center gap-1.5">
          <span>USER INTERFACE</span>
          <span className="px-1 bg-white text-black font-extrabold">4</span>
        </div>
      </div>

      {/* Top HUD Controls Strip */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">
            Q-NEXUS // VECTOR HUD GUI 4
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
            COHERENCE {coherence.toFixed(2)}%
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Theme Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.25)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>THEMES (7)</span>
            </button>

            {isThemePickerOpen && (
              <div className="absolute right-0 top-10 w-72 bg-[#02040f]/95 border-2 border-cyan-400 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1.5 backdrop-blur-2xl">
                <div className="text-[10px] font-bold text-cyan-400 px-2 py-1 border-b border-slate-800">
                  SWITCH INTERFACE THEME
                </div>
                {ALL_JARVIS_THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playBeepConfirm();
                      onSelectTheme(t.id);
                      setIsThemePickerOpen(false);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-xl text-left text-xs transition cursor-pointer ${
                      t.id === (customization.activeInterfaceTheme || "vector_hud_gui")
                        ? "bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold"
                        : "hover:bg-slate-900 text-slate-300"
                    }`}
                  >
                    <img src={t.imagePath} alt={t.name} className="w-8 h-8 rounded-lg object-cover border border-slate-700" />
                    <div>
                      <div className="font-bold text-[11px]">{t.name}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[170px]">{t.tagline}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsPrivacyCloak(!isPrivacyCloak);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 cursor-pointer ${
              isPrivacyCloak ? "bg-red-500 text-black font-bold" : "bg-slate-900 border border-slate-800 text-slate-300"
            }`}
          >
            {isPrivacyCloak ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isPrivacyCloak ? "CLOAK ON" : "CLOAK"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenVoiceModal();
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">VOICE</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAppsMatrix();
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">APPS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
            title="Settings & Themes"
          >
            <Settings className="w-4 h-4" />
          </button>

          {onToggleAwayMode && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onToggleAwayMode();
              }}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-700 text-amber-300 cursor-pointer"
              title="Away Mode"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}

          {onLockScreen && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playAlert();
                onLockScreen();
              }}
              className="px-2.5 py-1 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>LOCK</span>
            </button>
          )}
        </div>
      </header>
      <div className="my-1.5 relative z-20">
        <QuantumFieldsBar
          activeThemeId={customization.activeInterfaceTheme || "vector_hud_gui"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN VECTOR HUD WORKSPACE (Exact 3-Zone layout of vector-hud-gui-interface-004_e93adaf2.jpg) */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 items-center">
        {/* LEFT COLUMN (lg:col-span-3): SIDE ELEMENT 7, SIDE ELEMENT 10, DATA TRACKER */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* SIDE ELEMENT : 7 (Dual Oscilloscope Waves inside white/slate double technical frame) */}
          <div
            onClick={() => onOpenModule?.("desktop")}
            className="p-3 rounded-lg bg-[#030714]/90 border border-slate-400/50 hover:border-cyan-400 transition cursor-pointer relative"
          >
            <div className="flex items-center justify-between text-[9px] text-slate-200 mb-1.5 border-b border-slate-700 pb-1">
              <span className="font-bold tracking-wider">SIDE ELEMENT : 7</span>
              <Activity className="w-3 h-3 text-rose-400" />
            </div>
            <div className="h-20 w-full bg-[#02040c] border border-slate-800 rounded p-1.5 flex flex-col justify-around overflow-hidden">
              <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path
                  d={`M 0 20 Q 12 ${6 + Math.sin(waveOffset * 0.25) * 12}, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="1.2"
                />
                <path
                  d={`M 0 20 Q 12 ${32 - Math.cos(waveOffset * 0.2) * 10}, 25 20 T 50 20 T 75 20 T 100 20 T 125 20 T 150 20 T 175 20 T 200 20`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.9"
                  opacity="0.7"
                />
              </svg>
              <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path
                  d={`M 0 20 Q 15 ${34 - Math.sin(waveOffset * 0.22) * 12}, 30 20 T 60 20 T 90 20 T 120 20 T 150 20 T 180 20 T 200 20`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
          </div>

          {/* SIDE ELEMENT : 10 (Input / Online / Output Sliders + Mini Rotary Dials) */}
          <div
            onClick={() => onOpenModule?.("automation")}
            className="p-3 rounded-lg bg-[#030714]/90 border border-slate-400/50 hover:border-cyan-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-[9px] text-slate-200 mb-2 border-b border-slate-700 pb-1">
              <span className="font-bold tracking-wider">SIDE ELEMENT : 10</span>
              <Terminal className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-8 space-y-2 text-[9px]">
                {[
                  { label: "INPUT", pct: "84%", color: "bg-cyan-400" },
                  { label: "ONLINE", pct: "96%", color: "bg-sky-300" },
                  { label: "OUTPUT", pct: "72%", color: "bg-white" },
                ].map((row, idx) => (
                  <div key={idx}>
                    <span className="inline-block px-1 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-[8px] font-bold mb-0.5">
                      {row.label}
                    </span>
                    <div className="w-full h-1 bg-slate-800 rounded-full relative">
                      <div className={`h-full ${row.color}`} style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Mini 6-circle rotary grid on right of sliders (Exact from reference) */}
              <div className="col-span-4 grid grid-cols-2 gap-1.5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-5 h-5 rounded-full border border-slate-400/60 flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DATA TRACKER BLOCK + RULER */}
          <div className="p-3 rounded-lg bg-[#030714]/80 border border-slate-700/80 space-y-2">
            <span className="inline-block px-1.5 py-0.5 bg-cyan-400/20 border border-cyan-400/60 text-[9px] text-cyan-300 font-bold">
              DATA TRACKER
            </span>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              {isPrivacyCloak
                ? "[VECTOR MANIFEST REDACTED :: 0x99FA...MASKED]"
                : "Vector HUD telemetry node synchronization verified across local buses. Precision reticle lock enabled with zero thermal drift."}
            </p>
            {/* Precision Scale Ruler */}
            <div className="pt-1 border-b border-cyan-400/50 flex justify-between text-[7px] text-cyan-400/70">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1.5 w-px bg-cyan-400/60" />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN (lg:col-span-3): VECTOR SUB-RADAR NODES & SLIDER MATRIX */}
        <div className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center gap-5">
          {/* Top Trio of Circular Radar Nodes */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300/70 border-dashed flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-cyan-400/60" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full border border-slate-300/70 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-300/70 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border border-slate-400/70 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border border-dashed border-cyan-400" />
            </div>
          </div>

          {/* Center-Left Large Circle Ring */}
          <div
            onClick={() => onOpenModule?.("maps")}
            className="relative w-28 h-28 rounded-full border-2 border-white/80 border-dashed flex items-center justify-center cursor-pointer hover:scale-105 transition"
            title="Open Geospatial Maps Radar"
          >
            <div className="w-16 h-16 rounded-full border border-cyan-400/60 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-300 animate-ping" />
            </div>
          </div>

          {/* Middle Slider Trackers */}
          <div className="w-full p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 space-y-1.5 text-[9px]">
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-bold">INPUT</span>
              <div className="w-32 h-1 bg-slate-800">
                <div className="w-3/4 h-full bg-white" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-bold">ONLINE</span>
              <div className="w-32 h-1 bg-slate-800">
                <div className="w-11/12 h-full bg-cyan-400" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cyan-300 font-bold">OUTPUT</span>
              <div className="w-32 h-1 bg-slate-800">
                <div className="w-2/3 h-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT LARGE SECTION (lg:col-span-6): MASSIVE MULTI-RING TARGETING RADAR RETICLE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[420px]">
          <div
            onClick={() => {
              soundEffects.playShockwave();
              speechService.speak(
                "Vector GUI targeting reticle calibrated. Multi-spectral telemetry active.",
                { lang: language, gender: voiceGender }
              );
            }}
            className="relative w-80 h-80 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] rounded-full flex items-center justify-center cursor-pointer group"
            title="Click to Ping Vector Radar"
          >
            {/* Outer Precision Ticks & Orange Arc Segment */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              {/* Outer thin technical frame */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth="0.4" />
              {/* Orange prominent arc on right (Exact match to vector-hud-gui-interface-004_e93adaf2.jpg) */}
              <circle
                cx="50"
                cy="50"
                r="44.5"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.6"
                strokeDasharray="78 210"
                strokeDashoffset="-12"
              />
              {/* Thick white segmented arcs */}
              <circle
                cx="50"
                cy="50"
                r="41.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeDasharray="45 35 30 35 55 40"
                style={{ transformOrigin: "50% 50%", transform: `rotate(${radarDegree * 0.6}deg)` }}
              />
              {/* Bright Cyan Arc */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="1.8"
                strokeDasharray="65 200"
                strokeDashoffset="115"
              />
              {/* Bright Lime-Green Arc */}
              <circle
                cx="50"
                cy="50"
                r="34"
                fill="none"
                stroke="#84cc16"
                strokeWidth="2.2"
                strokeDasharray="110 180"
                strokeDashoffset="105"
              />
            </svg>

            {/* Rotating Inner Fine Tick Ring */}
            <div
              className="absolute inset-10 rounded-full border border-dashed border-slate-300/60"
              style={{ transform: `rotate(-${radarDegree}deg)` }}
            />

            {/* Teal & Cyan Concentric Crosshair Bullseye Core */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-teal-950/50 border-2 border-teal-400/70 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.5)]">
              <div className="absolute inset-x-3 top-1/2 h-px bg-teal-300/50" />
              <div className="absolute inset-y-3 left-1/2 w-px bg-teal-300/50" />
              <div className="w-20 h-20 rounded-full border border-teal-300/70 flex items-center justify-center bg-cyan-950/40">
                <div className="w-9 h-9 rounded-full border border-cyan-300 flex items-center justify-center bg-teal-400/20">
                  <Zap className="w-4 h-4 text-cyan-200 animate-pulse" />
                </div>
              </div>
              <span className="text-[8px] font-orbitron font-bold text-cyan-200 mt-1">
                {coherence.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM BAR: KEYPAD MATRIX + ROTARY NODES + MINI SPLIT DIALS + HISTOGRAM CHART */}
      <footer className="relative z-20 pt-3 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        {/* Bottom-Left 6x3 Keypad Matrix + 5 Inline Knobs + Split Dials */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 6x3 Matrix Blocks (Quick Module Launchers) */}
          <div className="grid grid-cols-6 gap-1 p-1.5 rounded border border-slate-700/80 bg-slate-950/80">
            {["desktop", "study", "records", "health", "finance", "automation", "communication", "maps", "devices", "desktop", "automation", "maps"].map(
              (mod, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenModule?.(mod);
                  }}
                  className={`w-4 h-2.5 rounded-[2px] border transition cursor-pointer ${
                    i % 4 === 0
                      ? "bg-cyan-500/40 border-cyan-400 hover:bg-cyan-400"
                      : "bg-slate-800/80 border-slate-600 hover:border-cyan-400"
                  }`}
                  title={`Open ${mod}`}
                />
              )
            )}
          </div>

          {/* 5 Inline Knobs */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-700/80 bg-slate-950/80">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-4 h-4 rounded-full border border-cyan-400/60 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            ))}
          </div>

          {/* Dual Mini Concentric Sub-Dials (Orange/White/Cyan) */}
          <div className="flex items-center gap-2">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="35 100" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#00f5ff" strokeWidth="3" strokeDasharray="35 100" strokeDashoffset="-50" />
            </svg>
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="40 100" />
              <circle cx="18" cy="18" r="10" fill="none" stroke="#00f5ff" strokeWidth="3" strokeDasharray="55 100" />
              <circle cx="18" cy="18" r="6" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="65 100" />
            </svg>
          </div>
        </div>

        {/* Bottom-Right Chamfered Histogram Equalizer Box */}
        <div className="p-2 rounded-lg border border-slate-500/60 bg-slate-950/90 flex items-center gap-3">
          <div className="text-[8px] text-cyan-300 font-bold leading-tight">
            <div>SPECTRUM</div>
            <div className="text-slate-400">HISTOGRAM</div>
          </div>
          <div className="flex items-end gap-0.5 h-9 w-40 bg-[#020510] p-1 border border-slate-800">
            {eqBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-700 via-cyan-400 to-teal-200 transition-all duration-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
