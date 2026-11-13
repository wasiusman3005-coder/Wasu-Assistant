import React, { useState } from "react";
import { Monitor, GraduationCap, Database, Heart, DollarSign, Target, Brain, Laptop, X, ArrowLeft, Sparkles, ChevronRight, LayoutGrid, MapPin, Smartphone, Globe, Radio } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { DesktopManager } from "./DesktopManager";
import { StudentStudyHub } from "./StudentStudyHub";
import { LifeRecordsManager } from "./LifeRecordsManager";
import { HealthLifestyleGuard } from "./HealthLifestyleGuard";
import { FinanceInvestManager } from "./FinanceInvestManager";
import { QuantumFocusAnalytics } from "./QuantumFocusAnalytics";
import { PersonalMemoryBank } from "./PersonalMemoryBank";
import { WorkflowAutomationSuite } from "./WorkflowAutomationSuite";
import { CommunicationCodingSuite } from "./CommunicationCodingSuite";
import { QuantumGeospatialMapSuite } from "./QuantumGeospatialMapSuite";
import { DigitalDeviceBridgeSuite } from "./DigitalDeviceBridgeSuite";
import { CreativeMediaStudio } from "./CreativeMediaStudio";
import { LanguageCode, VoiceGender, UserProfile } from "../types";
import { Film, Sparkles as SparkleIcon } from "lucide-react";

export type MatrixModuleId = "desktop" | "study" | "records" | "health" | "finance" | "focus" | "memory" | "automation" | "communication" | "maps" | "devices" | "studio";

interface QuantumAppsMatrixProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onOpenDesktopInstall: () => void;
  initialModule?: MatrixModuleId | null;
}

export const QuantumAppsMatrix: React.FC<QuantumAppsMatrixProps> = ({
  isOpen,
  onClose,
  language,
  voiceGender,
  userProfile,
  onUpdateProfile,
  onOpenDesktopInstall,
  initialModule = null,
}) => {
  const [activeModule, setActiveModule] = useState<MatrixModuleId | null>(initialModule);

  React.useEffect(() => {
    setActiveModule(initialModule);
  }, [initialModule, isOpen]);

  if (!isOpen) return null;

  const modules: {
    id: MatrixModuleId;
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badge: string;
    gradient: string;
    borderColor: string;
    textColor: string;
  }[] = [
    {
      id: "desktop",
      title: "PC & Video Editing Suite",
      subtitle: "Ryzen 9 & RTX 4090 telemetry, Premiere Pro & After Effects macros, file organizer",
      icon: Monitor,
      badge: "HARDWARE & APPS",
      gradient: "from-cyan-950/60 to-slate-950/90",
      borderColor: "border-cyan-500/40 hover:border-cyan-400",
      textColor: "text-cyan-300",
    },
    {
      id: "study",
      title: "Student Academic & Auto-Pilot Hub",
      subtitle: "Autonomous homework solver, exam countdown, coding, math & physics research notes",
      icon: GraduationCap,
      badge: "STUDY GENIUS",
      gradient: "from-purple-950/60 to-slate-950/90",
      borderColor: "border-purple-500/40 hover:border-purple-400",
      textColor: "text-purple-300",
    },
    {
      id: "records",
      title: "Universal Life Records Vault",
      subtitle: "Add, edit, delete and store every task, routine, habit, and memory for life",
      icon: Database,
      badge: "RECORD VAULT",
      gradient: "from-indigo-950/60 to-slate-950/90",
      borderColor: "border-indigo-500/40 hover:border-indigo-400",
      textColor: "text-indigo-300",
    },
    {
      id: "health",
      title: "Health & Lifestyle Guardian",
      subtitle: "8-glass hydration tracker, 20-20-20 eye rest breaks, high-protein diet log & posture guard",
      icon: Heart,
      badge: "HEALTH SHIELD",
      gradient: "from-emerald-950/60 to-slate-950/90",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      textColor: "text-emerald-300",
    },
    {
      id: "finance",
      title: "Finance & Fazool Kharchi Defense",
      subtitle: "Need vs Want AI analyzer, savings compounding simulator, monthly budget protector",
      icon: DollarSign,
      badge: "BUDGET SHIELD",
      gradient: "from-amber-950/60 to-slate-950/90",
      borderColor: "border-amber-500/40 hover:border-amber-400",
      textColor: "text-amber-300",
    },
    {
      id: "focus",
      title: "Quantum Deep Focus Chamber",
      subtitle: "25/50 min binaural Pomodoro timer, distraction blocker (shorts/reels), daily activity timeline",
      icon: Target,
      badge: "DEEP WORK",
      gradient: "from-blue-950/60 to-slate-950/90",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      textColor: "text-blue-300",
    },
    {
      id: "memory",
      title: "Commander Wasi Strategic Memory",
      subtitle: "Long-term goals, personal habit preferences, tech specs, and strategic vision",
      icon: Brain,
      badge: "NEURAL MEMORY",
      gradient: "from-teal-950/60 to-slate-950/90",
      borderColor: "border-teal-500/40 hover:border-teal-400",
      textColor: "text-teal-300",
    },
    {
      id: "automation",
      title: "Desktop & Workflow Automation",
      subtitle: "Screen OCR context scanner, app connectors (Gmail, Slack, Notion, GitHub, Jira), shell & Docker console, scheduled cron routines",
      icon: Monitor,
      badge: "WORKFLOW BOT",
      gradient: "from-cyan-950/60 to-slate-950/90",
      borderColor: "border-cyan-500/40 hover:border-cyan-400",
      textColor: "text-cyan-300",
    },
    {
      id: "communication",
      title: "Omni-Channel & Coding Copilot",
      subtitle: "WhatsApp/Slack auto-replies, Google Meet/Zoom scheduler, support helpdesk, multi-file coding, and smart task decomposition",
      icon: GraduationCap,
      badge: "COMM & CODE",
      gradient: "from-purple-950/60 to-slate-950/90",
      borderColor: "border-purple-500/40 hover:border-purple-400",
      textColor: "text-purple-300",
    },
    {
      id: "maps",
      title: "Geospatial Maps & Satellite Radar",
      subtitle: "Live Google Maps navigation, GPS coordinates tracking, distance telemetry, and device location radar",
      icon: MapPin,
      badge: "LIVE GPS RADAR",
      gradient: "from-blue-950/60 to-slate-950/90",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      textColor: "text-blue-300",
    },
    {
      id: "devices",
      title: "Digital Devices & Mobile Control Bridge",
      subtitle: "Mobile sync (Galaxy/iPhone), find my phone siren alarm, hotspot, smart RGB lights, and Hi-Fi audio DAC",
      icon: Smartphone,
      badge: "DEVICE MATRIX",
      gradient: "from-emerald-950/60 to-slate-950/90",
      borderColor: "border-emerald-500/40 hover:border-emerald-400",
      textColor: "text-emerald-300",
    },
    {
      id: "studio",
      title: "Creative AI Media & Auto-Post Studio",
      subtitle: "Video Generator, HD YouTube Thumbnail Maker, AI Image Studio, Screen Help & Auto Social Video Poster",
      icon: Film,
      badge: "MEDIA + AUTO POST",
      gradient: "from-rose-950/60 to-slate-950/90",
      borderColor: "border-rose-500/40 hover:border-rose-400",
      textColor: "text-rose-300",
    },
  ];

  const handleSelectModule = (modId: MatrixModuleId) => {
    soundEffects.playBeepConfirm();
    setActiveModule(modId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn font-rajdhani">
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeModule ? (
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setActiveModule(null);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1.5 text-xs font-mono transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO APPS MATRIX</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <LayoutGrid className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="font-orbitron font-bold text-base md:text-lg text-cyan-300 glow-text-cyan uppercase">
                    QUANTUM APPLICATIONS & OPERATIONS MATRIX
                  </h2>
                  <p className="text-xs font-mono text-slate-400">
                    All personal tools, study solvers, PC controllers and life vaults organized in one unified workspace
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {!activeModule ? (
            /* App Matrix Grid Selection */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleSelectModule(mod.id)}
                      className={`p-5 rounded-3xl bg-gradient-to-br ${mod.gradient} border ${mod.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center ${mod.textColor} group-hover:scale-110 transition`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 ${mod.textColor}`}>
                            {mod.badge}
                          </span>
                        </div>

                        <h3 className="font-orbitron font-bold text-base text-slate-100 group-hover:text-cyan-300 transition mb-1">
                          {mod.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                          {mod.subtitle}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                        <span>LAUNCH WORKSPACE</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}

                {/* PC Installer Card */}
                <div
                  onClick={() => {
                    soundEffects.playClick();
                    onOpenDesktopInstall();
                  }}
                  className="p-5 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-700 hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                        <Laptop className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                        DESKTOP PACKAGER
                      </span>
                    </div>

                    <h3 className="font-orbitron font-bold text-base text-slate-100 group-hover:text-cyan-300 transition mb-1">
                      PC Desktop App Installation Guide
                    </h3>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                      Download 1-click batch launcher or compile native Windows .exe installer with global Ctrl+Shift+J hotkey.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-cyan-300">
                    <span>VIEW INSTALLATION GUIDE</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Selected Active Workspace View */
            <div className="animate-fadeIn">
              {activeModule === "desktop" && (
                <DesktopManager language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "study" && (
                <StudentStudyHub language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "records" && (
                <LifeRecordsManager language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "health" && (
                <HealthLifestyleGuard language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "finance" && (
                <FinanceInvestManager language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "focus" && (
                <QuantumFocusAnalytics language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "memory" && (
                <PersonalMemoryBank
                  userProfile={userProfile}
                  onUpdateProfile={onUpdateProfile}
                  language={language}
                  voiceGender={voiceGender}
                />
              )}
              {activeModule === "automation" && (
                <WorkflowAutomationSuite language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "communication" && (
                <CommunicationCodingSuite language={language} voiceGender={voiceGender} />
              )}
              {activeModule === "maps" && (
                <QuantumGeospatialMapSuite
                  language={language}
                  voiceGender={voiceGender}
                  onSelectDevice={() => setActiveModule("devices")}
                />
              )}
              {activeModule === "devices" && (
                <DigitalDeviceBridgeSuite
                  language={language}
                  voiceGender={voiceGender}
                  onOpenMapLocation={() => setActiveModule("maps")}
                />
              )}
              {activeModule === "studio" && (
                <CreativeMediaStudio language={language} voiceGender={voiceGender} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
