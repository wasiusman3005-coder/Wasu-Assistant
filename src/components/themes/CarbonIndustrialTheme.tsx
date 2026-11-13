import React, { useState, useEffect } from "react";
import {
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
  Clock,
  Terminal,
  Monitor,
  Cpu,
  Globe,
  HardDrive,
  FileCode,
  Shield,
  Laptop,
  Mic,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";

interface CarbonIndustrialThemeProps {
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

export const CarbonIndustrialTheme: React.FC<CarbonIndustrialThemeProps> = ({
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
  customization,
}) => {
  const [coreRotation, setCoreRotation] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(28);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCoreRotation((prev) => (prev + 2) % 360);
      setNow(new Date());
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const timeFormatted = now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const leftAngledTabs = [
    { label: "My PC", id: "desktop", icon: Monitor, active: true },
    { label: "Opera", id: "communication", icon: Globe },
    { label: "Task Mngr", id: "automation", icon: Cpu },
    { label: "CMD", id: "automation", icon: Terminal },
    { label: "Team Viwr", id: "devices", icon: Laptop },
    { label: "FireFox", id: "maps", icon: Globe },
    { label: "V_Studio", id: "communication", icon: FileCode },
    { label: "PHP Docs", id: "records", icon: HardDrive },
  ];

  const topQuickButtons = [
    { label: "My PC", id: "desktop" },
    { label: "D Weaver", id: "communication" },
    { label: "Turbo C", id: "automation" },
    { label: "Notepad", id: "records" },
    { label: "C Panel", id: "finance" },
    { label: "Evis", id: "health" },
    { label: "Connectify", id: "devices" },
  ];

  return (
    <div
      className="relative w-full min-h-screen bg-[#11151c] text-slate-100 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5"
      style={{
        backgroundImage: `
          radial-gradient(#262d3a 18%, transparent 19%),
          radial-gradient(#090c10 18%, transparent 19%)
        `,
        backgroundPosition: "0 0, 4px 4px",
        backgroundSize: "8px 8px",
      }}
    >
      {/* Heavy Gunmetal Industrial Metallic Chassis Bevel Frame (Exact match to images__2__c5f03e7f.jpg) */}
      <div className="fixed inset-1.5 md:inset-3 border-[3px] border-slate-600/70 rounded-2xl pointer-events-none z-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)]">
        {/* Top metallic angled visor */}
        <div className="absolute -top-0.5 left-1/4 right-1/4 h-3 bg-gradient-to-b from-slate-500/80 to-slate-800/80 border-b border-cyan-400/50 rounded-b-xl" />
        {/* Left side vertical metal plate */}
        <div className="hidden lg:block absolute top-14 bottom-16 -left-0.5 w-4 bg-gradient-to-r from-slate-500/70 to-slate-800/70 border-r border-cyan-500/40 rounded-r-xl" />
        {/* Bottom-right quote cutout frame */}
        <div className="hidden lg:block absolute bottom-0 right-10 w-[440px] h-8 border-t-2 border-l-2 border-slate-500/70 rounded-tl-2xl bg-slate-900/40" />
      </div>

      {/* TOP BAR: Slanted Cyber Launcher Tabs + Controls + Digital 7-Segment Clock */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
        {/* Top Slanted Quick Launch Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {topQuickButtons.map((btn, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onOpenModule?.(btn.id);
              }}
              className="px-2.5 py-1 bg-gradient-to-b from-slate-700/90 to-slate-900 border border-cyan-500/40 hover:border-cyan-300 text-[10px] font-bold text-cyan-200 hover:text-white rounded-md shadow-md transition cursor-pointer transform -skew-x-12"
            >
              <span className="inline-block skew-x-12">{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Right Controls + Digital Clock (12:44:12 PM style) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Theme Switcher Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/70 text-cyan-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.35)]"
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
                      t.id === (customization.activeInterfaceTheme || "carbon_industrial")
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

          {/* Privacy Cloak */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setIsPrivacyCloak(!isPrivacyCloak);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer ${
              isPrivacyCloak ? "bg-red-500 text-black font-bold" : "bg-slate-900 border border-slate-700 text-slate-300"
            }`}
          >
            {isPrivacyCloak ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">{isPrivacyCloak ? "CLOAK ON" : "CLOAK"}</span>
          </button>

          {/* Apps Matrix */}
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

          {/* Settings */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 cursor-pointer"
            title="Open Settings & Themes"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Away Mode */}
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

          {/* Lock */}
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

          {/* Digital 7-Segment Style Clock (Top Right as in reference) */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/90 border border-slate-600 text-slate-100 font-orbitron font-extrabold text-sm tracking-widest shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeFormatted}</span>
          </div>
        </div>
      </header>
      <div className="my-1.5 relative z-20">
        <QuantumFieldsBar
          activeThemeId={customization.activeInterfaceTheme || "carbon_industrial"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 my-4 items-center">
        {/* LEFT COLUMN: Vertical Blue Meter + Slanted Metallic Tabs + Bottom 3D Holographic Battery Cylinder */}
        <div className="lg:col-span-3 flex flex-col gap-4 pl-2">
          <div className="flex items-stretch gap-3">
            {/* Vertical Glowing Cyan Meter Bar (Exact from reference) */}
            <div className="w-3.5 rounded-full bg-slate-900 border border-cyan-400/60 p-0.5 flex flex-col justify-end shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <div className="w-full h-[78%] rounded-full bg-gradient-to-t from-blue-600 via-cyan-400 to-cyan-200 animate-pulse" />
            </div>

            {/* Slanted Metallic App Tabs */}
            <div className="flex-1 space-y-1.5">
              {leftAngledTabs.map((tab, idx) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      onOpenModule?.(tab.id);
                    }}
                    className={`w-full px-3 py-1.5 rounded-lg border text-left text-xs font-bold transition cursor-pointer flex items-center gap-2.5 transform -skew-x-6 ${
                      tab.active
                        ? "bg-gradient-to-r from-cyan-500/80 to-blue-700/70 border-cyan-300 text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                        : "bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-slate-600 hover:border-cyan-400 text-slate-200 hover:text-cyan-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-300 shrink-0 skew-x-6" />
                    <span className="skew-x-6 tracking-wide">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D HOLOGRAPHIC VERTICAL BATTERY CYLINDER IN GLASS BASE (Matches 28% Low Battery in images__2__c5f03e7f.jpg) */}
          <div className="mt-2 p-3 rounded-2xl bg-black/75 border border-cyan-500/40 flex flex-col items-center relative">
            <div className="flex items-center justify-between w-full text-[10px] mb-2">
              <span className="text-slate-300 font-bold">{batteryLevel}%</span>
              <span className="text-amber-400 font-bold">Low</span>
              <span className="text-cyan-300 font-bold">Battery</span>
            </div>
            {/* 3D Glowing Cylinder + Curved Projection Rings */}
            <div className="relative flex flex-col items-center">
              <div
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  setBatteryLevel((prev) => (prev >= 100 ? 28 : Math.min(100, prev + 18)));
                }}
                className="relative w-12 h-20 rounded-xl border-2 border-cyan-300/80 bg-cyan-950/40 flex flex-col justify-end p-1 cursor-pointer shadow-[0_0_25px_rgba(0,240,255,0.75)]"
                title="Click to Boost Holographic Cell"
              >
                <div className="absolute -top-1.5 left-3 right-3 h-1.5 rounded-t-md bg-cyan-300/80" />
                <div
                  className="w-full bg-gradient-to-t from-cyan-400 via-sky-300 to-white rounded-md transition-all duration-300 shadow-[0_0_15px_#00f5ff]"
                  style={{ height: `${batteryLevel}%` }}
                />
              </div>
              {/* Elliptical Hologram Projection Discs around Cylinder */}
              <div className="w-32 h-5 -mt-2 rounded-[100%] border border-cyan-400/60 shadow-[0_0_15px_#00f5ff]" />
              <div className="w-40 h-6 -mt-4 rounded-[100%] border border-cyan-500/30" />
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: ICONIC "JARVIS" MULTI-RING GLOWING CYAN TURBINE CORE */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div
            onClick={() => {
              soundEffects.playShockwave();
              speechService.speak(
                `Jarvis industrial core online. Quantum coherence at ${coherence.toFixed(2)} percent.`,
                { lang: language, gender: voiceGender }
              );
            }}
            className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 rounded-full flex items-center justify-center cursor-pointer group"
          >
            {/* Outer Tick Scale Ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-400/80 shadow-[0_0_40px_rgba(0,240,255,0.65)]"
              style={{ transform: `rotate(${coreRotation}deg)` }}
            />

            {/* Brushed Steel Outer Bezel */}
            <div className="absolute inset-5 rounded-full border-[10px] border-slate-800 shadow-[inset_0_0_20px_#000,0_0_25px_rgba(0,240,255,0.5)]" />

            {/* Cyan Glowing Rotating Arc Ring */}
            <div
              className="absolute inset-8 rounded-full border-4 border-cyan-400 border-t-transparent border-b-transparent shadow-[0_0_25px_#00f0ff]"
              style={{ transform: `rotate(-${coreRotation * 1.6}deg)` }}
            />

            {/* Inner Metallic Chrome Ring */}
            <div
              className="absolute inset-12 rounded-full border-2 border-slate-300/70 border-dotted"
              style={{ transform: `rotate(${coreRotation * 2}deg)` }}
            />

            {/* Glowing Cyan Core with JARVIS Label */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-cyan-950 via-[#041e2e] to-black border-2 border-cyan-300 flex flex-col items-center justify-center shadow-[inset_0_0_35px_#00f0ff,0_0_40px_rgba(0,240,255,0.85)]">
              <Zap className="w-6 h-6 text-cyan-200 animate-pulse mb-1" />
              <span className="text-xl md:text-2xl font-orbitron font-extrabold text-white tracking-[0.22em] drop-shadow-[0_0_12px_#00f5ff]">
                JARVIS
              </span>
              <span className="text-[9px] font-mono text-cyan-300 font-bold mt-1">
                {coherence.toFixed(2)}% COHERENCE
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playBeepConfirm();
              onOpenVoiceModal();
            }}
            className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/90 hover:bg-cyan-950 border border-cyan-400/50 text-cyan-300 text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>VOICE COMMAND CONSOLE</span>
          </button>
        </div>

        {/* RIGHT COLUMN: NETWORK BOX & CYAN GLOWING NOTES MANIFEST */}
        <div className="lg:col-span-3 flex flex-col gap-4 pr-2">
          {/* NETWORK TELEMETRY CARD (Exact match to images__2__c5f03e7f.jpg right-top) */}
          <div className="p-3.5 rounded-lg bg-black/85 border border-slate-600 shadow-lg text-xs">
            <div className="text-center font-orbitron font-bold text-slate-200 tracking-widest border-b border-slate-700 pb-1 mb-2">
              NETWORK
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">IP Address</span>
                <span className="text-slate-100 font-bold">{isPrivacyCloak ? "0.0.0.0 [CLOAKED]" : "49.34.7.2"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Upload</span>
                <span className="text-cyan-300 font-bold">0.0 B/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Download</span>
                <span className="text-cyan-300 font-bold">0.0 B/s</span>
              </div>
            </div>
          </div>

          {/* BRIGHT CYAN BORDERED NOTES BOX (Exact match to right-middle of images__2__c5f03e7f.jpg) */}
          <div
            onClick={() => onOpenModule?.("records")}
            className="p-3.5 rounded-lg bg-[#041821]/90 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer hover:scale-[1.01] transition"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 border-b border-cyan-500/40 pb-1 mb-2">
              <span>Notes</span>
              <span className="text-cyan-200">+</span>
            </div>
            <div className="space-y-1 text-[10px] text-cyan-100 font-mono leading-relaxed">
              <div className="font-bold text-white">Mongo DB Session Attend:</div>
              <div className="text-cyan-300">Start: 06 Aug 2026 at 17:00</div>
              <div className="text-cyan-300">End: 26 Sep 2026 at 17:00</div>
              <div className="text-emerald-300 font-bold mt-1">Project Needs:</div>
              <div>* Splash Screen (Checked)</div>
              <div>* Internet Connectivity (Checked)</div>
              <div>* New ToolKits / Process Modeling</div>
              <div>* Object Modeling / UI Spec</div>
              <div>* Extra User Surveillance Ready</div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM EINSTEIN QUOTE BANNER (Exact match to bottom-right of images__2__c5f03e7f.jpg) */}
      <footer className="relative z-20 pt-2 flex items-center justify-end pr-8">
        <p className="text-[11px] md:text-xs text-slate-300 font-mono tracking-wide italic">
          Only two things are infinite, the universe and human stupidity - Einstein
        </p>
      </footer>
    </div>
  );
};
