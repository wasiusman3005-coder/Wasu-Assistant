import React, { useState } from "react";
import { Download, Laptop, Copy, Check, Terminal, X, ShieldCheck, Zap, GitBranch } from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { LanguageCode } from "../types";

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<"method1" | "method2" | "method3" | "method4">("method4");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, idx: number) => {
    soundEffects.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadBatch = () => {
    soundEffects.playBeepConfirm();
    const batContent = `@echo off
title Q-NEXUS: Quantum Tachyon Jarvis OS - Launcher
color 0b
echo ======================================================================
echo           Q-NEXUS: QUANTUM TACHYON JARVIS OS (PC LAUNCHER)
echo                     Commander: WASI (wasu3005)
echo ======================================================================
echo.
echo [1/2] Starting Quantum Engine...
start msedge --app=http://localhost:3000 --window-size=1440,900 || start chrome --app=http://localhost:3000 --window-size=1440,900 || start http://localhost:3000
echo Quantum Core Launched!
exit`;

    const blob = new Blob([batContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Start-Quantum-Jarvis.bat";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-rajdhani">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Laptop className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-orbitron font-bold text-base md:text-lg text-cyan-300 glow-text-cyan uppercase">
                PC DESKTOP APP INSTALLATION GUIDE
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Step-by-step instructions to turn Quantum Jarvis into a standalone PC desktop application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-3 gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("method4");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "method4"
                ? "bg-slate-950 text-emerald-400 font-bold border-t-2 border-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Method 4: GitHub + Python PC App & .EXE</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("method1");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "method1"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Method 1: Instant PWA Desktop</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("method2");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "method2"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Method 2: 1-Click .bat Launcher</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab("method3");
            }}
            className={`px-4 py-2 rounded-t-lg transition cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === "method3"
                ? "bg-slate-950 text-cyan-400 font-bold border-t-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Method 3: Electron .exe</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono">
          {activeTab === "method1" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 leading-relaxed">
                <strong className="text-cyan-300 font-bold text-sm block mb-1">
                  ⭐ Asaan aur Sabse Fast Tareeqa (No coding needed):
                </strong>
                Yeh tareeqa aapke Chrome ya Edge browser ki built-in PWA technology use kar ke Quantum Jarvis ko aik asli Windows application bana deta hai jo Taskbar aur Desktop icon ke sath chalti hai.
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Browser Menu Kholein:</strong>
                    Chrome ya Edge browser ke ooper right corner par <strong className="text-cyan-300">3 dots (Menu)</strong> par click karein.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Install Option Select Karein:</strong>
                    Menu mein <strong className="text-cyan-300">"Save and share"</strong> ya <strong className="text-cyan-300">"Apps"</strong> par hover karein aur <strong className="text-emerald-400">"Install Q-NEXUS: Quantum Tachyon Jarvis OS as App"</strong> par click karein.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-slate-200 block text-xs">Desktop Shortcut & Taskbar Pin:</strong>
                    Pop-up aane par <strong className="text-cyan-300">"Allow" / "Create Shortcut"</strong> par click karein.
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                ✅ Ab aapke PC ke desktop par Quantum Jarvis ka shortcut tayar hai. Jab bhi click kareinge yeh bina kisi URL bar ke full software ki tarah chalay ga!
              </div>
            </div>
          )}

          {activeTab === "method2" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 leading-relaxed">
                <strong className="text-purple-300 font-bold text-sm block mb-1">
                  ⚡ Windows 1-Click Batch File (.bat):
                </strong>
                Humne aapke liye <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">desktop/Start-Quantum-Jarvis.bat</code> file already project ke andar bana di hai.
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadBatch}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD Start-Quantum-Jarvis.bat</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400">File Code Preview:</span>
                <pre className="p-2.5 rounded bg-slate-950 text-slate-300 text-[11px] overflow-x-auto">
{`@echo off
title Q-NEXUS: Quantum Tachyon Jarvis OS - Launcher
start msedge --app=http://localhost:3000 --window-size=1440,900
exit`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === "method3" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-blue-200 leading-relaxed">
                <strong className="text-blue-300 font-bold text-sm block mb-1">
                  🛠️ Native Windows .exe Setup Builder (Electron):
                </strong>
                Project ke <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">desktop/electron-main.cjs</code> aur <code className="bg-slate-900 px-2 py-0.5 rounded text-cyan-300">desktop/package.json</code> files ke sath aap real installer compile kar sakte hain.
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-300">Step 1: Install Electron Packager</span>
                    <button
                      onClick={() => copyText("cd desktop && npm install", 1)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 1 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded text-cyan-300 text-[11px]">cd desktop && npm install</pre>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-300">Step 2: Generate .exe Installer</span>
                    <button
                      onClick={() => copyText("npm run dist", 2)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 2 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded text-cyan-300 text-[11px]">npm run dist</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                Build complete hone ke baad <code className="text-cyan-300">dist-electron/Quantum Jarvis OS Setup.exe</code> file create ho jayegi. Is par double-click kar ke aap ise kisi bhi Windows PC par install kar sakte hain!
              </div>
            </div>
          )}

          {activeTab === "method4" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100 leading-relaxed">
                <strong className="text-emerald-300 font-bold text-sm block mb-1">
                  🐍 GitHub Repository + Python 4K UHD PC App &amp; .EXE Installer:
                </strong>
                Tamam zarori files (<code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">jarvis_desktop.py</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">build_pc_app.py</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">requirements.txt</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">install_and_run.bat</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">README.md</code>, <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">.github/workflows/ci-build.yml</code>, aur desktop icons) project ke root mein already mojood hain!
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-200 font-bold">Step 1: GitHub par Push karein</span>
                    <button
                      onClick={() => copyText("git init && git add . && git commit -m \"Q-NEXUS Jarvis OS 4K UHD\" && git branch -M main", 10)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === 10 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 10 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded text-cyan-300 text-[11px] overflow-x-auto">git init &amp;&amp; git add . &amp;&amp; git commit -m &quot;Q-NEXUS Jarvis OS 4K UHD&quot; &amp;&amp; git branch -M main</pre>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-200 font-bold">Step 2: Windows 1-Click Installer &amp; Launch (Python)</span>
                    <button
                      onClick={() => copyText("install_and_run.bat", 11)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === 11 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 11 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded text-emerald-300 text-[11px] overflow-x-auto">install_and_run.bat   (ya manually: pip install -r requirements.txt &amp;&amp; python jarvis_desktop.py)</pre>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-200 font-bold">Step 3: PC mein Standalone .EXE App + Desktop Shortcut banayein</span>
                    <button
                      onClick={() => copyText("python build_pc_app.py", 12)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === 12 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 12 ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-950 rounded text-fuchsia-300 text-[11px] overflow-x-auto">python build_pc_app.py</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                <span className="text-emerald-400 font-bold">Output:</span> <code className="text-cyan-300">dist_pc/QuantumJarvisOS.exe</code> ban jayega aur Windows Desktop par <code className="text-cyan-300">Quantum Jarvis OS</code> shortcut icon bhi khud ba khud install ho jayega! Linux/Mac ke liye <code className="text-cyan-300">./install_and_run.sh</code> use karein.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400">
            Username: <span className="text-cyan-400">wasu3005</span> • Password Protected
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
