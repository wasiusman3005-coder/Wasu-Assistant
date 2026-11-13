import React, { useState } from "react";
import {
  MessageSquare,
  Video,
  Code2,
  GitPullRequest,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  ExternalLink,
  LifeBuoy,
  Search,
  Copy,
  Check,
  Bot,
  User,
  AlertTriangle,
  FolderTree,
  FileCode2,
  ListTodo,
  Layers,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import {
  LanguageCode,
  VoiceGender,
  CommMessageItem,
  MeetingItem,
  SupportTicketItem,
  DecomposedTaskItem,
  JiraGitHubIssueItem,
} from "../types";

interface CommunicationCodingSuiteProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
}

export const CommunicationCodingSuite: React.FC<CommunicationCodingSuiteProps> = ({
  language,
  voiceGender,
}) => {
  const [activeTab, setActiveTab] = useState<"messaging" | "meetings" | "support" | "coding">("messaging");

  // ----------------------------------------------------
  // 1. MESSAGING & OMNI-CHANNEL STATE
  // ----------------------------------------------------
  const [messages, setMessages] = useState<CommMessageItem[]>([
    {
      id: "msg-1",
      platform: "whatsapp",
      sender: "Client: Bilal Production Lead",
      snippet: "Assalam o Alaikum Wasi bhai, jo YouTube 4K master review tha kya wo ready ho gaya hai aaj rat tak?",
      receivedTime: "12m ago",
      priority: "urgent",
      autoDraftReply:
        "Walaikum Assalam Bilal bhai! Ji bilkul, 4K Color Grade aur audio mix complete ho chuka hai. Shaam 6:00 PM tak Google Drive link share kar doonga.",
      status: "unread",
    },
    {
      id: "msg-2",
      platform: "slack",
      sender: "#dev-backend: Sarah Tech Architect",
      snippet: "Hey Wasi, did you push the Redis session store PR? We're preparing the staging deployment.",
      receivedTime: "25m ago",
      priority: "high",
      autoDraftReply:
        "Yes Sarah, the PR #42 is up with all integration tests passing. CI/CD verified clean on branch main.",
      status: "unread",
    },
    {
      id: "msg-3",
      platform: "telegram",
      sender: "Creative Circle: Usman 3D Artist",
      snippet: "Paji Blender 4.2 render scene da textures file link send kar dyo please.",
      receivedTime: "1h ago",
      priority: "normal",
      autoDraftReply:
        "Haanji Usman paji! Main D-drive te zip compress karke link foran Telegram te bhej reha aan.",
      status: "unread",
    },
  ]);
  const [selectedMessage, setSelectedMessage] = useState<CommMessageItem>(messages[0]);
  const [editableDraft, setEditableDraft] = useState(messages[0].autoDraftReply);
  const [replyLang, setReplyLang] = useState<LanguageCode>("ur");
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleSelectMessage = (msg: CommMessageItem) => {
    soundEffects.playClick();
    setSelectedMessage(msg);
    setEditableDraft(msg.autoDraftReply);
  };

  const handleSendReply = () => {
    soundEffects.playBeepConfirm();
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMessage.id
          ? { ...m, status: "replied", autoDraftReply: editableDraft }
          : m
      )
    );
    const feedback =
      language === "pa"
        ? `${selectedMessage.platform} te reply send ho gaya ae Wasi paji!`
        : `Reply sent successfully via ${selectedMessage.platform.toUpperCase()}.`;
    speechService.speak(feedback, { lang: language, gender: voiceGender });
  };

  const handleCopyDraft = () => {
    soundEffects.playClick();
    navigator.clipboard.writeText(editableDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  // ----------------------------------------------------
  // 2. MEETING & CALL COORDINATION STATE
  // ----------------------------------------------------
  const [meetings, setMeetings] = useState<MeetingItem[]>([
    {
      id: "meet-1",
      title: "Sprint Retrospective & Video Pipeline Review",
      platform: "Google Meet",
      time: "Today, 04:30 PM - 05:15 PM",
      durationMinutes: 45,
      attendees: ["wasi@studio.com", "bilal.lead@media.com", "sarah@tech.io"],
      link: "https://meet.google.com/qnx-wasi-demo",
      conflictDetected: false,
    },
    {
      id: "meet-2",
      title: "Global Client Brand Strategy & Monetization",
      platform: "Zoom",
      time: "Tomorrow, 07:00 PM - 08:00 PM",
      durationMinutes: 60,
      attendees: ["wasi@studio.com", "director@nyagency.com"],
      link: "https://zoom.us/j/987831856092",
      conflictDetected: false,
    },
    {
      id: "meet-3",
      title: "Quick 15-Min Workstation Hardware Check",
      platform: "Google Meet",
      time: "Tomorrow, 07:45 PM - 08:00 PM",
      durationMinutes: 15,
      attendees: ["wasi@studio.com", "it-support@cloud.com"],
      link: "https://meet.google.com/qnx-hw-check",
      conflictDetected: true, // Overlaps with Zoom meeting above!
    },
  ]);

  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingPlatform, setNewMeetingPlatform] = useState<"Google Meet" | "Zoom">("Google Meet");

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;
    soundEffects.playBeepConfirm();

    const created: MeetingItem = {
      id: `meet-${Date.now()}`,
      title: newMeetingTitle.trim(),
      platform: newMeetingPlatform,
      time: "Tomorrow, 03:00 PM - 03:30 PM",
      durationMinutes: 30,
      attendees: ["Commander Wasi", "Invited Partner"],
      link:
        newMeetingPlatform === "Google Meet"
          ? `https://meet.google.com/qnx-${Math.floor(Math.random() * 899 + 100)}`
          : `https://zoom.us/j/${Math.floor(Math.random() * 899999999 + 100000000)}`,
      conflictDetected: false,
    };

    setMeetings((prev) => [created, ...prev]);
    setNewMeetingTitle("");
    speechService.speak(
      `Meeting scheduled on ${newMeetingPlatform}: ${created.title}. Calendar synced.`,
      { lang: language, gender: voiceGender }
    );
  };

  // ----------------------------------------------------
  // 3. CUSTOMER SUPPORT & HELPDESK STATE
  // ----------------------------------------------------
  const [supportTickets, setSupportTickets] = useState<SupportTicketItem[]>([
    {
      id: "t-1",
      ticketNumber: "TICK-4092",
      customerName: "Apex Motion Media",
      subject: "Question on ProRes 422 HQ export color profile calibration",
      category: "Technical",
      priority: "P2 - High",
      status: "Open",
      autoDraftReply:
        "Hello Apex Team, thank you for contacting Q-Nexus Support. When exporting ProRes 422 HQ in Premiere Pro, ensure the Color Management working space is set to Rec.709 with Gamma 2.4. We've verified your timeline settings and attached the preset .epr file for 1-click import.",
    },
    {
      id: "t-2",
      ticketNumber: "TICK-4093",
      customerName: "Hamza Graphics",
      subject: "Invoice for monthly cloud backup storage verification",
      category: "Billing",
      priority: "P3 - Medium",
      status: "In Review",
      autoDraftReply:
        "Hi Hamza, your invoice #9842 has been verified and reflects 4TB encrypted cloud storage. Receipt has been routed to your registered finance email.",
    },
  ]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem>(supportTickets[0]);
  const [kbSearchQuery, setKbSearchQuery] = useState("");
  const [kbResults, setKbResults] = useState<string[]>([
    "Article #104: How to configure NVIDIA CUDA Mercury Playback Engine in Adobe Suite",
    "Article #208: Setting up automated cron routines and Discord/Slack notification webhooks",
    "Article #312: Restoring local encrypted JSON backups in Q-Nexus OS",
  ]);

  // ----------------------------------------------------
  // 4. CODING, GIT & TASK DECOMPOSITION STATE
  // ----------------------------------------------------
  const [codingGoal, setCodingGoal] = useState(
    "Build a production-ready OAuth2 authorization middleware with JWT token rotation, Redis session caching, and rate limiting in TypeScript."
  );
  const [selectedLanguage, setSelectedLanguage] = useState("TypeScript");
  const [isDecomposing, setIsDecomposing] = useState(false);

  const [decomposedTasks, setDecomposedTasks] = useState<DecomposedTaskItem[]>([
    {
      id: "dt-1",
      title: "1. Architect Redis token blacklist schema and TTL expiry logic",
      category: "backend",
      hours: 2.5,
      dependencies: ["None"],
      priority: "critical",
      completed: true,
    },
    {
      id: "dt-2",
      title: "2. Implement Express JWT verification middleware with bearer parsing",
      category: "backend",
      hours: 3.0,
      dependencies: ["dt-1"],
      priority: "high",
      completed: true,
    },
    {
      id: "dt-3",
      title: "3. Build Refresh Token endpoint with single-use cryptographic rotation",
      category: "backend",
      hours: 4.0,
      dependencies: ["dt-2"],
      priority: "high",
      completed: false,
    },
    {
      id: "dt-4",
      title: "4. Integrate IP-based leaky-bucket rate limiter (100 req/min)",
      category: "devops",
      hours: 2.0,
      dependencies: ["dt-1"],
      priority: "medium",
      completed: false,
    },
    {
      id: "dt-5",
      title: "5. Write end-to-end integration tests using Vitest and mock Supertest",
      category: "testing",
      hours: 3.5,
      dependencies: ["dt-3", "dt-4"],
      priority: "high",
      completed: false,
    },
  ]);

  const [generatedIssues, setGeneratedIssues] = useState<JiraGitHubIssueItem[]>([
    {
      id: "iss-1",
      provider: "Jira",
      issueKey: "QNEXUS-84",
      title: "Fix memory leak in token verification callback handler",
      type: "Bug",
      priority: "Highest",
      assignee: "Commander Wasi",
      status: "In Progress",
    },
    {
      id: "iss-2",
      provider: "GitHub",
      issueKey: "GH-112",
      title: "Support multi-file context tracking in coding assistant",
      type: "Feature",
      priority: "High",
      assignee: "Commander Wasi",
      status: "Backlog",
    },
    {
      id: "iss-3",
      provider: "Jira",
      issueKey: "QNEXUS-85",
      title: "Docker container pruning scheduled automation routine",
      type: "Task",
      priority: "Medium",
      assignee: "Commander Wasi",
      status: "Done",
    },
  ]);

  const handleDecomposeGoal = () => {
    soundEffects.playScan();
    setIsDecomposing(true);

    setTimeout(() => {
      setIsDecomposing(false);
      soundEffects.playBeepConfirm();
      setDecomposedTasks([
        {
          id: `dt-${Date.now()}-1`,
          title: "1. Define typed interfaces & database migration for core entities",
          category: "backend",
          hours: 2.0,
          dependencies: ["None"],
          priority: "critical",
          completed: false,
        },
        {
          id: `dt-${Date.now()}-2`,
          title: "2. Build controller service endpoints with input validation",
          category: "backend",
          hours: 3.5,
          dependencies: ["Task 1"],
          priority: "high",
          completed: false,
        },
        {
          id: `dt-${Date.now()}-3`,
          title: "3. Implement responsive React UI components with Tailwind CSS",
          category: "frontend",
          hours: 4.0,
          dependencies: ["Task 2"],
          priority: "high",
          completed: false,
        },
        {
          id: `dt-${Date.now()}-4`,
          title: "4. Setup Docker multi-stage build & compose configuration",
          category: "devops",
          hours: 2.5,
          dependencies: ["Task 1", "Task 3"],
          priority: "medium",
          completed: false,
        },
      ]);

      const vocal =
        language === "pa"
          ? "Goal analyze ho gaya ae Wasi paji! Project nu 4 sub-tasks vich decompose kar ditta ae."
          : "Smart Task Decomposition complete: 4 prioritized sub-tasks with dependency graph compiled.";
      speechService.speak(vocal, { lang: language, gender: voiceGender });
    }, 1200);
  };

  const toggleTaskCompleted = (id: string) => {
    soundEffects.playClick();
    setDecomposedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const [activeCodeSnippet, setActiveCodeSnippet] = useState(
    `// rateLimiter.ts - Token Bucket Rate Limiter\nimport redis from './redisClient';\n\nexport async function rateLimit(ip: string, limit = 100, windowSeconds = 60): Promise<boolean> {\n  const key = \`rate_limit:\${ip}\`;\n  const current = await redis.incr(key);\n  if (current === 1) {\n    await redis.expire(key, windowSeconds);\n  }\n  return current <= limit;\n}`
  );

  return (
    <div className="w-full h-full flex flex-col font-rajdhani select-none overflow-hidden">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-3 mb-4 overflow-x-auto shrink-0">
        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("messaging");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "messaging"
              ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-cyan-300 border border-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>OMNI-CHANNEL MESSAGING</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("meetings");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "meetings"
              ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-purple-300 border border-slate-800"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>MEETINGS & CALLS (MEET / ZOOM)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("support");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "support"
              ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-emerald-300 border border-slate-800"
          }`}
        >
          <LifeBuoy className="w-4 h-4" />
          <span>CUSTOMER SUPPORT & TICKETS</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundEffects.playClick();
            setActiveTab("coding");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === "coding"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40"
              : "bg-slate-900/80 text-slate-300 hover:text-amber-300 border border-slate-800"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>CODING COPILOT & GIT TRACKER</span>
        </button>
      </div>

      {/* Tab 1: Omni-Channel Messaging */}
      {activeTab === "messaging" && (
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-4 pr-1">
          {/* Inbox List */}
          <div className="space-y-2 lg:col-span-1">
            <div className="text-xs font-orbitron font-bold text-slate-400 mb-2 flex justify-between items-center px-1">
              <span>UNIFIED MESSAGES INBOX</span>
              <span className="text-cyan-400 font-mono text-[10px]">WhatsApp • Slack • Telegram</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedMessage.id === msg.id
                    ? "bg-cyan-950/40 border-cyan-400 text-slate-100 shadow-md shadow-cyan-950"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-900 text-cyan-300 border border-slate-700">
                    {msg.platform}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{msg.receivedTime}</span>
                </div>
                <div className="font-semibold text-xs text-slate-200 truncate">{msg.sender}</div>
                <div className="text-[11px] text-slate-400 font-mono line-clamp-2 mt-1">
                  {msg.snippet}
                </div>
              </div>
            ))}
          </div>

          {/* Active Message Auto-Drafter */}
          <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    Incoming Context [{selectedMessage.platform.toUpperCase()}]
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{selectedMessage.sender}</h4>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  Priority: <strong className="text-amber-400 uppercase">{selectedMessage.priority}</strong>
                </div>
              </div>

              {/* Original Incoming text */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 mb-3">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Client Message:</span>
                "{selectedMessage.snippet}"
              </div>

              {/* AI Auto-Drafted Reply */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Autonomous AI Draft Response</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setReplyLang("ur")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        replyLang === "ur" ? "bg-cyan-950 text-cyan-300 border border-cyan-400" : "text-slate-500"
                      }`}
                    >
                      Urdu
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyLang("pa")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        replyLang === "pa" ? "bg-cyan-950 text-cyan-300 border border-cyan-400" : "text-slate-500"
                      }`}
                    >
                      Punjabi
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyLang("en")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        replyLang === "en" ? "bg-cyan-950 text-cyan-300 border border-cyan-400" : "text-slate-500"
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                <textarea
                  value={editableDraft}
                  onChange={(e) => setEditableDraft(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2 mt-3">
              <button
                type="button"
                onClick={handleCopyDraft}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedDraft ? "Copied" : "Copy Draft"}</span>
              </button>

              <button
                type="button"
                onClick={handleSendReply}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>APPROVE & DISPATCH TO {selectedMessage.platform.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Meetings & Calls Coordination */}
      {activeTab === "meetings" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Quick Meeting Scheduler Card */}
          <form
            onSubmit={handleScheduleMeeting}
            className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">
                1-Click Meeting & Video Call Dispatcher
              </span>
              <input
                type="text"
                value={newMeetingTitle}
                onChange={(e) => setNewMeetingTitle(e.target.value)}
                placeholder="e.g. 4K Client Edit Final Review & Monetization..."
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-700 focus:border-purple-400 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={newMeetingPlatform}
                onChange={(e) => setNewMeetingPlatform(e.target.value as any)}
                className="px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl text-xs font-mono focus:outline-none"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom Video</option>
              </select>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold text-xs tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>SCHEDULE CALL</span>
              </button>
            </div>
          </form>

          {/* Scheduled Calls List */}
          <div className="space-y-3">
            <div className="text-xs font-orbitron font-bold text-slate-400 px-1">
              UPCOMING CONFERENCES & AVAILABILITY CHECK
            </div>

            {meetings.map((meet) => (
              <div
                key={meet.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  meet.conflictDetected
                    ? "bg-red-950/20 border-red-500/50"
                    : "bg-slate-950/80 border-slate-800 hover:border-purple-500/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold uppercase">
                      {meet.platform}
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-semibold">{meet.time}</span>
                    {meet.conflictDetected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>TIME CONFLICT DETECTED!</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{meet.title}</h4>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    Attendees: {meet.attendees.join(", ")}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={meet.link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-950 border border-slate-700 hover:border-purple-400 text-purple-300 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Customer Support & Tickets */}
      {activeTab === "support" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Knowledge Base Search Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-3">
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={kbSearchQuery}
              onChange={(e) => setKbSearchQuery(e.target.value)}
              placeholder="Search knowledge base articles, video specs, and SLA documentation..."
              className="w-full bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Tickets Queue */}
            <div className="space-y-3">
              <div className="text-xs font-orbitron font-bold text-slate-400 px-1">
                ACTIVE CLIENT SUPPORT TICKETS
              </div>

              {supportTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedTicket.id === ticket.id
                      ? "bg-emerald-950/30 border-emerald-400 text-slate-100 shadow-lg"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono">
                    <span className="font-bold text-emerald-400">{ticket.ticketNumber}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {ticket.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-200">{ticket.customerName}</h4>
                  <div className="text-xs font-mono text-slate-400 mt-1">{ticket.subject}</div>
                </div>
              ))}
            </div>

            {/* Ticket Auto-Draft & Knowledge Base Card */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-orbitron font-bold text-emerald-300">
                    TICKET: {selectedTicket.ticketNumber}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedTicket.category}</span>
                </div>

                <div className="text-xs font-mono text-slate-300 mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <strong className="text-slate-400 block mb-0.5">Inquiry:</strong>
                  {selectedTicket.subject}
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1 font-bold">
                  Auto-Drafted Resolution:
                </div>
                <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 mb-3">
                  {selectedTicket.autoDraftReply}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  speechService.speak(
                    `Support resolution for ${selectedTicket.ticketNumber} dispatched to client.`,
                    { lang: language, gender: voiceGender }
                  );
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>DISPATCH SUPPORT RESOLUTION</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Coding Copilot & Smart Task Decomposition */}
      {activeTab === "coding" && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Smart Task Decomposer Input */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-orbitron font-bold text-amber-300 flex items-center gap-1.5">
                <ListTodo className="w-4 h-4 text-amber-400" />
                <span>SMART TASK DECOMPOSITION ENGINE</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Breaks complex feature prompts into sub-tasks with dependency links
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
              <input
                type="text"
                value={codingGoal}
                onChange={(e) => setCodingGoal(e.target.value)}
                placeholder="Enter high-level architecture goal or complex task..."
                className="flex-1 w-full px-3.5 py-2 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleDecomposeGoal}
                disabled={isDecomposing}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider transition shadow-lg shadow-amber-500/30 flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isDecomposing ? "animate-spin" : ""}`} />
                <span>{isDecomposing ? "DECOMPOSING..." : "DECOMPOSE TASK"}</span>
              </button>
            </div>
          </div>

          {/* Sub-tasks Pipeline & Multi-File Context */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sub-Tasks Dependency Tree */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
              <div className="text-xs font-orbitron font-bold text-slate-300 mb-3 flex items-center justify-between">
                <span>PRIORITIZED SUB-TASKS PIPELINE</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {decomposedTasks.filter((t) => t.completed).length} / {decomposedTasks.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {decomposedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskCompleted(t.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      t.completed
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                        : "bg-slate-900/60 border-slate-800 text-slate-200 hover:border-amber-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${
                          t.completed
                            ? "bg-emerald-500 text-slate-950 border-emerald-400"
                            : "bg-slate-950 border-slate-700"
                        }`}
                      >
                        {t.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`text-xs font-mono ${t.completed ? "line-through opacity-70" : ""}`}>
                          {t.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Est: {t.hours} hrs • Depends on: {t.dependencies.join(", ")}
                        </div>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold bg-slate-950 text-amber-400 border border-slate-800 shrink-0 ml-2">
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Jira / GitHub Issues Tracker */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-orbitron font-bold text-slate-300 mb-3 flex items-center justify-between">
                  <span>GIT COMMITS & ISSUE TRACKER</span>
                  <span className="text-[10px] font-mono text-purple-400">Jira & GitHub Sync Active</span>
                </div>

                <div className="space-y-2.5 mb-3">
                  {generatedIssues.map((iss) => (
                    <div
                      key={iss.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              iss.provider === "Jira"
                                ? "bg-blue-950 text-blue-300 border border-blue-500/30"
                                : "bg-purple-950 text-purple-300 border border-purple-500/30"
                            }`}
                          >
                            {iss.provider} • {iss.issueKey}
                          </span>
                          <span className="text-slate-400">{iss.type}</span>
                        </div>
                        <div className="font-semibold text-slate-200">{iss.title}</div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                        {iss.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Code Preview Buffer */}
                <div className="p-2.5 rounded-xl bg-black border border-slate-800 font-mono text-[11px] text-slate-300 select-text overflow-x-auto">
                  <div className="text-[9px] text-slate-500 uppercase mb-1">
                    Multi-File Code Writer: rateLimiter.ts
                  </div>
                  <pre className="text-cyan-300">{activeCodeSnippet}</pre>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playBeepConfirm();
                  speechService.speak(
                    "Pushed active code fixes and created tracking issues in Jira and GitHub.",
                    { lang: language, gender: voiceGender }
                  );
                }}
                className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <GitPullRequest className="w-4 h-4 text-slate-950" />
                <span>COMMIT & CREATE GITHUB / JIRA ISSUES</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
