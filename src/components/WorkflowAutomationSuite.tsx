import React, { useState } from "react";
import {
  Scan,
  Terminal,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Power,
  ExternalLink,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  FileText,
  Send,
  Database,
  GitBranch,
  Calendar,
  Slack,
  Mail,
  Github,
  Trello,
  FolderGit2,
  Check,
  Zap,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import {
  LanguageCode,
  VoiceGender,
  AppConnectorItem,
  DockerContainerItem,
  ScheduledRoutineItem,
} from "../types";

interface WorkflowAutomationSuiteProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const WorkflowAutomationSuite: React.FC<WorkflowAutomationSuiteProps> = ({
  language,
  voiceGender,
}) => {
  const [activeTab, setActiveTab] = useState<"screen" | "connectors" | "shell" | "routines">("screen");

  // ----------------------------------------------------
  // 1. SCREEN & CONTEXT AWARENESS STATE
  // ----------------------------------------------------
  const [screenContextType, setScreenContextType] = useState<"spreadsheet" | "code" | "document">("code");
  const [isScanning, setIsScanning] = useState(false);
  const [screenContent, setScreenContent] = useState(
    `// authMiddleware.ts - Line 42\nexport const verifyToken = (req: Request, res: Response, next: NextFunction) => {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "Missing Bearer Token" });\n  // TODO: Fix potential memory leak in JWT verify callback\n  jwt.verify(token, process.env.JWT_SECRET);\n  next();\n};`
  );
  const [scanAnalysis, setScanAnalysis] = useState<{
    summary: string;
    detectedIssues: string[];
    suggestedFix: string;
    actionLabel: string;
  } | null>({
    summary: "Active VS Code Window: TypeScript authentication middleware with potential unhandled exception in jwt.verify.",
    detectedIssues: [
      "Missing try/catch around synchronous jwt.verify call.",
      "Unfinished TODO: JWT verify callback memory leak at line 46.",
      "CORS headers not validated before header extraction.",
    ],
    suggestedFix:
      "Wrap jwt.verify in try/catch block and dispatch automated patch to VS Code buffer.",
    actionLabel: "Auto-Apply Patch to VS Code",
  });

  const handleScreenScan = () => {
    soundEffects.playScan();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      soundEffects.playBeepConfirm();

      if (screenContextType === "spreadsheet") {
        setScanAnalysis({
          summary: "Active Excel / Google Sheets: Q4 Workstation Budget & Cash Flow Forecast.",
          detectedIssues: [
            "Formula in cell G18 (#REF!) references deleted GPU depreciation row.",
            "Fazool Kharchi detected: 3 duplicate SaaS recurring tool subscriptions.",
          ],
          suggestedFix: "Correct formula to =SUM(G4:G17) and flag redundant SaaS charges for Commander Wasi.",
          actionLabel: "Auto-Clean Spreadsheet Formulas",
        });
      } else if (screenContextType === "document") {
        setScanAnalysis({
          summary: "Active Document: Client Video Production Service Level Agreement (SLA).",
          detectedIssues: [
            "Missing late delivery penalty clause on 4K video exports.",
            "Payment milestone at Section 3.2 lacks bank transfer timeframe.",
          ],
          suggestedFix: "Inject standard 5-day net revision clause and export signed PDF.",
          actionLabel: "Insert Standard Terms & Export PDF",
        });
      } else {
        setScanAnalysis({
          summary: "Active VS Code Buffer: Node.js Express Controller with JWT authentication.",
          detectedIssues: [
            "Missing error handler for expired token.",
            "Environment variable JWT_SECRET not asserted non-empty.",
          ],
          suggestedFix: "Inject defensive verification block with typed response payload.",
          actionLabel: "Auto-Apply Patch to VS Code",
        });
      }

      const vocalPrompt =
        language === "pa"
          ? "Screen analyze ho gayi ae Wasi paji! Issues te auto-fix ready ne."
          : "Screen context scan complete. Actionable fixes and workflow triggers ready.";
      speechService.speak(vocalPrompt, { lang: language, gender: voiceGender });
    }, 1100);
  };

  // ----------------------------------------------------
  // 2. CONNECTORS & INTEGRATIONS STATE
  // ----------------------------------------------------
  const [connectors, setConnectors] = useState<AppConnectorItem[]>([
    {
      id: "conn-1",
      name: "Gmail",
      category: "communication",
      connected: true,
      statusText: "Synced (3 Unread Client Inquiries)",
      lastSync: "Just now",
      activeItemsCount: 3,
      quickActionLabel: "Draft Quick Reply",
    },
    {
      id: "conn-2",
      name: "Slack",
      category: "communication",
      connected: true,
      statusText: "#production-team (5 unread mentions)",
      lastSync: "2m ago",
      activeItemsCount: 5,
      quickActionLabel: "Send Standup Summary",
    },
    {
      id: "conn-3",
      name: "GitHub",
      category: "development",
      connected: true,
      statusText: "q-nexus-core repo (2 open PRs, all CI green)",
      lastSync: "5m ago",
      activeItemsCount: 2,
      quickActionLabel: "Review Recent Commits",
    },
    {
      id: "conn-4",
      name: "Google Calendar",
      category: "productivity",
      connected: true,
      statusText: "Next: Sprint Demo at 04:30 PM",
      lastSync: "Just now",
      activeItemsCount: 1,
      quickActionLabel: "Check Meeting Conflicts",
    },
    {
      id: "conn-5",
      name: "Notion",
      category: "productivity",
      connected: true,
      statusText: "Master Roadmap & Habits Database connected",
      lastSync: "12m ago",
      activeItemsCount: 8,
      quickActionLabel: "Append Today's Notes",
    },
    {
      id: "conn-6",
      name: "Jira",
      category: "project",
      connected: false,
      statusText: "Disconnected (OAuth ready)",
      lastSync: "Never",
      activeItemsCount: 0,
      quickActionLabel: "Connect Jira Workspace",
    },
    {
      id: "conn-7",
      name: "Trello",
      category: "project",
      connected: true,
      statusText: "Video Projects Board (3 cards in Review)",
      lastSync: "25m ago",
      activeItemsCount: 3,
      quickActionLabel: "Move Card to Done",
    },
    {
      id: "conn-8",
      name: "Asana",
      category: "project",
      connected: false,
      statusText: "Standby for API token",
      lastSync: "Never",
      activeItemsCount: 0,
      quickActionLabel: "Authenticate Asana",
    },
  ]);

  const toggleConnector = (id: string) => {
    soundEffects.playClick();
    setConnectors((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              connected: !c.connected,
              statusText: !c.connected ? "Connected & Synced" : "Disconnected",
              lastSync: "Just now",
            }
          : c
      )
    );
  };

  // ----------------------------------------------------
  // 3. SHELL COMMANDS & DOCKER CONSOLE STATE
  // ----------------------------------------------------
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Q-NEXUS Kernel Shell v2.6 [Windows 11 Pro - Direct Socket Bridge]",
    "Type 'help' or click presets below to execute host system operations.",
    "> docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'",
    "NAMES             STATUS         PORTS",
    "q-nexus-db        Up 4 hours     0.0.0.0:5432->5432/tcp",
    "redis-cache       Up 4 hours     0.0.0.0:6379->6379/tcp",
    "ollama-local-llm  Up 2 hours     0.0.0.0:11434->11434/tcp",
  ]);
  const [cmdInput, setCmdInput] = useState("");

  const [dockerContainers, setDockerContainers] = useState<DockerContainerItem[]>([
    {
      id: "c-1",
      name: "q-nexus-db",
      image: "postgres:16-alpine",
      status: "running",
      uptime: "4h 28m",
      cpuPercent: 1.4,
      memUsageMb: 142,
      ports: "5432:5432",
    },
    {
      id: "c-2",
      name: "redis-cache",
      image: "redis:7.2-alpine",
      status: "running",
      uptime: "4h 28m",
      cpuPercent: 0.6,
      memUsageMb: 68,
      ports: "6379:6379",
    },
    {
      id: "c-3",
      name: "ollama-local-llm",
      image: "ollama/ollama:latest",
      status: "running",
      uptime: "2h 15m",
      cpuPercent: 4.8,
      memUsageMb: 2450,
      ports: "11434:11434",
    },
    {
      id: "c-4",
      name: "q-nexus-worker",
      image: "node:22-bullseye-slim",
      status: "stopped",
      uptime: "Exited (0) 1h ago",
      cpuPercent: 0.0,
      memUsageMb: 0,
      ports: "3001:3001",
    },
  ]);

  const runShellCommand = (cmdToRun?: string) => {
    const command = (cmdToRun || cmdInput).trim();
    if (!command) return;

    soundEffects.playClick();
    setCmdInput("");

    let output = "";
    if (command.toLowerCase().includes("docker ps")) {
      output = "CONTAINER ID   IMAGE                 STATUS         NAMES\na4b2c1d0       postgres:16-alpine    Up 4 hours     q-nexus-db\ne7f8g9h0       redis:7.2-alpine      Up 4 hours     redis-cache\n11223344       ollama/ollama:latest  Up 2 hours     ollama-local-llm";
    } else if (command.toLowerCase().includes("git status")) {
      output = "On branch main\nYour branch is up to date with 'origin/main'.\nChanges not staged for commit:\n  modified: src/components/WorkflowAutomationSuite.tsx\nno changes added to commit (use 'git add')";
    } else if (command.toLowerCase().includes("git log")) {
      output = "commit 7f4a2b9 (HEAD -> main) feat: add screen context awareness & docker orchestration\ncommit 9d1e8c4 fix: auto-morphing UHD logo design transitions\ncommit 3a5b7c1 chore: optimize 4K font antialiasing";
    } else if (command.toLowerCase().includes("systeminfo")) {
      output = "Host: AMD Ryzen 9 7950X 16-Core Processor\nGPU: NVIDIA GeForce RTX 4090 24GB GDDR6X\nOS: Windows 11 Pro 64-bit Build 26100\nTotal RAM: 64 GB DDR5-6000\nPCIe NVMe: 2TB Samsung 990 Pro (Read: 12,400 MB/s)";
    } else {
      output = `[OK] Command executed: '${command}' (Status: Process 0 finished in 42ms)`;
    }

    setTerminalHistory((prev) => [...prev, `> ${command}`, output]);
  };

  const toggleDockerContainer = (id: string) => {
    soundEffects.playBeepConfirm();
    setDockerContainers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "running" ? "stopped" : "running";
          return {
            ...c,
            status: nextStatus,
            uptime: nextStatus === "running" ? "Just started (0m)" : "Stopped by Commander",
          };
        }
        return c;
      })
    );
  };

  // ----------------------------------------------------
  // 4. SCHEDULED ROUTINES & WORKFLOWS STATE
  // ----------------------------------------------------
  const [routines, setRoutines] = useState<ScheduledRoutineItem[]>([
    {
      id: "r-1",
      title: "09:00 AM Morning Briefing & Workstation Setup",
      schedule: "Every Day @ 09:00 AM",
      category: "workflow",
      steps: [
        "Pull latest git changes across active development repositories",
        "Inspect Google Calendar and compile daily meeting timetable",
        "Check 3 unread client Gmail threads and draft summaries",
        "Vocal morning briefing hands-free with Pakistani Urdu/Punjabi greeting",
      ],
      enabled: true,
      lastExecuted: "Today, 09:00 AM [Completed 100%]",
    },
    {
      id: "r-2",
      title: "Daily Cache Purge & Premiere Temp Cleanup",
      schedule: "Every Night @ 11:30 PM",
      category: "maintenance",
      steps: [
        "Purge Adobe Premiere Pro & After Effects disk media cache",
        "Prune unused Docker images & prune dangling build volumes",
        "Run TRIM on 2TB NVMe PCIe 5.0 SSD storage",
        "Generate encrypted local JSON backup snapshot",
      ],
      enabled: true,
      lastExecuted: "Yesterday, 11:30 PM [Completed 100%]",
    },
    {
      id: "r-3",
      title: "Ergonomic 45-Min Screen Rest & Hydration Enforcer",
      schedule: "Every 45 Minutes of Continuous Screen Use",
      category: "health",
      steps: [
        "Lock screen for mandatory 5-minute eye relaxation",
        "Trigger spoken hydration notification: 'Drink 300ml fresh water'",
        "Log 20-20-20 distance vision relaxation metric",
      ],
      enabled: true,
      lastExecuted: "32 mins ago",
    },
  ]);

  const toggleRoutine = (id: string) => {
    soundEffects.playClick();
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const executeRoutineNow = (routine: ScheduledRoutineItem) => {
    soundEffects.playBeepConfirm();
    speechService.speak(
      `Running scheduled routine: ${routine.title}. All steps initiated autonomously.`,
      { lang: language, gender: voiceGender }
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-rajdhani select-none overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-3 mb-4 overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("screen");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "screen"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-cyan-300 border border-slate-800"
          }`}
        >
          <Scan className="w-4 h-4" />
          <span>SCREEN & CONTEXT AWARENESS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("connectors");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "connectors"
              ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-purple-300 border border-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>APP CONNECTORS & TOOLS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("shell");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "shell"
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-emerald-300 border border-slate-800"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>SHELL & DOCKER CONSOLE</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("routines");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "routines"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-amber-300 border border-slate-800"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>SCHEDULED ROUTINES</span>
        </button>
      </div>

      {/* Tab 1: Screen & Context Awareness */}
      {activeTab === "screen" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                  AUTONOMOUS SCREEN OCR & REASONING
                </span>
                <span className="text-[10px] font-mono text-emerald-400">NO MANUAL COPY-PASTING REQUIRED</span>
              </div>
              <h3 className="text-lg font-orbitron font-bold text-slate-100 mt-1">
                Active Desktop Context Vision Scanner
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Reads spreadsheets, code buffers, and contracts directly to suggest and execute instant fixes.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setScreenContextType("code");
                  setScreenContent(
                    `// authMiddleware.ts - Line 42\nexport const verifyToken = (req: Request, res: Response, next: NextFunction) => {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "Missing Bearer Token" });\n  jwt.verify(token, process.env.JWT_SECRET);\n  next();\n};`
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  screenContextType === "code"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-400"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScreenContextType("spreadsheet");
                  setScreenContent(
                    `[Excel: Workstation_Q4_Financials.xlsx]\nCell A1: Gross Revenue: PKR 850,000\nCell B2: Video Editing Retainers: PKR 420,000\nCell G18: #REF! [Formula Error in Depreciation]\nRow 22: Redundant SaaS Subscriptions: PKR 28,500`
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  screenContextType === "spreadsheet"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-400"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Spreadsheet</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setScreenContextType("document");
                  setScreenContent(
                    `[Word Document: Production_SLA_Contract_Draft.docx]\nClient: TechStudio Media Ltd.\nDeliverables: (4) 4K Commercial Edits per month\nMilestone: Payment upon final approval\nClause 4: Missing standard 5-day net revision window.`
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  screenContextType === "document"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-400"
                    : "bg-slate-950 text-slate-400 border border-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document</span>
              </button>

              <button
                type="button"
                onClick={handleScreenScan}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Scan className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
                <span>{isScanning ? "SCANNING..." : "SCAN SCREEN"}</span>
              </button>
            </div>
          </div>

          {/* Screen Content Buffer & AI Analysis Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Live Buffer View */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Active Captured Window Buffer</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">Live OCR Stream</span>
                </div>
                <textarea
                  value={screenContent}
                  onChange={(e) => setScreenContent(e.target.value)}
                  rows={8}
                  className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="text-[10px] font-mono text-slate-500 mt-2 flex justify-between">
                <span>Auto-refreshes on window focus change</span>
                <span>Encoding: UTF-8</span>
              </div>
            </div>

            {/* AI Context Intelligence Card */}
            {scanAnalysis && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-orbitron font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>QUANTUM CONTEXT ANALYSIS</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      CONFIDENCE: 99.4%
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-300 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    {scanAnalysis.summary}
                  </p>

                  <div className="text-[11px] font-mono font-semibold text-slate-400 mb-1">
                    Detected Anomalies & Inefficiencies:
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {scanAnalysis.detectedIssues.map((issue, idx) => (
                      <li
                        key={idx}
                        className="text-xs font-mono text-amber-300 flex items-start gap-2 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs font-mono text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                    <strong>Autonomous Recommendation: </strong>
                    {scanAnalysis.suggestedFix}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playBeepConfirm();
                    speechService.speak(
                      `Executing: ${scanAnalysis.actionLabel}. Workspace updated.`,
                      { lang: language, gender: voiceGender }
                    );
                  }}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>{scanAnalysis.actionLabel}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: App Integrations & Connectors */}
      {activeTab === "connectors" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex items-center justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-sm text-purple-300">
                Connected Workplace Ecosystem
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Direct API and webhook bridges into your professional apps.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-400">
              Active Connectors: {connectors.filter((c) => c.connected).length} / {connectors.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {connectors.map((connector) => {
              const IconComp =
                connector.name === "Gmail"
                  ? Mail
                  : connector.name === "Slack"
                  ? Slack
                  : connector.name === "GitHub"
                  ? Github
                  : connector.name === "Google Calendar"
                  ? Calendar
                  : connector.name === "Trello"
                  ? Trello
                  : connector.name === "Jira"
                  ? FolderGit2
                  : Layers;

              return (
                <div
                  key={connector.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    connector.connected
                      ? "bg-slate-950/80 border-slate-800 hover:border-purple-400/60 shadow-lg"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            connector.connected
                              ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                              : "bg-slate-900 text-slate-600 border border-slate-800"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-orbitron font-bold text-xs text-slate-200">
                          {connector.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleConnector(connector.id)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition ${
                          connector.connected
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-900 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {connector.connected ? "CONNECTED" : "OFFLINE"}
                      </button>
                    </div>

                    <div className="text-xs font-mono text-slate-300 my-2 line-clamp-2">
                      {connector.statusText}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 mt-2">
                    <button
                      type="button"
                      disabled={!connector.connected}
                      onClick={() => {
                        soundEffects.playBeepConfirm();
                        speechService.speak(
                          `Triggering ${connector.name} action: ${connector.quickActionLabel}`,
                          { lang: language, gender: voiceGender }
                        );
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-purple-950 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-purple-200 text-[11px] font-mono transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>{connector.quickActionLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Shell & Docker Console */}
      {activeTab === "shell" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Docker Containers Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-orbitron font-bold text-emerald-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>LOCAL DOCKER MICROSERVICES & CONTAINERS</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Engine: Docker Desktop v27 • WSL2 Backend
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dockerContainers.map((container) => (
                <div
                  key={container.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-slate-200 truncate">{container.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          container.status === "running"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : "bg-red-950 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {container.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{container.image}</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-1">Ports: {container.ports}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between">
                    <span className="text-slate-400">CPU: {container.cpuPercent}%</span>
                    <button
                      type="button"
                      onClick={() => toggleDockerContainer(container.id)}
                      className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[10px] cursor-pointer flex items-center gap-1"
                    >
                      <Power className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{container.status === "running" ? "Stop" : "Start"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Shell Console */}
          <div className="p-4 rounded-2xl bg-black border border-slate-800 flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-2 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Host OS Command Prompt [Administrator]</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => runShellCommand("git status")}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] hover:text-cyan-300 cursor-pointer"
                >
                  git status
                </button>
                <button
                  type="button"
                  onClick={() => runShellCommand("docker ps")}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] hover:text-cyan-300 cursor-pointer"
                >
                  docker ps
                </button>
                <button
                  type="button"
                  onClick={() => runShellCommand("systeminfo")}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] hover:text-cyan-300 cursor-pointer"
                >
                  systeminfo
                </button>
              </div>
            </div>

            <div className="h-44 overflow-y-auto space-y-1 text-slate-300 pr-1 select-text">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith(">") ? "text-cyan-400 font-bold" : "text-slate-300"}>
                  {line}
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runShellCommand();
              }}
              className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800"
            >
              <span className="text-emerald-400 font-bold">&gt;</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="Type command (e.g. git log, docker restart q-nexus-db, npm test)..."
                className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3 h-3 text-cyan-400" />
                <span>Execute</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 4: Scheduled Routines */}
      {activeTab === "routines" && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
            <div>
              <h3 className="font-orbitron font-bold text-sm text-amber-300">
                Automated Multi-Step Scheduled Routines
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Recurring maintenance, standups, and health rituals triggered automatically by timer or voice.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEffects.playBeepConfirm();
                speechService.speak(
                  "All routine schedules are verified active and running in background.",
                  { lang: language, gender: voiceGender }
                );
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-mono cursor-pointer hover:bg-amber-900 transition"
            >
              Verify Active Timers
            </button>
          </div>

          <div className="space-y-3">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`p-4 rounded-2xl border transition-all ${
                  routine.enabled
                    ? "bg-slate-950/80 border-slate-800 hover:border-amber-400/50"
                    : "bg-slate-950/40 border-slate-900 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-orbitron font-bold text-sm text-slate-200">
                      {routine.title}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400">
                      Schedule: {routine.schedule}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => executeRoutineNow(routine)}
                      className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-mono cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3 text-amber-400" />
                      <span>Run Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleRoutine(routine.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-mono cursor-pointer transition ${
                        routine.enabled
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-900 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {routine.enabled ? "ENABLED" : "PAUSED"}
                    </button>
                  </div>
                </div>

                {/* Steps List */}
                <div className="space-y-1.5 mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                    Multi-Step Action Pipeline:
                  </div>
                  {routine.steps.map((step, sIdx) => (
                    <div key={sIdx} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                        {sIdx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>Last Executed: {routine.lastExecuted}</span>
                  <span className="text-emerald-400">Zero Error Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
