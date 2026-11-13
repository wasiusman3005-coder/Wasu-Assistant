import React, { useState, useEffect } from "react";
import { Monitor, Cpu, HardDrive, Zap, Play, FolderSync, Scissors, Palette, Trash2, Check, RefreshCw, FileText, Film, Image as ImageIcon, Music, Code2, Archive } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import {
  fetchSystemTelemetry,
  fetchSystemFiles,
  organizeSystemFiles,
  launchSystemApp,
  SystemTelemetry,
} from "../services/systemTelemetry";
import { defaultMacros } from "../services/storage";
import { EditingMacro, FileItem, LanguageCode, VoiceGender } from "../types";

interface DesktopManagerProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const DesktopManager: React.FC<DesktopManagerProps> = ({
  language,
  voiceGender,
}) => {
  // Real host PC telemetry state
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);

  // Active Softwares State synced from real host processes
  const [activeApps, setActiveApps] = useState<{ [key: string]: boolean }>({
    "VS Code": false,
    "Google Chrome": false,
    "Microsoft Edge": false,
    "Notepad": false,
    "File Explorer": false,
    "OBS Studio": false,
    "Blender": false,
    "Adobe Premiere Pro": false,
    "Adobe After Effects": false,
    "Adobe Photoshop": false,
  });

  // Macros & Real PC Files
  const [macros] = useState<EditingMacro[]>(defaultMacros);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [activeMacroId, setActiveMacroId] = useState<string | null>(null);
  const [statusAlert, setStatusAlert] = useState<string | null>(null);

  // Live host PC hardware & process polling loop
  useEffect(() => {
    let cancelled = false;

    const loadTelemetry = async () => {
      const data = await fetchSystemTelemetry();
      if (cancelled || !data) return;
      setTelemetry(data);
      if (data.runningApps && Object.keys(data.runningApps).length > 0) {
        setActiveApps((prev) => ({ ...prev, ...data.runningApps }));
      }
    };

    const loadFiles = async () => {
      setIsLoadingFiles(true);
      const realFiles = await fetchSystemFiles();
      if (!cancelled) {
        setFiles(realFiles);
        setIsLoadingFiles(false);
      }
    };

    loadTelemetry();
    loadFiles();
    const interval = setInterval(loadTelemetry, 2500);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Launch Real Application on Host PC
  const toggleApp = async (appName: string) => {
    soundEffects.playClick();
    try {
      const res = await launchSystemApp(appName);
      if (res.ok) {
        setActiveApps((prev) => ({ ...prev, [appName]: true }));
        const vocalText =
          language === "pa"
            ? `${appName} tuhade PC te launch kar ditta ae jaan!`
            : language === "en"
            ? `Launching ${appName} on your PC right now.`
            : `${appName} aapke PC par launch kar diya gaya hai jaan.`;
        setStatusAlert(res.message || `${appName} launched on your PC.`);
        speechService.speak(vocalText, { lang: language, gender: voiceGender });
      } else {
        setStatusAlert(res.message || `Could not launch ${appName}.`);
      }
    } catch {
      setStatusAlert(`Launch signal failed for ${appName}.`);
    }
  };

  // Run an Editing Macro
  const runMacro = (macro: EditingMacro) => {
    soundEffects.playBeepConfirm();
    setActiveMacroId(macro.id);

    const voicePrompt =
      language === "pa"
        ? `${macro.title}: Macro chala rahi aan Wasi jaan.`
        : `${macro.title} command execute ho gaya hai Wasi jaan.`;

    setStatusAlert(`EXECUTED: [${macro.software}] - ${macro.title}`);
    speechService.speak(voicePrompt, { lang: language, gender: voiceGender });

    setTimeout(() => {
      setActiveMacroId(null);
    }, 2000);
  };

  // Real Clean & Organize Desktop / Downloads Files on Host PC
  const handleOrganizeFiles = async () => {
    soundEffects.playScan();
    setIsOrganizing(true);

    try {
      const result = await organizeSystemFiles();
      setFiles(result.files);
      soundEffects.playBeepConfirm();

      const vocalText =
        language === "pa"
          ? `Desktop te Downloads di ${result.moved} files organize kar dittiyan ne jaan!`
          : `Wasi jaan, aapke PC ki ${result.moved} files unke mutaluqa folders mein organize kar di gayi hain.`;

      setStatusAlert(`SUCCESS: Organized ${result.moved} real file(s) into categorized folders.`);
      speechService.speak(vocalText, { lang: language, gender: voiceGender });
    } catch {
      setStatusAlert("Error organizing host files. Check permissions.");
    } finally {
      setIsOrganizing(false);
    }
  };

  return (
    <div className="space-y-6 font-rajdhani">
      {/* Alert Banner if any */}
      {statusAlert && (
        <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>⚡ {statusAlert}</span>
          <button
            onClick={() => setStatusAlert(null)}
            className="text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Live Host PC Hardware Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* CPU */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 truncate">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{telemetry?.cpuModel || "Detecting CPU..."}</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">
              {telemetry ? `${telemetry.cpuSpeedGhz} GHz` : "--"}
            </span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2">
            {telemetry ? `${telemetry.cpuUsagePercent.toFixed(1)}%` : "--"}
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-400 h-full transition-all duration-500"
              style={{ width: `${telemetry?.cpuUsagePercent || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>{telemetry ? `${telemetry.cpuCores} LOGICAL CORES` : "SCANNING CORES"}</span>
            <span>{telemetry?.arch?.toUpperCase() || "LIVE"}</span>
          </div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 truncate">
              <Zap className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">{telemetry?.gpuName || "Detecting GPU..."}</span>
            </span>
            <span className="text-[10px] font-mono text-purple-400 font-bold shrink-0">
              {telemetry?.gpuVramGb ? `${telemetry.gpuVramGb} GB` : "ACTIVE"}
            </span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2 truncate">
            {telemetry ? (telemetry.gpuVramGb ? `${telemetry.gpuVramGb} GB VRAM` : "ONLINE") : "--"}
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: telemetry ? "100%" : "0%" }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span className="truncate">{telemetry?.osCaption || "Host Display Bus"}</span>
            <span>{telemetry?.realHost ? "REAL HOST" : "SYNC"}</span>
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              PHYSICAL MEMORY
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {telemetry ? `${telemetry.ramPercent}% USED` : "--"}
            </span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2">
            {telemetry ? (
              <>
                {telemetry.ramUsedGb.toFixed(1)}{" "}
                <span className="text-xs font-mono text-slate-400 font-normal">/ {telemetry.ramTotalGb} GB</span>
              </>
            ) : (
              "--"
            )}
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${telemetry?.ramPercent || 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>HOST: {telemetry?.hostname || "LOCAL"}</span>
            <span>UP {telemetry ? `${telemetry.uptimeMinutes}m` : "--"}</span>
          </div>
        </div>

        {/* Storage & Network */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-blue-400" />
              DISK ({telemetry?.primaryDisk?.drive || "C:"}) & NET
            </span>
            <span className="text-xs font-mono text-blue-400 font-bold">
              {telemetry?.primaryDisk?.totalGb
                ? `${telemetry.primaryDisk.freeGb} GB FREE`
                : "PROBING..."}
            </span>
          </div>
          <div className="text-sm font-mono text-slate-200 mt-1">
            <div className="flex justify-between">
              <span className="text-slate-400">IPv4:</span>
              <span className="font-bold text-cyan-300 truncate">{telemetry?.ipAddress || "--"}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-400">DISK:</span>
              <span className="font-bold text-purple-300">
                {telemetry?.primaryDisk?.totalGb
                  ? `${telemetry.primaryDisk.usedGb} / ${telemetry.primaryDisk.totalGb} GB`
                  : "--"}
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="truncate">
              {telemetry?.batteryPercent !== null && telemetry?.batteryPercent !== undefined
                ? `BATTERY ${telemetry.batteryPercent}%${telemetry.isCharging ? " (CHARGING)" : ""}`
                : `${telemetry?.netInterface || "LAN"} • LIVE`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Applications Launcher & Video Editing Macros */}
        <div className="space-y-6">
          {/* Applications Launcher */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-base text-cyan-400 uppercase">
                  DESKTOP APPLICATION SUITE
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">VOICE COMMAND LAUNCHABLE</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(activeApps).map(([appName, isActive]) => (
                <button
                  key={appName}
                  onClick={() => toggleApp(appName)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-950/50"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-semibold truncate">{appName}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-emerald-400 animate-pulse" : "bg-slate-700"
                      }`}
                    ></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {isActive ? "RUNNING" : "CLICK TO LAUNCH"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Video Editing Softwares Macro Hub */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-purple-400" />
                <h3 className="font-orbitron font-bold text-base text-purple-400 uppercase">
                  EDITING AUTOMATION MACROS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ONE-CLICK EXECUTE</span>
            </div>

            <div className="space-y-2.5">
              {macros.map((m) => {
                const isRunning = activeMacroId === m.id;
                return (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                          {m.software}
                        </span>
                        <h4 className="font-semibold text-xs text-slate-100 truncate">{m.title}</h4>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Voice Prompt ({language}):{" "}
                        <span className="text-cyan-300">
                          "{language === "pa" ? m.voicePromptPunjabi : language === "en" ? m.voicePromptEnglish : m.voicePromptUrdu}"
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => runMacro(m)}
                      disabled={isRunning}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        isRunning
                          ? "bg-emerald-500 text-slate-950 animate-pulse"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/50"
                      }`}
                    >
                      {isRunning ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isRunning ? "EXECUTED" : "RUN"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Smart File Organizer & Batch Rename */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderSync className="w-5 h-5 text-emerald-400" />
                <h3 className="font-orbitron font-bold text-base text-emerald-400 uppercase">
                  SMART FILE ORGANIZER
                </h3>
              </div>
              <button
                onClick={handleOrganizeFiles}
                disabled={isOrganizing}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/50 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isOrganizing ? "animate-spin" : ""}`} />
                <span>{isOrganizing ? "CLEANING..." : "CLEAN & ORGANIZE"}</span>
              </button>
            </div>

            <p className="text-xs font-mono text-slate-400 mb-3">
              Detects scattered video files, thumbnails, and scripts on Desktop & Downloads and automatically sorts them into project archives.
            </p>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {isLoadingFiles ? (
                <div className="p-6 text-center text-xs font-mono text-slate-400">
                  Scanning your real Desktop, Downloads & Documents...
                </div>
              ) : files.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-400">
                  No loose unorganized files detected in Desktop, Downloads, or Documents!
                </div>
              ) : (
                files.map((file, idx) => {
                  const Icon =
                    file.type === "video"
                      ? Film
                      : file.type === "image"
                      ? ImageIcon
                      : file.type === "audio"
                      ? Music
                      : file.type === "code"
                      ? Code2
                      : file.type === "archive"
                      ? Archive
                      : FileText;

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-slate-900 text-cyan-400 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-200 truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span className="text-slate-400 truncate">{file.path}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20">
                          → {file.suggestedFolder.split(/[/\\]/).pop()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Voice Automation Tips */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-xs font-mono text-slate-400 space-y-1.5">
            <div className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span>💡 VOICE COMMAND SHORTCUTS FOR WASI:</span>
            </div>
            <div>• "Jarvis, Premiere Pro open karo aur silence cut macro chalao."</div>
            <div>• "Jarvis, desktop ki tamam b-roll files organize kar do."</div>
            <div>• "Jarvis, GPU temperature check karo aur After Effects cache purge karo."</div>
          </div>
        </div>
      </div>
    </div>
  );
};
