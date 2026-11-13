import React, { useState, useEffect } from "react";
import {
  Layers,
  Settings,
  Lock,
  Sparkles,
  Zap,
  Monitor,
  Heart,
  DollarSign,
  MapPin,
  Smartphone,
  Eye,
  EyeOff,
  HardDrive,
  FileText,
  Search,
  Mic,
  Shield,
  Music,
  FolderGit2,
} from "lucide-react";
import { soundEffects } from "../../services/soundEffects";
import { speechService } from "../../services/speechService";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../../types";
import { ALL_JARVIS_THEMES } from "./themesData";
import { QuantumFieldsBar } from "../QuantumFieldsBar";

interface StarkMark3ThemeProps {
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

export const StarkMark3Theme: React.FC<StarkMark3ThemeProps> = ({
  customization,
  coherence,
  screenWorkMinutes,
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
  const [reticleDegree, setReticleDegree] = useState(0);
  const [isPrivacyCloak, setIsPrivacyCloak] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [googleQuery, setGoogleQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setReticleDegree((prev) => (prev + 1.6) % 360);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const dockIcons = [
    { label: "PC Suites", icon: Monitor, id: "desktop", bg: "from-cyan-500/30 to-blue-900/60" },
    { label: "Media", icon: Music, id: "desktop", bg: "from-sky-500/30 to-slate-900/60" },
    { label: "Workflow", icon: Zap, id: "automation", bg: "from-teal-500/30 to-cyan-950/60" },
    { label: "Comm Hub", icon: FolderGit2, id: "communication", bg: "from-blue-500/30 to-indigo-950/60" },
    { label: "Study Hub", icon: FileText, id: "study", bg: "from-purple-500/30 to-slate-900/60" },
    { label: "Life Vault", icon: HardDrive, id: "records", bg: "from-indigo-500/30 to-slate-900/60" },
    { label: "Health", icon: Heart, id: "health", bg: "from-emerald-500/30 to-slate-900/60" },
    { label: "Finance", icon: DollarSign, id: "finance", bg: "from-amber-500/30 to-slate-900/60" },
    { label: "Maps", icon: MapPin, id: "maps", bg: "from-cyan-500/30 to-blue-950/60" },
    { label: "Devices", icon: Smartphone, id: "devices", bg: "from-emerald-500/30 to-teal-950/60" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#02070d] text-slate-100 font-mono select-none overflow-x-hidden flex flex-col justify-between p-3 md:p-5">
      {/* Background metallic atmospheric gradient matching images__3__0fd67f24.jpg */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 48% 50%, rgba(0,245,255,0.16) 0%, rgba(4,12,24,0.9) 55%, #010408 100%)",
        }}
      />

      {/* TOP HEADER: STARK INDUSTRIES Wing Banner + Weather 2° + Controls */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/40">
        <div className="flex items-center gap-3">
          {/* Stark Industries Logo Banner */}
          <div className="px-3 py-1 rounded-lg bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_20px_rgba(0,245,255,0.3)] flex items-center gap-3">
            <div>
              <div className="text-xs md:text-sm font-orbitron font-extrabold text-white tracking-[0.2em]">
                STARK INDUSTRIES
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-transparent mt-0.5" />
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-cyan-950/60">
              <span className="text-xs font-orbitron font-bold text-cyan-200">2°</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsThemePickerOpen(!isThemePickerOpen);
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.3)]"
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
                      t.id === (customization.activeInterfaceTheme || "stark_mark3")
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
          activeThemeId={customization.activeInterfaceTheme || "stark_mark3"}
          onSelectTheme={onSelectTheme}
        />
      </div>

      {/* MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 my-3 items-center">
        {/* LEFT COLUMN (Exact match to images__3__0fd67f24.jpg left gauges + Google search bar) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* March 30 Circular Ring + Volume Info */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/50 flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_25px_#00f5ff] shrink-0">
              <span className="text-[9px] text-cyan-300 font-bold uppercase">MARCH</span>
              <span className="text-3xl font-orbitron font-extrabold text-white">30</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="text-cyan-300 font-bold">HOST DISK VOLUMES</div>
              <div className="text-slate-300">Full Capacity: <span className="text-white font-bold">112 GB</span></div>
              <div className="text-slate-300">Free Space: <span className="text-emerald-400 font-bold">48 GB</span></div>
              <div className="text-cyan-400">Online Nodes: 17 Connected</div>
            </div>
          </div>

          {/* Energy 100% Dial + Segmented Telemetry */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_#00f5ff]">
                <span className="text-xs font-orbitron font-bold text-white">100%</span>
              </div>
              <div className="text-[10px]">
                <div className="text-cyan-300 font-bold">ENERGY ARC CORE</div>
                <div className="text-emerald-400 font-bold">STATUS: OPTIMAL</div>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <div>Screen Guard</div>
              <div className="text-cyan-300 font-bold">{screenWorkMinutes}m active</div>
            </div>
          </div>

          {/* Search in GOOGLE Bar (Exact from bottom-left of images__3__0fd67f24.jpg) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              soundEffects.playBeepConfirm();
              onOpenVoiceModal();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,245,255,0.2)]"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              value={googleQuery}
              onChange={(e) => setGoogleQuery(e.target.value)}
              placeholder="Search in GOOGLE / Ask Jarvis..."
              className="flex-1 bg-transparent text-xs text-cyan-100 placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400 text-[9px] text-cyan-200 font-bold cursor-pointer"
            >
              GO
            </button>
          </form>
        </div>

        {/* CENTER COLUMN: STARK TARGETING CORE WITH RED/CYAN SECTORS & FLANKING TELEMETRY COLUMNS */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div
            onClick={() => {
              soundEffects.playShockwave();
              speechService.speak("Stark Industries Mark 3 targeting ring calibrated.", {
                lang: language,
                gender: voiceGender,
              });
            }}
            className="relative w-72 h-72 md:w-84 md:h-84 rounded-full flex items-center justify-center cursor-pointer group"
          >
            {/* Outer Translucent Ring with Red/Cyan Sector Highlights (Exact from images__3__0fd67f24.jpg) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="3.5"
                strokeDasharray="60 15 35 15 45 20"
                style={{ transformOrigin: "50% 50%", transform: `rotate(${reticleDegree}deg)` }}
              />
              {/* Red Tactical Arc Accents */}
              <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="22 50 18 60"
                style={{ transformOrigin: "50% 50%", transform: `rotate(-${reticleDegree * 1.4}deg)` }}
              />
            </svg>

            {/* Center Core */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-cyan-950/90 via-[#041424] to-black border-2 border-cyan-300 flex flex-col items-center justify-center shadow-[0_0_45px_rgba(0,245,255,0.75)]">
              <Zap className="w-7 h-7 text-cyan-200 animate-pulse mb-1" />
              <span className="text-xs font-orbitron font-extrabold text-white tracking-widest">MARK III CORE</span>
              <span className="text-[9px] text-emerald-400 font-bold mt-0.5">{coherence.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ARMORED MARK III SILHOUETTE + STARK EXPO 2010 OVERLAY */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="relative p-4 rounded-3xl bg-gradient-to-br from-slate-900/90 via-black to-cyan-950/30 border border-cyan-400/50 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] text-cyan-400 font-bold tracking-widest">STARK EXPO 2010</div>
                <div className="text-2xl font-orbitron font-extrabold text-cyan-100 drop-shadow-[0_0_10px_#00f5ff]">
                  expo 2010
                </div>
                <div className="text-[10px] text-slate-300 mt-1">Project: EXOSKELETON MARK III</div>
              </div>

              {/* Mark III Upper Chest + Glowing Arc Node SVG Silhouette */}
              <svg className="w-20 h-20" viewBox="0 0 80 80">
                <path d="M26 14 Q40 6 54 14 L56 32 L68 46 L60 74 L20 74 L12 46 L24 32 Z" fill="#0f172a" stroke="#00f5ff" strokeWidth="1.5" />
                <circle cx="40" cy="44" r="7" fill="#e0f2fe" stroke="#00f5ff" strokeWidth="2" />
                <line x1="34" y1="20" x2="39" y2="21" stroke="#00f5ff" strokeWidth="2" />
                <line x1="46" y1="20" x2="41" y2="21" stroke="#00f5ff" strokeWidth="2" />
              </svg>
            </div>

            {/* Project MARK III Status Box (Exact from bottom-right of images__3__0fd67f24.jpg) */}
            <div className="mt-3 p-2.5 rounded-xl bg-black/80 border border-cyan-400/50 space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-cyan-300 font-bold">PROJECT: MARK III ARMOR</span>
                <span className="text-emerald-400 font-bold">94% SYNC</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden flex gap-0.5 p-0.5 border border-cyan-500/30">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`flex-1 rounded-xs ${i < 11 ? "bg-cyan-400" : "bg-slate-800"}`} />
                ))}
              </div>
              <div className="text-[9px] text-slate-400">
                {isPrivacyCloak ? "[CLASSIFIED STARK TELEMETRY CLOAKED]" : "Host CPU & GPU CUDA Telemetry Nominal"}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM 3D GLOSSY DESKTOP GLASS ICONS DOCK (Exact match to images__3__0fd67f24.jpg bottom row) */}
      <footer className="relative z-20 pt-3 border-t border-cyan-500/30 flex flex-wrap items-center justify-center gap-2.5">
        {dockIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onOpenModule?.(item.id);
              }}
              className={`px-3 py-2 rounded-2xl bg-gradient-to-b ${item.bg} border border-cyan-400/40 hover:border-cyan-200 text-cyan-100 transition flex flex-col items-center gap-1 cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.8)] hover:-translate-y-1`}
            >
              <Icon className="w-4 h-4 text-cyan-300" />
              <span className="text-[9px] font-mono font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </footer>
    </div>
  );
};
