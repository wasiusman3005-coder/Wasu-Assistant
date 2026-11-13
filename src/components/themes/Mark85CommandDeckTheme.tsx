import React, { useState, useEffect } from "react";
import {
  Shield,
  Activity,
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  Crosshair,
  Globe,
  Mic,
  Eye,
  EyeOff,
  Monitor,
  GraduationCap,
  Database,
  Heart,
  DollarSign,
  Terminal,
  MapPin,
  Smartphone,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";

interface Mark85CommandDeckThemeProps {
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

export const Mark85CommandDeckTheme: React.FC<Mark85CommandDeckThemeProps> = ({
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
  const [turbineDegree, setTurbineDegree] = useState(0);
  const [reticleDegree, setReticleDegree] = useState(0);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const [core1, setCore1] = useState(86);
  const [core2, setCore2] = useState(91);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurbineDegree((prev) => (prev + 2.5) % 360);
      setReticleDegree((prev) => (prev + 2) % 360);
      setCore1((prev) => Math.min(98, Math.max(72, Math.round(prev + (Math.random() * 6 - 3)))));
      setCore2((prev) => Math.min(98, Math.max(72, Math.round(prev + (Math.random() * 6 - 3)))));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const tacticalDockIcons = [
    { label: "PC Suite", icon: Monitor, id: "desktop" },
    { label: "Study", icon: GraduationCap, id: "study" },
    { label: "Vault", icon: Database, id: "records" },
    { label: "Health", icon: Heart, id: "health" },
    { label: "Finance", icon: DollarSign, id: "finance" },
    { label: "Auto", icon: Terminal, id: "automation" },
    { label: "Comm", icon: Zap, id: "communication" },
    { label: "Maps", icon: MapPin, id: "maps" },
    { label: "Devices", icon: Smartphone, id: "devices" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#01040c] text-slate-100 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Subtle HUD Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,212,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,212,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* TOP HEADER: JARVIS TITLE CENTER + POWER LEVEL + CONTROLS (Exact from images_be3c8b70.jpg) */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-cyan-500/30">
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-cyan-400 font-bold">JARVIS OS VER 3.0.7</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">STATUS: ONLINE</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-orbitron font-extrabold text-cyan-300 tracking-[0.25em] drop-shadow-[0_0_20px_#00d4ff]">
            JARVIS
          </h1>
          <div className="text-[8px] text-cyan-400/80 tracking-widest">
            JUST A RATHER VERY INTELLIGENT SYSTEM
          </div>
        </div>

        {/* Header Right Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.3)]"
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
                      t.id === (customization.activeInterfaceTheme || "mark_85_deck")
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
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer ${
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
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
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
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
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
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
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
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-700 text-amber-300 cursor-pointer"
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
              className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>LOCK</span>
            </button>
          )}
        </div>
      </header>
      <div className="my-1.5 relative z-20">
        <QuantumFieldsBar
          activeThemeId={customization.activeInterfaceTheme || "mark_85_deck"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN COMMAND DECK (3-COLUMN LAYOUT EXACT MATCH TO images_be3c8b70.jpg) */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 items-center">
        {/* LEFT COLUMN (lg:col-span-3): 5 STACKED TECHNICAL TELEMETRY CARDS */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          {/* 1. SYSTEM DIAGNOSTICS */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 flex items-center justify-between">
            <div>
              <div className="text-[9px] text-cyan-400 font-bold">SYSTEM DIAGNOSTICS</div>
              <div className="text-lg font-orbitron font-extrabold text-white">100%</div>
              <div className="text-[8px] text-slate-400">SYSTEM HEALTH</div>
            </div>
            <div className="w-11 h-11 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#00d4ff]">
              <Activity className="w-5 h-5 text-cyan-300" />
            </div>
          </div>

          {/* 2. CPU USAGE (4 CORES) */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40">
            <div className="text-[9px] text-cyan-400 font-bold mb-1.5">CPU USAGE</div>
            <div className="space-y-1 text-[9px]">
              {[
                { name: "CORE 1", val: core1 },
                { name: "CORE 2", val: core2 },
                { name: "CORE 3", val: 84 },
                { name: "CORE 4", val: 79 },
              ].map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-11 text-slate-400">{c.name}</span>
                  <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 shadow-[0_0_6px_#00d4ff]" style={{ width: `${c.val}%` }} />
                  </div>
                  <span className="w-7 text-right text-cyan-300 font-bold">{c.val}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. MEMORY USAGE */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40">
            <div className="text-[9px] text-cyan-400 font-bold mb-1.5">MEMORY USAGE</div>
            <div className="space-y-1 text-[9px]">
              <div className="flex items-center gap-2">
                <span className="w-9 text-slate-400">RAM</span>
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[78%]" />
                </div>
                <span className="text-cyan-300 font-bold">78%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-9 text-slate-400">SWAP</span>
                <div className="flex-1 h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[62%]" />
                </div>
                <span className="text-blue-300 font-bold">62%</span>
              </div>
            </div>
          </div>

          {/* 4. NETWORK STATUS + BLUE MOUNTAIN WAVEFORM */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40">
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-cyan-400 font-bold">NETWORK STATUS</span>
              <span className="text-emerald-400 font-bold">{isPrivacyCloak ? "CLOAKED" : "126.6 Mbps"}</span>
            </div>
            <svg className="w-full h-10" preserveAspectRatio="none" viewBox="0 0 120 40">
              <polygon
                points="0,40 10,28 22,32 34,14 48,26 60,10 74,24 88,16 102,28 112,20 120,40"
                fill="rgba(0, 212, 255, 0.25)"
                stroke="#00d4ff"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          {/* 5. ENVIRONMENT */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 flex justify-between text-[9px]">
            <span>TEMP <strong className="text-cyan-300">27°C</strong></span>
            <span>HUMIDITY <strong className="text-emerald-300">45%</strong></span>
            <span>PRESS <strong className="text-blue-300">1013</strong></span>
          </div>
        </div>

        {/* CENTER COLUMN (lg:col-span-6): MASSIVE ARC REACTOR TURBINE + MINI HOLOGRAMS + SYSTEM STATUS */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          {/* Top Mini Metrics: Power Level & Uptime */}
          <div className="w-full flex justify-between px-4 mb-2 text-[10px]">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30">
              <div className="text-slate-400 text-[8px]">POWER LEVEL</div>
              <div className="text-base font-orbitron font-bold text-white">100%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-right">
              <div className="text-slate-400 text-[8px]">ACTIVE PROCESSES</div>
              <div className="text-base font-orbitron font-bold text-cyan-300">128 • {coherence.toFixed(1)}%</div>
            </div>
          </div>

          {/* Massive Glowing Arc Reactor Turbine Core (Exact match to center of images_be3c8b70.jpg) */}
          <div
            onClick={() => {
              soundEffects.playShockwave();
              speechService.speak("Mark 85 Arc Reactor turbine synchronized. All systems operational.", {
                lang: language,
                gender: voiceGender,
              });
            }}
            className="relative w-72 h-72 md:w-88 md:h-88 rounded-full flex items-center justify-center cursor-pointer group"
          >
            {/* Outer segmented turbine blades SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_25px_rgba(0,212,255,0.8)]"
              viewBox="0 0 200 200"
              style={{ transform: `rotate(${turbineDegree}deg)` }}
            >
              <circle cx="100" cy="100" r="94" fill="none" stroke="rgba(0,212,255,0.35)" strokeWidth="2" />
              <circle cx="100" cy="100" r="82" fill="none" stroke="#00d4ff" strokeWidth="14" strokeDasharray="16 8" />
              <circle cx="100" cy="100" r="64" fill="none" stroke="#bae6fd" strokeWidth="6" strokeDasharray="10 6" />
            </svg>

            {/* Counter-Rotating Inner Ring */}
            <div
              className="absolute inset-14 md:inset-16 rounded-full border-2 border-dashed border-cyan-200/80"
              style={{ transform: `rotate(-${turbineDegree * 1.5}deg)` }}
            />

            {/* Blazing White-Blue Arc Singularity Hub */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-sky-900 via-white to-cyan-100 border-4 border-cyan-300 flex flex-col items-center justify-center shadow-[0_0_65px_#00d4ff]">
              <Zap className="w-10 h-10 text-sky-950 animate-pulse" />
              <span className="text-[9px] font-orbitron font-extrabold text-sky-950 mt-1">MARK LXXXV</span>
            </div>
          </div>

          {/* Flanking Wireframe Mini Holograms (Globe / Telemetry) + Bottom Operational Bar */}
          <div className="mt-3 w-full max-w-md flex flex-col items-center gap-2">
            <div className="w-full p-2 rounded-xl bg-slate-950/90 border border-cyan-400/50 flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(0,212,255,0.25)]">
              <div className="text-[9px] text-cyan-300 font-orbitron font-bold tracking-widest">
                SYSTEM STATUS: ALL SYSTEMS OPERATIONAL
              </div>
              <div className="flex gap-1 w-full justify-center px-2">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2 rounded-xs bg-cyan-400 shadow-[0_0_6px_#00f5ff]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (lg:col-span-3): WEAPONS SYSTEMS + WIREFRAME MARK LXXXV SUIT + TARGETING SYSTEM */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          {/* 1. WEAPONS SYSTEMS */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-[9px]">
            <div className="text-cyan-400 font-bold mb-1.5 border-b border-slate-800 pb-0.5">
              WEAPONS SYSTEMS
            </div>
            <div className="space-y-1">
              <div className="flex justify-between"><span className="text-slate-300">MISSILES</span><span className="text-cyan-300 font-bold">12</span></div>
              <div className="flex justify-between"><span className="text-slate-300">UNIBEAM</span><span className="text-emerald-400 font-bold">100%</span></div>
              <div className="flex justify-between"><span className="text-slate-300">REPULSORS</span><span className="text-emerald-400 font-bold">100%</span></div>
              <div className="flex justify-between"><span className="text-slate-300">SMART GUNS</span><span className="text-cyan-300 font-bold">100%</span></div>
            </div>
          </div>

          {/* 2. SUIT DIAGNOSTICS WITH HOLOGRAPHIC WIREFRAME MARK LXXXV BODY FIGURE */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40">
            <div className="flex justify-between text-[9px] mb-1.5 border-b border-slate-800 pb-0.5">
              <span className="text-cyan-400 font-bold">SUIT DIAGNOSTICS</span>
              <span className="text-slate-400">MARK LXXXV</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Glowing Cyan Wireframe Suit Silhouette SVG (Exact match to images_be3c8b70.jpg) */}
              <svg className="w-16 h-28 shrink-0 drop-shadow-[0_0_8px_#00d4ff]" viewBox="0 0 60 110">
                <circle cx="30" cy="14" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                <path d="M16 26 L44 26 L48 54 L38 56 L36 78 L42 104 L32 104 L30 80 L28 104 L18 104 L24 78 L22 56 L12 54 Z" fill="rgba(56,189,248,0.12)" stroke="#00d4ff" strokeWidth="1.3" />
                <circle cx="30" cy="38" r="4" fill="#e0f2fe" stroke="#00f5ff" strokeWidth="1.2" />
              </svg>

              <div className="flex-1 space-y-1 text-[8.5px]">
                <div className="flex justify-between"><span className="text-slate-400">POWER UNIT</span><span className="text-emerald-400 font-bold">100%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">ARC REACTOR</span><span className="text-emerald-400 font-bold">100%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">SYSTEMS</span><span className="text-emerald-400 font-bold">100%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">MOBILITY</span><span className="text-emerald-400 font-bold">100%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">WEAPONS</span><span className="text-emerald-400 font-bold">100%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">DEFENSES</span><span className="text-emerald-400 font-bold">100%</span></div>
              </div>
            </div>
            <div className="text-center text-[8px] text-emerald-400 font-bold mt-1 border-t border-slate-800 pt-0.5">
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>

          {/* 3. TARGETING SYSTEM */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center shrink-0">
              <Crosshair className="w-8 h-8 text-cyan-300" style={{ transform: `rotate(${reticleDegree}deg)` }} />
            </div>
            <div className="flex-1 text-[9px] space-y-0.5">
              <div className="text-cyan-400 font-bold">TARGETING SYSTEM</div>
              <div className="flex justify-between"><span className="text-slate-400">TARGETS</span><span className="text-white font-bold">12</span></div>
              <div className="flex justify-between"><span className="text-slate-400">RANGE</span><span className="text-cyan-300 font-bold">2.3 KM</span></div>
              <div className="flex justify-between"><span className="text-slate-400">ACCURACY</span><span className="text-emerald-400 font-bold">98.7%</span></div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM CIRCULAR ICON ACTION BAR (Exact match to images_be3c8b70.jpg bottom row) */}
      <footer className="relative z-20 pt-2 border-t border-cyan-500/20 flex flex-wrap items-center justify-center gap-2.5">
        {tacticalDockIcons.map((app, idx) => {
          const Icon = app.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                onOpenModule?.(app.id);
              }}
              className="w-9 h-9 rounded-full bg-slate-950 hover:bg-cyan-950 border border-cyan-500/50 hover:border-cyan-300 text-cyan-300 hover:text-white flex items-center justify-center transition cursor-pointer shadow-[0_0_12px_rgba(0,212,255,0.25)] hover:scale-110"
              title={app.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </footer>
    </div>
  );
};
