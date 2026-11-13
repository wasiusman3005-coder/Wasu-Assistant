import React, { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Cpu,
  Activity,
  Terminal,
  FileCode,
  HardDrive,
  Wifi,
  WifiOff,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FolderGit2,
  Layers,
  Database,
  Smartphone,
  MapPin,
  Mic,
  Settings,
  Flame,
  Globe,
  Radio,
  Share2,
  ChevronRight,
  Monitor,
  GraduationCap,
  Heart,
  DollarSign,
  Zap,
  Power,
  Clock,
  Laptop,
  Maximize2,
  User,
  Film,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { fetchSystemTelemetry, fetchSystemFiles, SystemTelemetry } from "../services/systemTelemetry";
import { UserProfile, DashboardCustomization, LanguageCode, VoiceGender, JarvisInterfaceThemeId } from "../types";
import { QuantumThemeColor } from "./AutoMorphingQuantumLogo";
import { ALL_JARVIS_THEMES } from "./themes/themesData";
import { QuantumFieldsBar } from "./QuantumFieldsBar";
import {
  CentralQuantumCoreHologram,
  QuantumCoreDesign,
  QuantumColorPalette,
  QUANTUM_DESIGNS,
  QUANTUM_PALETTES,
} from "./CentralQuantumCoreHologram";

interface UltraCockpitDashboardProps {
  userProfile: UserProfile;
  customization: DashboardCustomization;
  currentTheme?: QuantumThemeColor;
  coherence: number;
  isSpeaking: boolean;
  isListening: boolean;
  screenWorkMinutes: number;
  onOpenVoiceModal: () => void;
  onOpenAppsMatrix: () => void;
  onOpenModule?: (
    moduleId:
      | "desktop"
      | "study"
      | "records"
      | "health"
      | "finance"
      | "automation"
      | "communication"
      | "maps"
      | "devices"
      | "studio"
  ) => void;
  onOpenSettings: () => void;
  onOpenHumanoidStage?: () => void;
  onTriggerWakeWord?: () => void;
  onTriggerHealthLockdown: () => void;
  onLockScreen?: () => void;
  onToggleAwayMode?: () => void;
  isAwayMode?: boolean;
  onSelectTheme?: (themeId: JarvisInterfaceThemeId) => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const UltraCockpitDashboard: React.FC<UltraCockpitDashboardProps> = ({
  userProfile,
  customization,
  currentTheme,
  coherence,
  isSpeaking,
  isListening,
  screenWorkMinutes,
  onOpenVoiceModal,
  onOpenAppsMatrix,
  onOpenModule,
  onOpenSettings,
  onOpenHumanoidStage,
  onTriggerWakeWord,
  onTriggerHealthLockdown,
  onLockScreen,
  onToggleAwayMode,
  isAwayMode = false,
  onSelectTheme,
  language,
  voiceGender,
}) => {
  // -----------------------------------------------------------
  // 1. PRIVACY & SECURITY HIGH-LEVEL STATES
  // -----------------------------------------------------------
  const [isPrivacyCloakActive, setIsPrivacyCloakActive] = useState(false);
  const [isAirGapActive, setIsAirGapActive] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [cipherRotationTimer, setCipherRotationTimer] = useState(26);
  const [activeCipherKey, setActiveCipherKey] = useState("0x7F4A...B9C2_LATTICE");

  // Live Real Host PC Telemetry
  const [hostTelemetry, setHostTelemetry] = useState<SystemTelemetry | null>(null);
  const [realAssetCapsules, setRealAssetCapsules] = useState<
    { name: string; size: string; type: string; mod: string }[]
  >([]);

  // Rotating Core Radar Degree
  const [coreDegree, setCoreDegree] = useState(0);

  // Continuously Morphing Quantum Logo Design & Color States
  const [activeQuantumPalette, setActiveQuantumPalette] = useState<QuantumColorPalette>(QUANTUM_PALETTES[0]);
  const [activeQuantumDesign, setActiveQuantumDesign] = useState<QuantumCoreDesign>(QUANTUM_DESIGNS[0]);
  const [isOverdriveMode, setIsOverdriveMode] = useState(false);

  // Time & Date String
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

  // Rotation & Key Lifecycle
  useEffect(() => {
    const interval = setInterval(() => {
      setCoreDegree((prev) => (prev + 2) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  // Cipher Key rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCipherRotationTimer((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cipherRotationTimer === 30) {
      const hex = "0x" + Math.random().toString(16).substring(2, 6).toUpperCase() + "...AES4096";
      setActiveCipherKey(hex);
    }
  }, [cipherRotationTimer]);

  // Poll Real Host PC Hardware & Files
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const data = await fetchSystemTelemetry();
      if (!cancelled && data) setHostTelemetry(data);
    };
    const loadFiles = async () => {
      const files = await fetchSystemFiles();
      if (!cancelled && files.length > 0) {
        setRealAssetCapsules(
          files.slice(0, 6).map((f) => ({
            name: f.name,
            size: f.size,
            type: f.type,
            mod: "desktop",
          }))
        );
      }
    };
    poll();
    loadFiles();
    const interval = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isAirGapActive]);

  // Listen to remote / voice privacy events
  useEffect(() => {
    const handleCloak = () => setIsPrivacyCloakActive((prev) => !prev);
    const handleAirGap = () => setIsAirGapActive((prev) => !prev);

    window.addEventListener("toggle-privacy-cloak", handleCloak);
    window.addEventListener("toggle-air-gap", handleAirGap);

    return () => {
      window.removeEventListener("toggle-privacy-cloak", handleCloak);
      window.removeEventListener("toggle-air-gap", handleAirGap);
    };
  }, []);

  // Privacy Redaction Helper
  const mask = (value: string | number, cloakedReplacement = "████████") => {
    if (isPrivacyCloakActive) return cloakedReplacement;
    return String(value);
  };

  const togglePrivacyCloak = () => {
    soundEffects.playAlert();
    const next = !isPrivacyCloakActive;
    setIsPrivacyCloakActive(next);
    const speech =
      language === "pa"
        ? next
          ? "Maximum Privacy Cloak Active! Saara confidential data redact ho gaya ae."
          : "Privacy Cloak Disengaged. Normal visual view restored."
        : next
        ? "Maximum Privacy Cloak Activated! Anti-shoulder surfing redaction enabled across all HUD cards."
        : "Privacy Cloak Disengaged. Normal display restored.";
    speechService.speak(speech, { lang: language, gender: voiceGender });
  };

  const toggleAirGap = () => {
    soundEffects.playBeepConfirm();
    setIsAirGapActive((prev) => !prev);
  };

  // Real Host PC files (or clean fallback placeholders until host files load)
  const assetCapsules =
    realAssetCapsules.length > 0
      ? realAssetCapsules
      : [
          { name: hostTelemetry?.hostname ? `${hostTelemetry.hostname}.sys` : "Scanning PC...", size: "--", type: "sys", mod: "desktop" },
          { name: "Desktop Files", size: "Open", type: "code", mod: "desktop" },
          { name: "Downloads", size: "Open", type: "archive", mod: "desktop" },
          { name: "Documents", size: "Open", type: "doc", mod: "records" },
          { name: "Devices Sync", size: "Live", type: "sec", mod: "devices" },
          { name: "Workflow Shell", size: "CLI", type: "sys", mod: "automation" },
        ];

  return (
    <div className="relative w-full min-h-screen bg-[#02040a] text-slate-100 flex flex-col justify-between p-2 md:p-4 select-none font-rajdhani overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP FLOATING HOLOGRAPHIC HUD BAR (Zero Vertical Sidebar Needed) */}
      {/* ------------------------------------------------------------- */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/85 border border-cyan-500/35 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] shrink-0">
        {/* Left: Brand & Clearance */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-md shadow-cyan-500/30">
            <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-extrabold text-sm text-cyan-300 tracking-wider glow-text-cyan">
                Q-NEXUS TACHYON OS
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                MIL-SPEC HUD
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              Commander: <strong className="text-slate-200">{mask(userProfile?.displayName || userProfile?.username || "WASI")}</strong> • Coherence: <span className="text-emerald-400">{coherence.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Center: Live Clock & Screen Time Rest */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-cyan-300 font-bold font-orbitron">{timeStr}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{dateStr}</span>
          </div>

          <button
            type="button"
            onClick={onTriggerHealthLockdown}
            title="Ergonomic Screen Time Rest Guard"
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-slate-400 hover:text-amber-300 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Rest Guard: {screenWorkMinutes}m</span>
          </button>

          {/* Active Quantum Morphing Core Status Badge */}
          <div
            className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl border backdrop-blur-md transition-all duration-700"
            style={{
              backgroundColor: `${activeQuantumPalette.hex}15`,
              borderColor: `${activeQuantumPalette.hex}60`,
              boxShadow: `0 0 15px ${activeQuantumPalette.glow}`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeQuantumPalette.hex }}
            />
            <span className="text-[10px] font-orbitron font-bold" style={{ color: activeQuantumPalette.hex }}>
              CORE: {activeQuantumDesign.name.toUpperCase()}
            </span>
            <span className="text-[9px] font-mono text-slate-300 px-1.5 py-0.2 rounded bg-black/60 border border-slate-700">
              {activeQuantumPalette.name}
            </span>
            {isOverdriveMode && (
              <span className="text-[9px] font-mono text-amber-300 font-bold px-1.5 py-0.2 rounded bg-rose-950 border border-rose-500 animate-pulse">
                WARP 3.5X
              </span>
            )}
          </div>
        </div>

        {/* Right: Master Privacy, Voice, Settings & Lock System Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Button */}
          {onSelectTheme && (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setIsThemeDropdownOpen(!isThemeDropdownOpen);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,245,255,0.3)]"
                title="Switch between 7 Iconic Sci-Fi Interfaces"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>THEMES (7)</span>
              </button>

              {isThemeDropdownOpen && (
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
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-xl text-left text-xs transition cursor-pointer ${
                        t.id === (customization.activeInterfaceTheme || "quantum_cockpit")
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
          )}

          {/* Privacy Cloak Button */}
          <button
            type="button"
            onClick={togglePrivacyCloak}
            title="Toggle Anti-Shoulder Surfing Redaction Cloak"
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isPrivacyCloakActive
                ? "bg-red-500 text-slate-950 border border-red-400 shadow-md shadow-red-500/50 animate-pulse"
                : "bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300"
            }`}
          >
            {isPrivacyCloakActive ? <EyeOff className="w-3.5 h-3.5 text-slate-950" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{isPrivacyCloakActive ? "CLOAK ON" : "CLOAK OFF"}</span>
          </button>

          {/* Air-Gap Button */}
          <button
            type="button"
            onClick={toggleAirGap}
            title="Air-Gap Mode: Isolate all external telemetry"
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition flex items-center gap-1 cursor-pointer ${
              isAirGapActive
                ? "bg-amber-500 text-slate-950 font-bold border border-amber-400"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {isAirGapActive ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden lg:inline">{isAirGapActive ? "AIR-GAP" : "ONLINE"}</span>
          </button>

          {/* Apps Matrix */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenAppsMatrix();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">APPS MATRIX</span>
          </button>

          {/* Settings Modal */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-purple-950 border border-slate-800 hover:border-purple-400 text-slate-400 hover:text-purple-300 transition cursor-pointer"
            title="Configure System HUD Settings"
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
              className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950 border border-slate-800 hover:border-amber-400 text-slate-400 hover:text-amber-300 transition cursor-pointer"
              title="Activate Away Auto-Pilot Screensaver"
            >
              <Laptop className="w-4 h-4" />
            </button>
          )}

          {/* Humanoid Stage Quick Launch */}
          {onOpenHumanoidStage && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                onOpenHumanoidStage();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-400/60 text-purple-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              title="Open Humanoid & 100+ Avatars Studio"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">HUMANOID</span>
            </button>
          )}

          {/* Wake Word Trigger Quick Button */}
          {onTriggerWakeWord && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                onTriggerWakeWord();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-400/60 text-amber-200 text-xs font-mono flex items-center gap-1 cursor-pointer"
              title="Trigger Wake Word Engine Instantly"
            >
              <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden xl:inline">WAKE</span>
            </button>
          )}

          {/* Lock Quantum Core */}
          {onLockScreen && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playAlert();
                onLockScreen();
              }}
              className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 hover:border-red-400 text-red-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950"
              title="Lock Quantum Core and Require Password"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>LOCK</span>
            </button>
          )}
        </div>
      </header>

      {/* QUANTUM FIELDS BAR: ALL 7 THEME NAMES PLACED ON QUANTUM FIELDS + 3D LOGO SYNC */}
      {onSelectTheme && (
        <div className="my-1.5 relative z-20">
          <QuantumFieldsBar
            activeThemeId={customization.activeInterfaceTheme || "quantum_cockpit"}
            onSelectTheme={onSelectTheme}
          />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MAIN SPATIAL CANVAS: EXACT RECREATION OF USER REFERENCE IMAGE */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex-1 w-full my-2 flex items-center justify-center min-h-[560px] md:min-h-[640px]">
        {/* SVG RADIATING NEON CIRCUIT TRACES CONNECTING CENTER PEDESTAL TO SCREENS */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible opacity-75"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="traceCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeQuantumPalette.hex} stopOpacity="0.95" />
              <stop offset="100%" stopColor={activeQuantumPalette.secondaryHex} stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="traceMint" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isOverdriveMode ? "#f43f5e" : activeQuantumPalette.hex} stopOpacity="0.9" />
              <stop offset="100%" stopColor={activeQuantumPalette.secondaryHex} stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="traceViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isOverdriveMode ? "#f59e0b" : activeQuantumPalette.secondaryHex} stopOpacity="0.95" />
              <stop offset="100%" stopColor={activeQuantumPalette.hex} stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Left Wing Traces */}
          <path d="M 50% 50% L 36% 38% L 24% 20% L 16% 20%" fill="none" stroke="url(#traceCyan)" strokeWidth={isOverdriveMode ? "2.5" : "2"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />
          <path d="M 50% 50% L 34% 48% L 26% 48% L 16% 48%" fill="none" stroke="url(#traceMint)" strokeWidth={isOverdriveMode ? "2.5" : "2"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />
          <path d="M 50% 50% L 38% 62% L 28% 74% L 16% 74%" fill="none" stroke="url(#traceCyan)" strokeWidth={isOverdriveMode ? "2.2" : "1.8"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />

          {/* Top Center Constellation Trace */}
          <path d="M 50% 50% L 50% 28% L 50% 18%" fill="none" stroke="url(#traceCyan)" strokeWidth={isOverdriveMode ? "2.5" : "2"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />

          {/* Right Wing Traces */}
          <path d="M 50% 50% L 64% 38% L 76% 20% L 84% 20%" fill="none" stroke="url(#traceCyan)" strokeWidth={isOverdriveMode ? "2.5" : "2"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />
          <path d="M 50% 50% L 66% 48% L 74% 48% L 84% 48%" fill="none" stroke="url(#traceViolet)" strokeWidth={isOverdriveMode ? "2.5" : "2"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />
          <path d="M 50% 50% L 62% 62% L 72% 74% L 84% 74%" fill="none" stroke="url(#traceCyan)" strokeWidth={isOverdriveMode ? "2.2" : "1.8"} className={isOverdriveMode ? "circuit-overdrive" : "circuit-animated"} />
        </svg>

        {/* ========================================================= */}
        {/* CENTER PEDESTAL & CONTINUOUSLY MORPHING QUANTUM 3D LOGO CORE */}
        {/* ========================================================= */}
        <div className="absolute z-10 flex flex-col items-center justify-center pointer-events-auto">
          <CentralQuantumCoreHologram
            coherence={coherence}
            language={language}
            voiceGender={voiceGender}
            activeInterfaceTheme={customization.activeInterfaceTheme || "quantum_cockpit"}
            onColorChange={setActiveQuantumPalette}
            onDesignChange={setActiveQuantumDesign}
            isOverdriveActive={isOverdriveMode}
            onToggleOverdrive={() => setIsOverdriveMode(!isOverdriveMode)}
          />
        </div>

        {/* ========================================================= */}
        {/* TOP-CENTER SCREEN: NETWORK CONSTELLATION NODE GRAPH */}
        {/* ========================================================= */}
        <div
          onClick={() => onOpenModule && onOpenModule("automation")}
          className="absolute top-2 z-20 hidden md:flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/50 cursor-pointer transition hover:scale-105"
        >
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[11px] font-orbitron font-bold text-cyan-300">
              NETWORK CONSTELLATION
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-emerald-400 border border-cyan-500/30">
              6 MESH NODES
            </span>
          </div>

          {/* SVG Star Constellation Graph */}
          <div className="w-48 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 180 60">
              {/* Lines */}
              <line x1="90" y1="30" x2="30" y2="15" stroke="#00f5ff" strokeWidth="1.2" opacity="0.6" />
              <line x1="90" y1="30" x2="35" y2="45" stroke="#00f5ff" strokeWidth="1.2" opacity="0.6" />
              <line x1="90" y1="30" x2="150" y2="15" stroke="#a855f7" strokeWidth="1.2" opacity="0.6" />
              <line x1="90" y1="30" x2="145" y2="45" stroke="#a855f7" strokeWidth="1.2" opacity="0.6" />
              <line x1="90" y1="30" x2="90" y2="8" stroke="#00ffcc" strokeWidth="1.2" opacity="0.6" />

              {/* Central Hub */}
              <circle cx="90" cy="30" r="6" fill="#00f5ff" />
              <circle cx="90" cy="30" r="10" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.5" />

              {/* Satellite Nodes */}
              <circle cx="30" cy="15" r="3.5" fill="#00ffcc" />
              <circle cx="35" cy="45" r="3.5" fill="#06b6d4" />
              <circle cx="150" cy="15" r="3.5" fill="#a855f7" />
              <circle cx="145" cy="45" r="3.5" fill="#3b82f6" />
              <circle cx="90" cy="8" r="3.5" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LEFT WING: FLOATING GLASS HUD SCREENS (1, 2, 3) */}
        {/* ========================================================= */}
        <div className="absolute left-0 top-0 bottom-16 w-full sm:w-[290px] md:w-[320px] flex flex-col justify-between pointer-events-auto space-y-2 z-10 pr-1">
          {/* Screen 1: Top-Left (Document Manifest Card) */}
          <div
            onClick={() => onOpenModule && onOpenModule("records")}
            className="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>ACTIVE_RECORD_MANIFEST</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                SECURE
              </span>
            </div>

            {/* Document Details with Audio Scrubber Line (From reference image) */}
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Commander:</span>
                <span className="text-slate-200 font-semibold">{mask(userProfile?.displayName || userProfile?.username || "WASI")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Security Clearance:</span>
                <span className="text-purple-400 font-bold">{mask("LEVEL-5 QUANTUM", "LEVEL-████")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Token:</span>
                <span className="text-cyan-400 truncate max-w-[150px]">{mask(activeCipherKey, "████-ENCRYPTED")}</span>
              </div>
            </div>

            {/* Timeline scrubber bar */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-2">
              <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[72%]"></div>
              </div>
              <span className="text-[9px] font-mono text-slate-400">72% SYNC</span>
            </div>
          </div>

          {/* Screen 2: Middle-Left (File & Asset Capsules Grid - 2x3 Grid) */}
          <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-orbitron font-bold text-cyan-300">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>STORAGE CAPSULES</span>
              </div>
              <span className="text-[9px] font-mono text-slate-500">6 Mounted</span>
            </div>

            {/* 2x3 Grid with File Icons */}
            <div className="grid grid-cols-2 gap-2">
              {assetCapsules.map((cap, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onOpenModule && onOpenModule(cap.mod as any)}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/60 text-left transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
                    <span className="text-[8px] font-mono text-slate-500">{mask(cap.size, "█ KB")}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-200 truncate font-semibold">
                    {mask(cap.name, "encrypted.bin")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Screen 3: Lower-Left (Real Host PC Telemetry & Kernel Status) */}
          <div
            onClick={() => onOpenModule && onOpenModule("desktop")}
            className="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5 gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
                <Activity className="w-3.5 h-3.5" />
                <span>HOST OS KERNEL</span>
              </span>
              <span className="text-[9px] text-cyan-300 truncate max-w-[160px]">
                {hostTelemetry?.hostname || "LOCAL-PC"}
              </span>
            </div>

            {/* Live Horizontal Gauges */}
            <div className="space-y-1.5 text-[11px] font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-0.5 gap-2">
                  <span className="truncate">
                    {hostTelemetry ? `${hostTelemetry.cpuModel} (${hostTelemetry.cpuCores}C)` : "Scanning CPU..."}
                  </span>
                  <span className="text-cyan-300 shrink-0">
                    {hostTelemetry ? `${hostTelemetry.cpuUsagePercent}%` : "--"}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-400 h-full transition-all"
                    style={{ width: `${hostTelemetry?.cpuUsagePercent || 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5 gap-2">
                  <span className="truncate">{hostTelemetry?.gpuName || "Scanning GPU..."}</span>
                  <span className="text-purple-300 shrink-0">
                    {hostTelemetry?.gpuVramGb ? `${hostTelemetry.gpuVramGb} GB` : "ACTIVE"}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-purple-400 h-full transition-all"
                    style={{ width: hostTelemetry ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-0.5">
                  <span>Host RAM</span>
                  <span className="text-emerald-300">
                    {hostTelemetry ? `${hostTelemetry.ramUsedGb} / ${hostTelemetry.ramTotalGb} GB` : "--"}
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-400 h-full transition-all"
                    style={{ width: `${hostTelemetry?.ramPercent || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT WING: FLOATING GLASS HUD SCREENS (5, 6, 7, 8, 9) */}
        {/* ========================================================= */}
        <div className="absolute right-0 top-0 bottom-16 w-full sm:w-[290px] md:w-[320px] flex flex-col justify-between pointer-events-auto space-y-2 z-10 pl-1">
          {/* Screen 5: Top-Right (Security Defense & Shield HUD) */}
          <div
            onClick={togglePrivacyCloak}
            className="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>QUANTUM_PRIVACY_SHIELD</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                100% SECURE
              </span>
            </div>

            {/* Security metrics checklist */}
            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Lattice Rotation:</span>
                <span className="text-cyan-400 font-bold">{cipherRotationTimer}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Zero-Telemetry:</span>
                <span className="text-emerald-400 font-semibold">ENFORCED (NO LEAKS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rogue Sockets:</span>
                <span className="text-emerald-400">0 DETECTED</span>
              </div>
            </div>
          </div>

          {/* Screen 6: Middle-Right Upper (Workflow Architecture Flowchart) */}
          <div
            onClick={() => onOpenModule && onOpenModule("automation")}
            className="p-3 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40 transition cursor-pointer"
          >
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-cyan-300 mb-2">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>WORKFLOW ARCHITECTURE</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400">ACTIVE PIPELINE</span>
            </div>

            {/* Connected Rectangular Flowchart Nodes */}
            <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
              <div className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold">
                Input Buffer
              </div>
              <span className="text-cyan-400 font-bold">➔</span>
              <div className="px-2 py-1 rounded-lg bg-purple-950 border border-purple-500 text-purple-300 font-bold">
                Q-Reasoning
              </div>
              <span className="text-cyan-400 font-bold">➔</span>
              <div className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                Execution
              </div>
            </div>
          </div>

          {/* Screen 7: Middle-Right Lower (Cyberpunk Code Terminal with line numbers) */}
          <div
            onClick={() => onOpenModule && onOpenModule("communication")}
            className="p-3 rounded-2xl bg-black/90 border border-purple-500/40 hover:border-purple-400 backdrop-blur-xl shadow-xl shadow-purple-950/40 transition cursor-pointer font-mono text-[11px]"
          >
            <div className="flex items-center justify-between text-purple-400 mb-1 border-b border-slate-800 pb-1">
              <span>auth_shield_daemon.ts</span>
              <span className="text-[9px] text-slate-500">TypeScript</span>
            </div>
            <div className="text-slate-300 space-y-0.5 select-text text-[10px] leading-relaxed">
              <div className="text-purple-300">1: const shield = new QuantumVault();</div>
              <div className="text-cyan-300">2: await shield.enforceAirGap(true);</div>
              <div className="text-emerald-300">3: return shield.rotateCipher('AES-4096');</div>
            </div>
          </div>

          {/* Screen 8: Bottom-Right (Segmented Donut Analytics Chart) */}
          <div className="p-3 rounded-2xl bg-slate-950/85 border border-cyan-500/40 hover:border-cyan-400 backdrop-blur-xl shadow-xl shadow-cyan-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Segmented SVG Donut Chart */}
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-800" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-400" strokeDasharray="60, 100" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-purple-500" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-400" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300">
                  85%
                </div>
              </div>

              <div>
                <span className="font-orbitron font-bold text-xs text-slate-200">
                  RESOURCE ANALYTICS
                </span>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Lattice Encryption Buffer: <strong className="text-cyan-300">Optimal</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM-LEFT DESK ACCESSORY: 3D HOLOGRAPHIC CRYSTAL CUBE */}
        {/* ========================================================= */}
        <div
          onClick={togglePrivacyCloak}
          title="Click to toggle Master Privacy Cloak & Redaction"
          className="absolute left-4 bottom-2 z-20 hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-slate-950/90 border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.5)] cursor-pointer group backdrop-blur-xl transition hover:scale-105"
        >
          {/* Glowing Glass Crystal Cube with Shield Inside (From reference image) */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-950 to-blue-900 border-2 border-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-400/40">
            <Shield className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>BIOMETRIC TOKEN PEDESTAL</span>
            </div>
            <div className="font-orbitron font-extrabold text-xs text-slate-100">
              {isPrivacyCloakActive ? "CLOAK ACTIVE" : "ARMED & READY"}
            </div>
            <span className="text-[9px] font-mono text-slate-400">Click to Redact Screen</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM-RIGHT DESK ACCESSORY: HARDWARE SERVER RACK UNIT */}
        {/* ========================================================= */}
        <div className="absolute right-4 bottom-2 z-20 hidden lg:flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs font-mono text-slate-400">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RACK-01: ONLINE</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER-BOTTOM FLOATING: LOGIC NODE MAP */}
        {/* ========================================================= */}
        <div className="absolute bottom-2 z-10 hidden xl:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md text-xs font-mono">
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            <span>NEURAL ENCRYPTED MESH:</span>
          </span>
          <span className="text-slate-300">PC Node</span>
          <span className="text-cyan-500">↔</span>
          <span className="text-purple-300">Mobile Device</span>
          <span className="text-cyan-500">↔</span>
          <span className="text-emerald-300">Studio Hardware</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 font-bold">Zero Leaks</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FOREGROUND PERSPECTIVE DESK TABLET: INTERACTIVE FLOWCHART CONSOLE */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full mt-1 perspective-1200 shrink-0">
        <div className="desk-transform p-3 md:p-3.5 rounded-3xl bg-slate-950/95 border-2 border-cyan-500/50 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>QUANTUM TACTICAL MACRO CONSOLE & DESK WORKSPACE CONTROLLER</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              TOUCH MATRIX ACTIVE • {allModulesList.length} SUITES LINKED
            </span>
          </div>

          {/* Quick-Launch Flowchart Blocks on the angled desk surface */}
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2 text-center text-xs font-mono">
            {allModulesList.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  if (item.id === "humanoid" && onOpenHumanoidStage) {
                    onOpenHumanoidStage();
                  } else if (onOpenModule) {
                    onOpenModule(item.id as any);
                  }
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  item.color
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold tracking-wider truncate w-full">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 11 Modules for the updated desk touch console
const allModulesList = [
  { id: "humanoid", label: "Humanoid", icon: <User className="w-4 h-4 text-pink-400" />, color: "bg-pink-950/60 border-pink-500/40 hover:border-pink-400 text-pink-300" },
  { id: "studio", label: "Media Studio", icon: <Film className="w-4 h-4 text-rose-400" />, color: "bg-rose-950/60 border-rose-500/40 hover:border-rose-400 text-rose-300" },
  { id: "desktop", label: "PC & Video", icon: <Monitor className="w-4 h-4 text-cyan-400" />, color: "bg-cyan-950/60 border-cyan-500/40 hover:border-cyan-400 text-cyan-300" },
  { id: "study", label: "Study Hub", icon: <GraduationCap className="w-4 h-4 text-purple-400" />, color: "bg-purple-950/60 border-purple-500/40 hover:border-purple-400 text-purple-300" },
  { id: "records", label: "Life Vault", icon: <Database className="w-4 h-4 text-indigo-400" />, color: "bg-indigo-950/60 border-indigo-500/40 hover:border-indigo-400 text-indigo-300" },
  { id: "health", label: "Health Guard", icon: <Heart className="w-4 h-4 text-emerald-400" />, color: "bg-emerald-950/60 border-emerald-500/40 hover:border-emerald-400 text-emerald-300" },
  { id: "finance", label: "Finance", icon: <DollarSign className="w-4 h-4 text-amber-400" />, color: "bg-amber-950/60 border-amber-500/40 hover:border-amber-400 text-amber-300" },
  { id: "automation", label: "Workflow", icon: <Terminal className="w-4 h-4 text-cyan-400" />, color: "bg-cyan-950/60 border-cyan-500/40 hover:border-cyan-400 text-cyan-300" },
  { id: "communication", label: "Comm & Code", icon: <Zap className="w-4 h-4 text-purple-400" />, color: "bg-purple-950/60 border-purple-500/40 hover:border-purple-400 text-purple-300" },
  { id: "maps", label: "Maps Radar", icon: <MapPin className="w-4 h-4 text-blue-400" />, color: "bg-blue-950/60 border-blue-500/40 hover:border-blue-400 text-blue-300" },
  { id: "devices", label: "Devices", icon: <Smartphone className="w-4 h-4 text-emerald-400" />, color: "bg-emerald-950/60 border-emerald-500/40 hover:border-emerald-400 text-emerald-300" },
];
