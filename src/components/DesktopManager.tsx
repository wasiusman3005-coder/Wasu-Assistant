import React, { useState, useEffect } from "react";
import { Monitor, Cpu, HardDrive, Zap, Play, FolderSync, Scissors, Palette, Trash2, Check, RefreshCw, FileText, Film, Image as ImageIcon, Music, Code2, Archive } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import { defaultMacros, defaultFiles } from "../services/storage";
import { EditingMacro, FileItem, LanguageCode, VoiceGender } from "../types";

interface DesktopManagerProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const DesktopManager: React.FC<DesktopManagerProps> = ({
  language,
  voiceGender,
}) => {
  // Live fluctuating telemetry
  const [cpuUsage, setCpuUsage] = useState(38);
  const [gpuUsage, setGpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(24.8);
  const [cpuTemp, setCpuTemp] = useState(48);
  const [gpuTemp, setGpuTemp] = useState(54);
  const [downloadMbps, setDownloadMbps] = useState(84.2);
  const [uploadMbps, setUploadMbps] = useState(38.6);

  // Active Softwares State
  const [activeApps, setActiveApps] = useState<{ [key: string]: boolean }>({
    "Adobe Premiere Pro": true,
    "Adobe After Effects": false,
    "Adobe Photoshop": false,
    "VS Code": true,
    "Google Chrome": true,
    "Blender": false,
    "OBS Studio": false,
  });

  // Macros & Files
  const [macros] = useState<EditingMacro[]>(defaultMacros);
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [isOrganizing, setIsOrganizing] = useState(false);
  const [activeMacroId, setActiveMacroId] = useState<string | null>(null);
  const [statusAlert, setStatusAlert] = useState<string | null>(null);

  // Fluctuating hardware stats loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.min(95, Math.max(18, prev + (Math.random() * 10 - 5))));
      setGpuUsage((prev) => Math.min(98, Math.max(22, prev + (Math.random() * 12 - 6))));
      setCpuTemp((prev) => Math.min(82, Math.max(42, Math.round(prev + (Math.random() * 2 - 1)))));
      setGpuTemp((prev) => Math.min(84, Math.max(45, Math.round(prev + (Math.random() * 2 - 1)))));
      setDownloadMbps((prev) => Math.max(20, parseFloat((prev + (Math.random() * 8 - 4)).toFixed(1))));
      setUploadMbps((prev) => Math.max(10, parseFloat((prev + (Math.random() * 4 - 2)).toFixed(1))));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Launch or Close an Application
  const toggleApp = (appName: string) => {
    soundEffects.playClick();
    const nextState = !activeApps[appName];
    setActiveApps((prev) => ({ ...prev, [appName]: nextState }));

    const vocalText = nextState
      ? language === "pa"
        ? `${appName} chala ditta ae Wasi paji!`
        : `${appName} launch kar diya gaya hai Wasi Sahab.`
      : language === "pa"
      ? `${appName} band kar ditta.`
      : `${appName} close kar diya gaya hai.`;

    setStatusAlert(vocalText);
    speechService.speak(vocalText, { lang: language, gender: voiceGender });
  };

  // Run an Editing Macro
  const runMacro = (macro: EditingMacro) => {
    soundEffects.playBeepConfirm();
    setActiveMacroId(macro.id);

    const voicePrompt =
      language === "pa"
        ? `${macro.title}: Macro chala reha aan Wasi paji. Editing stream updated.`
        : `${macro.title} command execute ho gaya hai Wasi Sahab.`;

    setStatusAlert(`EXECUTED: [${macro.software}] - ${macro.title}`);
    speechService.speak(voicePrompt, { lang: language, gender: voiceGender });

    setTimeout(() => {
      setActiveMacroId(null);
    }, 2000);
  };

  // Clean & Organize Files
  const handleOrganizeFiles = () => {
    soundEffects.playScan();
    setIsOrganizing(true);

    setTimeout(() => {
      // Update paths to suggested folders
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          path: f.suggestedFolder,
        }))
      );
      setIsOrganizing(false);
      soundEffects.playBeepConfirm();

      const vocalText =
        language === "pa"
          ? "Desktop te Downloads di saariyan files organize kar dittiyan ne Wasi paji!"
          : "Wasi Sahab, desktop aur downloads ki tamam files unke mutaluqa folders mein organize kar di gayi hain.";

      setStatusAlert("SUCCESS: All Desktop & Download files organized by category.");
      speechService.speak(vocalText, { lang: language, gender: voiceGender });
    }, 1800);
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

      {/* Hardware Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* CPU */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              RYZEN 9 7950X
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{cpuTemp}°C</span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2">
            {cpuUsage.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-cyan-400 h-full transition-all duration-500"
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>16 CORES / 32 THREADS</span>
            <span>4.85 GHz</span>
          </div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              RTX 4090 24GB
            </span>
            <span className="text-xs font-mono text-purple-400 font-bold">{gpuTemp}°C</span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2">
            {gpuUsage.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${gpuUsage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>CUDA & OPTIX CORES</span>
            <span>14.2 / 24 GB VRAM</span>
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              64GB DDR5 RAM
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">6000 MHz</span>
          </div>
          <div className="text-xl md:text-2xl font-orbitron font-bold text-slate-100 mb-2">
            {ramUsage.toFixed(1)} <span className="text-xs font-mono text-slate-400 font-normal">/ 64 GB</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${(ramUsage / 64) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
            <span>DUAL CHANNEL</span>
            <span>38% LOAD</span>
          </div>
        </div>

        {/* Network & SSD */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-blue-400" />
              NVMe SSD & NETWORK
            </span>
            <span className="text-xs font-mono text-blue-400 font-bold">1.2 TB FREE</span>
          </div>
          <div className="text-sm font-mono text-slate-200 mt-1">
            <div className="flex justify-between">
              <span className="text-slate-400">DOWN:</span>
              <span className="font-bold text-cyan-300">{downloadMbps} Mbps</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-400">UP:</span>
              <span className="font-bold text-purple-300">{uploadMbps} Mbps</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            GEN4 HIGH-SPEED READ/WRITE
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
              {files.map((file, idx) => {
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
                        → {file.suggestedFolder.split("/").pop()}
                      </span>
                    </div>
                  </div>
                );
              })}
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
