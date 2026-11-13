import React, { useState, useEffect } from "react";
import {
  Video,
  Image as ImageIcon,
  Sparkles,
  Monitor,
  Share2,
  Download,
  Play,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  RefreshCw,
  Wand2,
  Volume2,
  Trash2,
  Film,
  Layout,
  Plus,
} from "lucide-react";
import {
  generateAIOrCanvasImage,
  generateAIOrCanvasVideo,
  generateThumbnailPoster,
  captureScreenSnapshotBase64,
} from "../services/mediaStudioGenerator";
import { speechService } from "../services/speechService";
import { soundEffects } from "../services/soundEffects";
import { LanguageCode, VoiceGender } from "../types";

export type MediaStudioTab = "video" | "thumbnail" | "image" | "screen_help" | "social_post";

interface ScheduledPostItem {
  id: string;
  platform: "YouTube Shorts" | "TikTok" | "Instagram Reels" | "X / Twitter";
  title: string;
  caption: string;
  hashtags: string;
  mediaUrl?: string;
  mediaType: "video" | "image";
  scheduledSeconds: number;
  status: "Scheduled" | "Auto-Publishing..." | "Published";
}

interface CreativeMediaStudioProps {
  language: LanguageCode;
  voiceGender: VoiceGender;
  initialTab?: MediaStudioTab;
  onApplyCustom2DAvatar?: (url: string) => void;
  onApplyDashboardWallpaper?: (url: string) => void;
}

export const CreativeMediaStudio: React.FC<CreativeMediaStudioProps> = ({
  language,
  voiceGender,
  initialTab = "video",
  onApplyCustom2DAvatar,
  onApplyDashboardWallpaper,
}) => {
  const [activeTab, setActiveTab] = useState<MediaStudioTab>(initialTab);

  // Video Generator State
  const [videoPrompt, setVideoPrompt] = useState(
    "Futuristic Neon Lahore skyline with flying cybernetic drones in 4K HDR"
  );
  const [videoAspect, setVideoAspect] = useState<"16:9" | "9:16">("16:9");
  const [videoDuration, setVideoDuration] = useState<"5s" | "10s">("5s");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>("");
  const [videoSourceLabel, setVideoSourceLabel] = useState<string>("");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Image Generator State
  const [imagePrompt, setImagePrompt] = useState(
    "Cyberpunk holographic AI goddess with glowing cyan wing circuits"
  );
  const [imageStyle, setImageStyle] = useState("Quantum Cyberpunk");
  const [imageAspect, setImageAspect] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [imageSourceLabel, setImageSourceLabel] = useState<string>("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Thumbnail Generator State
  const [thumbTitle, setThumbTitle] = useState("MY AI JARVIS BUILT EVERYTHING!");
  const [thumbSubtitle, setThumbSubtitle] = useState("100 AVATARS • ELEVENLABS • ZERO LEAKS");
  const [thumbBadge, setThumbBadge] = useState("4K VIRAL EXCLUSIVE");
  const [thumbAccent, setThumbAccent] = useState("#00f5ff");
  const [thumbAspect, setThumbAspect] = useState<"16:9" | "9:16">("16:9");
  const [thumbBackdropUrl, setThumbBackdropUrl] = useState<string>("");
  const [generatedThumbUrl, setGeneratedThumbUrl] = useState<string>("");
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);

  // Screen Help State
  const [screenSnapshotUrl, setScreenSnapshotUrl] = useState<string>("");
  const [screenQuestion, setScreenQuestion] = useState(
    "Analyze what is on my screen and tell me step by step how to optimize or fix it."
  );
  const [screenHelpReply, setScreenHelpReply] = useState<string>("");
  const [screenError, setScreenError] = useState<string>("");
  const [isAnalyzingScreen, setIsAnalyzingScreen] = useState(false);

  // Auto Social Media Video Post State
  const [postPlatform, setPostPlatform] = useState<ScheduledPostItem["platform"]>("YouTube Shorts");
  const [postTitle, setPostTitle] = useState("Quantum Jarvis OS Showcase 2026");
  const [postCaption, setPostCaption] = useState(
    "Built my own next-gen AI Jarvis with 100+ avatars, live voice & instant video studio! #AI #Jarvis #Tech"
  );
  const [postHashtags, setPostHashtags] = useState("#QNexus #AIJarvis #TechCreator #PakistanTech #Shorts");
  const [postDelaySec, setPostDelaySec] = useState(8);
  const [postWebhookUrl, setPostWebhookUrl] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPostItem[]>([
    {
      id: "post-seed-1",
      platform: "YouTube Shorts",
      title: "Holographic Core Reactor Demo",
      caption: "10 real-time 3D quantum geometries reacting to voice commands.",
      hashtags: "#QuantumUI #ThreeJS #Jarvis",
      mediaType: "video",
      scheduledSeconds: 0,
      status: "Published",
    },
  ]);

  // Countdown tick for Auto Social Media Video Post queue
  useEffect(() => {
    const timer = setInterval(() => {
      setScheduledPosts((prev) =>
        prev.map((post) => {
          if (post.status === "Scheduled") {
            if (post.scheduledSeconds <= 1) {
              soundEffects.playBeepConfirm();
              return { ...post, scheduledSeconds: 0, status: "Published" };
            }
            return { ...post, scheduledSeconds: post.scheduledSeconds - 1 };
          }
          return post;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || isGeneratingVideo) return;
    soundEffects.playClick();
    setIsGeneratingVideo(true);
    try {
      const res = await generateAIOrCanvasVideo(videoPrompt, videoAspect, videoDuration);
      setGeneratedVideoUrl(res.videoUrl);
      setVideoSourceLabel(
        res.source === "gemini-omni" ? "Gemini Omni Flash Video" : "Quantum 60fps Motion Stream"
      );
      soundEffects.playQuantumStartup();
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || isGeneratingImage) return;
    soundEffects.playClick();
    setIsGeneratingImage(true);
    try {
      const res = await generateAIOrCanvasImage(imagePrompt, imageAspect, imageStyle);
      setGeneratedImageUrl(res.imageUrl);
      setImageSourceLabel(res.source === "gemini" ? "Gemini Flash Image" : "Quantum Cyber Art");
      soundEffects.playBeepConfirm();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setIsGeneratingThumb(true);
    soundEffects.playClick();
    try {
      let backdrop = thumbBackdropUrl;
      if (!backdrop) {
        const bgRes = await generateAIOrCanvasImage(
          `Dramatic high-contrast studio lighting background for: ${thumbTitle}`,
          thumbAspect,
          "YouTube 4K Studio"
        );
        backdrop = bgRes.imageUrl;
        setThumbBackdropUrl(backdrop);
      }
      const poster = await generateThumbnailPoster({
        title: thumbTitle,
        subtitle: thumbSubtitle,
        badge: thumbBadge,
        accentHex: thumbAccent,
        backdropImageUrl: backdrop,
        aspectRatio: thumbAspect,
      });
      setGeneratedThumbUrl(poster);
      soundEffects.playBeepConfirm();
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleCaptureScreen = async () => {
    setScreenError("");
    soundEffects.playScan();
    try {
      const snap = await captureScreenSnapshotBase64();
      setScreenSnapshotUrl(snap);
      await analyzeScreenImage(snap);
    } catch (err: any) {
      setScreenError(err?.message || "Screen capture permission denied. Upload any screenshot below.");
    }
  };

  const handleUploadScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target?.result as string;
      setScreenSnapshotUrl(url);
      await analyzeScreenImage(url);
    };
    reader.readAsDataURL(file);
  };

  const analyzeScreenImage = async (imgDataUrl: string) => {
    setIsAnalyzingScreen(true);
    setScreenError("");
    try {
      const res = await fetch("/api/jarvis/analyze-screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imgDataUrl,
          question: screenQuestion,
          language,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Screen scan complete.";
      setScreenHelpReply(reply);
      soundEffects.playBeepConfirm();
      speechService.speak(reply, { lang: language, gender: voiceGender, fast: true });
    } catch {
      setScreenError("Could not reach AI Vision endpoint. Please retry.");
    } finally {
      setIsAnalyzingScreen(false);
    }
  };

  const handleAICaptionDraft = async () => {
    soundEffects.playClick();
    try {
      const res = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Write a catchy viral ${postPlatform} caption + 6 trending hashtags for video titled "${postTitle}". Keep it punchy under 35 words.`,
          language,
          fastMode: true,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setPostCaption(data.reply);
        soundEffects.playBeepConfirm();
      }
    } catch {
      // keep existing caption
    }
  };

  const handleQueueAutoPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;
    soundEffects.playQuantumStartup();
    const item: ScheduledPostItem = {
      id: "post-" + Date.now(),
      platform: postPlatform,
      title: postTitle.trim(),
      caption: postCaption.trim(),
      hashtags: postHashtags.trim(),
      mediaUrl: generatedVideoUrl || generatedThumbUrl || generatedImageUrl || undefined,
      mediaType: generatedVideoUrl ? "video" : "image",
      scheduledSeconds: Number(postDelaySec),
      status: "Scheduled",
    };
    setScheduledPosts((prev) => [item, ...prev]);

    if (postWebhookUrl.trim()) {
      fetch(postWebhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-4 font-rajdhani text-slate-100">
      {/* Studio Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
        {[
          { id: "video" as const, label: "Video Generator", icon: Film },
          { id: "thumbnail" as const, label: "Thumbnail Generator", icon: Layout },
          { id: "image" as const, label: "Image Generator", icon: ImageIcon },
          { id: "screen_help" as const, label: "Screen Help AI", icon: Monitor },
          { id: "social_post" as const, label: "Auto Social Video Post", icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 transition cursor-pointer ${
                active
                  ? "bg-cyan-950/90 border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-950/60"
                  : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIDEO GENERATOR */}
      {activeTab === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-orbitron font-bold text-sm text-cyan-300 flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>AI QUANTUM VIDEO GENERATOR</span>
            </h3>
            <textarea
              rows={3}
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the scene, camera motion, lighting..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Aspect Ratio</label>
                <select
                  value={videoAspect}
                  onChange={(e) => setVideoAspect(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                >
                  <option value="16:9">16:9 (YouTube Landscape)</option>
                  <option value="9:16">9:16 (Shorts / Reels / TikTok)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Clip Length</label>
                <select
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                >
                  <option value="5s">5 Seconds (Fast Render)</option>
                  <option value="10s">10 Seconds (Extended)</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGeneratingVideo}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-orbitron font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGeneratingVideo ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>RENDERING VIDEO STREAM...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>GENERATE VIDEO</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] space-y-3">
            {generatedVideoUrl ? (
              <>
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>SOURCE: {videoSourceLabel}</span>
                  <span>READY</span>
                </div>
                <video
                  src={generatedVideoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full max-h-64 rounded-xl border border-cyan-500/40 bg-black"
                />
                <div className="w-full flex items-center gap-2">
                  <a
                    href={generatedVideoUrl}
                    download={`q-nexus-video-${Date.now()}.webm`}
                    className="flex-1 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD VIDEO</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setPostTitle(videoPrompt.slice(0, 48));
                      setActiveTab("social_post");
                    }}
                    className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>SEND TO AUTO POST</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs font-mono">
                <Film className="w-10 h-10 mx-auto mb-2 opacity-40" />
                Click GENERATE VIDEO to synthesize playable 4K stream.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: THUMBNAIL GENERATOR */}
      {activeTab === "thumbnail" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs font-mono">
            <h3 className="font-orbitron font-bold text-sm text-amber-300 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span>HD VIRAL THUMBNAIL GENERATOR</span>
            </h3>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Main Bold Headline</label>
              <input
                type="text"
                value={thumbTitle}
                onChange={(e) => setThumbTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Bottom Strip Subtitle</label>
              <input
                type="text"
                value={thumbSubtitle}
                onChange={(e) => setThumbSubtitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Top Badge</label>
                <input
                  type="text"
                  value={thumbBadge}
                  onChange={(e) => setThumbBadge(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Format</label>
                <select
                  value={thumbAspect}
                  onChange={(e) => setThumbAspect(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
                >
                  <option value="16:9">1280x720 YouTube</option>
                  <option value="9:16">720x1280 Shorts</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Glow Color</label>
                <input
                  type="color"
                  value={thumbAccent}
                  onChange={(e) => setThumbAccent(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateThumbnail}
              disabled={isGeneratingThumb}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGeneratingThumb ? "COMPOSING HD POSTER..." : "GENERATE YOUTUBE THUMBNAIL"}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] space-y-3">
            {generatedThumbUrl ? (
              <>
                <img
                  src={generatedThumbUrl}
                  alt="Generated Thumbnail"
                  className="w-full max-h-64 object-contain rounded-xl border border-amber-400/50"
                />
                <a
                  href={generatedThumbUrl}
                  download={`thumbnail-${Date.now()}.png`}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD 1280x720 PNG</span>
                </a>
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs font-mono">
                <Layout className="w-10 h-10 mx-auto mb-2 opacity-40" />
                Enter headline & click GENERATE YOUTUBE THUMBNAIL.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: IMAGE GENERATOR */}
      {activeTab === "image" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs font-mono">
            <h3 className="font-orbitron font-bold text-sm text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI IMAGE & AVATAR GENERATOR</span>
            </h3>
            <textarea
              rows={3}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={imageStyle}
                onChange={(e) => setImageStyle(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
              >
                <option>Quantum Cyberpunk</option>
                <option>Ultra Photorealistic Portrait</option>
                <option>Anime Neon Studio</option>
                <option>3D Octane Render</option>
                <option>Stark Hologram HUD</option>
              </select>
              <select
                value={imageAspect}
                onChange={(e) => setImageAspect(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
              >
                <option value="1:1">1:1 Square / Avatar</option>
                <option value="16:9">16:9 Wallpaper</option>
                <option value="9:16">9:16 Portrait Story</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-orbitron font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{isGeneratingImage ? "SYNTHESIZING PIXELS..." : "GENERATE IMAGE"}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] space-y-3">
            {generatedImageUrl ? (
              <>
                <div className="text-[10px] font-mono text-purple-300 w-full">
                  ENGINE: {imageSourceLabel}
                </div>
                <img
                  src={generatedImageUrl}
                  alt="Generated Art"
                  className="max-h-60 rounded-xl border border-purple-500/40 object-contain"
                />
                <div className="flex flex-wrap gap-2 w-full">
                  <a
                    href={generatedImageUrl}
                    download={`q-nexus-art-${Date.now()}.png`}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-[11px] font-mono flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PNG
                  </a>
                  {onApplyCustom2DAvatar && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyCustom2DAvatar(generatedImageUrl);
                        soundEffects.playBeepConfirm();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-mono cursor-pointer"
                    >
                      USE AS 2D AVATAR
                    </button>
                  )}
                  {onApplyDashboardWallpaper && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyDashboardWallpaper(generatedImageUrl);
                        soundEffects.playBeepConfirm();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] font-mono cursor-pointer"
                    >
                      SET WALLPAPER
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 text-xs font-mono">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                Describe any image, avatar, or scene & generate in 1 click.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SCREEN HELP AI */}
      {activeTab === "screen_help" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-orbitron font-bold text-sm text-emerald-300 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>LIVE SCREEN HELP & AI VISION TROUBLESHOOTER</span>
            </h3>
            <textarea
              rows={2}
              value={screenQuestion}
              onChange={(e) => setScreenQuestion(e.target.value)}
              placeholder="Ask Jarvis about what is on your screen..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCaptureScreen}
                disabled={isAnalyzingScreen}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4" />
                <span>{isAnalyzingScreen ? "SCANNING SCREEN..." : "CAPTURE LIVE SCREEN"}</span>
              </button>
              <label className="flex-1 py-2.5 px-3 rounded-xl bg-slate-950 border border-dashed border-cyan-500/60 hover:border-cyan-400 text-cyan-300 flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>UPLOAD SCREENSHOT</span>
                <input type="file" accept="image/*" onChange={handleUploadScreenshot} className="hidden" />
              </label>
            </div>
            {screenError && (
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300">
                {screenError}
              </div>
            )}
            {screenSnapshotUrl && (
              <img
                src={screenSnapshotUrl}
                alt="Screen Snapshot"
                className="w-full max-h-48 object-cover rounded-xl border border-slate-700"
              />
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-emerald-400 font-bold mb-2">
                <span>AI SCREEN DIAGNOSIS</span>
                {screenHelpReply && (
                  <button
                    type="button"
                    onClick={() =>
                      speechService.speak(screenHelpReply, { lang: language, gender: voiceGender, fast: true })
                    }
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" /> SPEAK
                  </button>
                )}
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[160px]">
                {screenHelpReply ||
                  "Click 'CAPTURE LIVE SCREEN' or upload any code/error/UI screenshot and Jarvis will read your screen and help immediately."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUTO SOCIAL MEDIA VIDEO POST */}
      {activeTab === "social_post" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
          <form onSubmit={handleQueueAutoPost} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="font-orbitron font-bold text-sm text-rose-300 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>AUTO SOCIAL MEDIA VIDEO POSTER</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={postPlatform}
                onChange={(e) => setPostPlatform(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              >
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="X / Twitter">X / Twitter Video</option>
              </select>
              <select
                value={postDelaySec}
                onChange={(e) => setPostDelaySec(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              >
                <option value={5}>Auto-Post in 5 sec</option>
                <option value={15}>Auto-Post in 15 sec</option>
                <option value={60}>Auto-Post in 1 min</option>
              </select>
            </div>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Video Post Title"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
            />
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                placeholder="Viral caption..."
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100"
              />
              <button
                type="button"
                onClick={handleAICaptionDraft}
                className="px-3 rounded-xl bg-purple-950 border border-purple-400/60 text-purple-200 hover:bg-purple-900 cursor-pointer flex flex-col items-center justify-center"
                title="AI Auto-Write Viral Caption"
              >
                <Wand2 className="w-4 h-4 mb-1" />
                <span className="text-[9px]">AI WRITE</span>
              </button>
            </div>
            <input
              type="text"
              value={postHashtags}
              onChange={(e) => setPostHashtags(e.target.value)}
              placeholder="#AI #Jarvis #Viral"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300"
            />
            <input
              type="url"
              value={postWebhookUrl}
              onChange={(e) => setPostWebhookUrl(e.target.value)}
              placeholder="Optional Zapier / Make / Buffer Webhook URL"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white font-orbitron font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>QUEUE AUTO VIDEO POST</span>
            </button>
          </form>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 max-h-[380px] overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>SCHEDULED & PUBLISHED QUEUE</span>
              <span className="text-emerald-400">{scheduledPosts.length} ITEMS</span>
            </div>
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold text-[10px]">
                    {post.platform}
                  </span>
                  <div className="flex items-center gap-2">
                    {post.status === "Published" ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PUBLISHED
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold flex items-center gap-1 animate-pulse">
                        <Clock className="w-3.5 h-3.5" /> IN {post.scheduledSeconds}s
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setScheduledPosts((prev) => prev.filter((p) => p.id !== post.id))
                      }
                      className="text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="font-bold text-white">{post.title}</div>
                <div className="text-slate-300 text-[11px]">{post.caption}</div>
                <div className="text-cyan-400 text-[10px]">{post.hashtags}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
