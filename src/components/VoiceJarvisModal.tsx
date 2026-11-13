import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  X,
  Terminal,
  Image as ImageIcon,
  Video,
  Monitor,
  Youtube,
  Upload,
  Zap,
  User,
} from "lucide-react";
import { soundEffects } from "../services/soundEffects";
import { speechService } from "../services/speechService";
import {
  generateAIOrCanvasImage,
  generateAIOrCanvasVideo,
  captureScreenSnapshotBase64,
} from "../services/mediaStudioGenerator";
import { PERSONALITY_MODES } from "../data/jarvisCatalog";
import { detectBodyMovementFromText, BODY_MOVEMENT_COMMANDS } from "../utils/bodyMovementParser";
import {
  LanguageCode,
  VoiceGender,
  UserProfile,
  JarvisChatMessage,
  AvatarStudioConfig,
} from "../types";

interface VoiceJarvisModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  voiceGender: VoiceGender;
  userProfile: UserProfile;
  avatarConfig?: AvatarStudioConfig;
  onUpdateAvatarConfig?: (next: AvatarStudioConfig) => void;
  onExecuteAction: (action: string, payload?: any) => void;
}

const YOUTUBE_REGEX = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[^\s]+|youtu\.be\/[^\s]+|youtube\.com\/shorts\/[^\s]+))/i;

export const VoiceJarvisModal: React.FC<VoiceJarvisModalProps> = ({
  isOpen,
  onClose,
  language,
  voiceGender,
  userProfile,
  avatarConfig,
  onUpdateAvatarConfig,
  onExecuteAction,
}) => {
  const activePersonality =
    PERSONALITY_MODES.find((p) => p.id === avatarConfig?.personalityId) ||
    PERSONALITY_MODES[0];

  const [messages, setMessages] = useState<JarvisChatMessage[]>([
    {
      id: "initial",
      sender: "jarvis",
      text:
        language === "pa"
          ? activePersonality.greetingPa
          : language === "en"
          ? activePersonality.greetingEn
          : activePersonality.greetingUr,
      language,
      timestamp: "Just now",
      quantumTelemetry: "Coherence: 99.98%",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformLevels, setWaveformLevels] = useState<number[]>([30, 60, 45, 80, 20, 65, 90, 40]);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speakWithPersonality = (text: string, langOverride?: LanguageCode) => {
    const fast = avatarConfig?.fastTalkingMode ?? true;
    speechService.speak(text, {
      lang: langOverride || language,
      gender: activePersonality.voiceGender || voiceGender,
      pitch: activePersonality.pitch,
      rate: fast ? Math.max(activePersonality.rate, 1.12) : activePersonality.rate,
      fast,
      useElevenLabs: avatarConfig?.useElevenLabs,
      elevenLabsVoiceId: avatarConfig?.elevenLabsVoiceId,
    });
  };

  // Suggested voice commands
  const suggestedCommands = [
    "Haath hilao Zoya",
    "Dance karo jaan",
    "Flying kiss do",
    "Open Humanoid",
    "/image Neon Cyberpunk Jarvis",
    "Analyze https://youtube.com/watch?v=dQw4w9WgXcQ",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    speechService.setCallbacks({
      onStart: () => setIsListening(true),
      onResult: (transcript, isFinal) => {
        setInputVal(transcript);
        if (isFinal) {
          handleSendMessage(transcript);
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
  }, [language, avatarConfig?.personalityId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening || isProcessing) {
      interval = setInterval(() => {
        setWaveformLevels(Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 15));
      }, 100);
    } else {
      setWaveformLevels([15, 25, 20, 30, 20, 25, 15, 20]);
    }
    return () => clearInterval(interval);
  }, [isListening, isProcessing]);

  const toggleMic = () => {
    soundEffects.playClick();
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(language);
      if (!started) {
        setMicNotice("Microphone recognition unavailable in this browser. Type your command below.");
        setTimeout(() => setMicNotice(null), 4000);
      }
    }
  };

  // Screen Help / Analysis directly inside Chat
  const handleScreenHelpInChat = async () => {
    if (isProcessing) return;
    soundEffects.playScan();
    try {
      const snapshot = await captureScreenSnapshotBase64();
      await runScreenAnalysisInChat(snapshot, inputVal.trim() || "What is on my screen? Help me optimize or fix any issue.");
    } catch (err: any) {
      setMicNotice(err?.message || "Use Upload Screenshot button next to Screen icon.");
      setTimeout(() => setMicNotice(null), 4000);
    }
  };

  const handleUploadScreenInChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await runScreenAnalysisInChat(dataUrl, inputVal.trim() || "Analyze this screenshot carefully and assist.");
    };
    reader.readAsDataURL(file);
  };

  const runScreenAnalysisInChat = async (snapshot: string, question: string) => {
    setInputVal("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "user",
        text: `🖥️ [Screen Analysis Request]: ${question}`,
        screenSnapshotUrl: snapshot,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/jarvis/analyze-screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: snapshot, question, language }),
      });
      const data = await res.json();
      const replyText = data.reply || "Screen analysis completed.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "jarvis",
          text: replyText,
          actionExecuted: "SCREEN_ANALYSIS",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      soundEffects.playBeepConfirm();
      speakWithPersonality(replyText);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickMediaCommand = async (mode: "image" | "video") => {
    const promptText =
      inputVal.trim() ||
      (mode === "image"
        ? "Holographic futuristic Q-Nexus cyber angel"
        : "Cybernetic neon spaceship flying through quantum nebula");
    await handleSendMessage(`/${mode} ${promptText}`);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isProcessing) return;

    soundEffects.playClick();
    setInputVal("");
    if (isListening) speechService.stopListening();

    const userMsg: JarvisChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const lower = text.toLowerCase();

      // 0. Direct Full-Body Movement Command for Cyber Girlfriend
      const detectedMove = detectBodyMovementFromText(text);
      if (detectedMove) {
        const meta = BODY_MOVEMENT_COMMANDS.find((m) => m.id === detectedMove);
        const reply = (language === "en" ? meta?.replyEn : meta?.replyUr) || "Ji Jaan, kar diya!";
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "jarvis",
            text: reply,
            actionExecuted: `AVATAR_MOVE (${detectedMove.toUpperCase()})`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        speakWithPersonality(reply);
        onExecuteAction("AVATAR_MOVE", { movement: detectedMove });
        return;
      }

      // 1. Direct "Open Humanoid" / Avatar command
      if (
        lower.includes("open humanoid") ||
        lower.includes("humanoid khol") ||
        lower.includes("show humanoid") ||
        lower.includes("show avatar") ||
        lower.includes("open avatar") ||
        lower.includes("real girl avatar")
      ) {
        const reply = `${activePersonality.emoji} Ji Wasi Jaan! Aapki Full-Body Cyber Girlfriend Zoya Stage khol rahi hoon.`;
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "jarvis",
            text: reply,
            actionExecuted: "OPEN_HUMANOID",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        speakWithPersonality(reply);
        onExecuteAction("OPEN_HUMANOID");
        return;
      }

      // 2. Image Generation in Chat (/image or natural trigger)
      if (
        lower.startsWith("/image") ||
        lower.startsWith("generate image") ||
        lower.startsWith("create image") ||
        lower.includes("tasveer banao")
      ) {
        const cleanPrompt = text.replace(/^(\/image|generate image|create image|tasveer banao)/i, "").trim() || text;
        const imgRes = await generateAIOrCanvasImage(cleanPrompt, "1:1", "Quantum Cyberpunk");
        const reply = `✨ Image generated via ${imgRes.source.toUpperCase()} for: "${cleanPrompt}"`;
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "jarvis",
            text: reply,
            imageUrl: imgRes.imageUrl,
            actionExecuted: "IN_CHAT_IMAGE_GEN",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        soundEffects.playBeepConfirm();
        speakWithPersonality(reply);
        return;
      }

      // 3. Video Generation in Chat (/video or natural trigger)
      if (
        lower.startsWith("/video") ||
        lower.startsWith("generate video") ||
        lower.startsWith("create video") ||
        lower.includes("video banao")
      ) {
        const cleanPrompt = text.replace(/^(\/video|generate video|create video|video banao)/i, "").trim() || text;
        const vidRes = await generateAIOrCanvasVideo(cleanPrompt, "16:9", "5s");
        const reply = `🎬 Video synthesized via ${vidRes.source.toUpperCase()} for: "${cleanPrompt}"`;
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "jarvis",
            text: reply,
            videoUrl: vidRes.videoUrl,
            actionExecuted: "IN_CHAT_VIDEO_GEN",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        soundEffects.playQuantumStartup();
        speakWithPersonality(reply);
        return;
      }

      // 4. YouTube Link Analysis in Chat
      const ytMatch = text.match(YOUTUBE_REGEX);
      if (ytMatch) {
        const ytUrl = ytMatch[1];
        const res = await fetch("/api/jarvis/analyze-youtube", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            youtubeUrl: ytUrl,
            question: text.replace(ytUrl, "").trim() || "Summarize key points & takeaways from this YouTube video.",
            language,
          }),
        });
        const data = await res.json();
        const replyText = data.reply || "YouTube analysis complete.";
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "jarvis",
            text: replyText,
            youtubeMeta: data.meta,
            actionExecuted: "YOUTUBE_ANALYSIS",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        soundEffects.playBeepConfirm();
        speakWithPersonality(replyText);
        return;
      }

      // 5. Standard Fast-Talk Trilingual Personality Chat
      const response = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language,
          userProfile,
          personalityName: activePersonality.name,
          personalityPrompt: activePersonality.systemPromptModifier,
          fastMode: avatarConfig?.fastTalkingMode ?? true,
          currentContext: {
            time: new Date().toISOString(),
            platform: "Desktop OS",
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Quantum Telemetry processed your command, Commander Wasi.";

      const jarvisMsg: JarvisChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "jarvis",
        text: replyText,
        language: data.languageDetected || language,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionExecuted: data.action !== "NONE" ? data.action : undefined,
        quantumTelemetry: data.quantumStatus || "Coherence 99.98%",
      };

      setMessages((prev) => [...prev, jarvisMsg]);
      soundEffects.playBeepConfirm();
      speakWithPersonality(replyText, data.languageDetected || language);

      if (data.action && data.action !== "NONE") {
        onExecuteAction(data.action, data.actionPayload);
      }
    } catch (e) {
      console.error(e);
      const fallbackReply =
        language === "pa"
          ? "Wasi paji, command receive ho gayi ae. Quantum core offline macro active kar reha ae."
          : "Wasi Sahab, aapka hukam receive ho gaya hai. Main local quantum engine se action execute kar raha hoon.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "jarvis",
          text: fallbackReply,
          language,
          timestamp: "Just now",
        },
      ]);
      speakWithPersonality(fallbackReply);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl h-[88vh] bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden font-rajdhani">
        {/* Glow Header */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-sm md:text-base text-cyan-300 glow-text-cyan">
                QUANTUM FAST-TALK & MEDIA CHAT
              </h3>
              <p className="text-[10px] font-mono text-slate-400">
                {activePersonality.emoji} {activePersonality.name} • {language.toUpperCase()} •{" "}
                {avatarConfig?.useElevenLabs ? "ElevenLabs" : "Gemini/Neural"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono">
            {/* Personality Quick Switcher */}
            {avatarConfig && onUpdateAvatarConfig && (
              <select
                value={avatarConfig.personalityId}
                onChange={(e) =>
                  onUpdateAvatarConfig({ ...avatarConfig, personalityId: e.target.value })
                }
                className="px-2 py-1 rounded-lg bg-slate-950 border border-purple-500/40 text-purple-200 max-w-[140px]"
              >
                {PERSONALITY_MODES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.emoji} {p.name}
                  </option>
                ))}
              </select>
            )}

            {/* Fast Talk Toggle */}
            {avatarConfig && onUpdateAvatarConfig && (
              <button
                type="button"
                onClick={() =>
                  onUpdateAvatarConfig({
                    ...avatarConfig,
                    fastTalkingMode: !avatarConfig.fastTalkingMode,
                  })
                }
                className={`px-2 py-1 rounded-lg border flex items-center gap-1 cursor-pointer ${
                  avatarConfig.fastTalkingMode
                    ? "bg-emerald-950 border-emerald-400 text-emerald-300 font-bold"
                    : "bg-slate-900 border-slate-700 text-slate-400"
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>FAST</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onExecuteAction("OPEN_HUMANOID")}
              className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-400/60 text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <User className="w-3 h-3" />
              <span>HUMANOID</span>
            </button>

            <button
              onClick={() => {
                speechService.cancelSpeech();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Waveform Visualizer Bar */}
        <div className="px-5 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 h-5">
              {waveformLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isListening ? "bg-amber-400" : isProcessing ? "bg-purple-500" : "bg-cyan-500"
                  }`}
                  style={{ height: `${Math.max(5, (lvl / 100) * 20)}px` }}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono text-slate-300">
              {isListening
                ? "🎙️ LISTENING..."
                : isProcessing
                ? "⚡ PROCESSING / GENERATING..."
                : "READY — TYPE /image, /video, OR PASTE YOUTUBE LINK"}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            99.98% COHERENCE
          </span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[78%] rounded-2xl p-3.5 shadow-lg space-y-2 ${
                  msg.sender === "user"
                    ? "bg-cyan-600/20 border border-cyan-400/50 text-slate-100 rounded-br-none"
                    : "bg-slate-900/90 border border-purple-500/30 text-slate-200 rounded-bl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] font-mono opacity-60">
                  <span>{msg.sender === "user" ? "COMMANDER WASI" : activePersonality.name.toUpperCase()}</span>
                  <span>{msg.timestamp}</span>
                </div>

                {msg.screenSnapshotUrl && (
                  <img
                    src={msg.screenSnapshotUrl}
                    alt="Screen Capture"
                    className="w-full max-h-44 object-cover rounded-xl border border-cyan-500/40"
                  />
                )}

                {msg.youtubeMeta && (
                  <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-3">
                    {msg.youtubeMeta.thumbnailUrl && (
                      <img
                        src={msg.youtubeMeta.thumbnailUrl}
                        alt={msg.youtubeMeta.title}
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                    )}
                    <div className="text-xs font-mono">
                      <div className="text-rose-300 font-bold flex items-center gap-1">
                        <Youtube className="w-3.5 h-3.5" />
                        <span>{msg.youtubeMeta.title}</span>
                      </div>
                      {msg.youtubeMeta.author && (
                        <div className="text-[10px] text-slate-400">{msg.youtubeMeta.author}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="Generated AI Image"
                    className="w-full max-h-64 object-contain rounded-xl border border-purple-400/50"
                  />
                )}

                {msg.videoUrl && (
                  <video
                    src={msg.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-64 rounded-xl border border-cyan-400/50 bg-black"
                  />
                )}

                {msg.actionExecuted && (
                  <div className="pt-2 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>EXECUTED: [{msg.actionExecuted}]</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-1.5 bg-slate-900/40 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 shrink-0">QUICK:</span>
          {suggestedCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(cmd)}
              className="shrink-0 px-2.5 py-0.5 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 text-slate-300 transition cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Input & Multimedia Chat Action Bar */}
        <div className="p-3 bg-slate-900 border-t border-cyan-500/20 space-y-2">
          {micNotice && (
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
              {micNotice}
            </div>
          )}

          {/* Multimodal Quick Tools */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => handleQuickMediaCommand("image")}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/50 text-purple-200 flex items-center gap-1 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image Gen</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickMediaCommand("video")}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 flex items-center gap-1 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Gen</span>
            </button>
            <button
              type="button"
              onClick={handleScreenHelpInChat}
              disabled={isProcessing}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 flex items-center gap-1 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Capture Screen Help</span>
            </button>
            <label className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Screen</span>
              <input type="file" accept="image/*" onChange={handleUploadScreenInChat} className="hidden" />
            </label>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                isListening
                  ? "bg-amber-500 text-slate-950 animate-pulse"
                  : "bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/30"
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything, paste YouTube URL, /image <prompt>, /video <prompt>, or 'Open Humanoid'..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs md:text-sm"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isProcessing}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
