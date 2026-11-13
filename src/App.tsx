import React, { useState, useEffect } from "react";
import { Mic, Sparkles, User, Film } from "lucide-react";
import { soundEffects } from "./services/soundEffects";
import { speechService } from "./services/speechService";
import { storageService, defaultAvatarConfig } from "./services/storage";
import { QuantumBackground3D } from "./components/QuantumBackground3D";
import { SecurityGate } from "./components/SecurityGate";
import { QuantumLoadingScreen } from "./components/QuantumLoadingScreen";
import { UltraCockpitDashboard } from "./components/UltraCockpitDashboard";
import { VectorHudGuiTheme } from "./components/themes/VectorHudGuiTheme";
import { IronManShieldTheme } from "./components/themes/IronManShieldTheme";
import { CarbonIndustrialTheme } from "./components/themes/CarbonIndustrialTheme";
import { StarkMark3Theme } from "./components/themes/StarkMark3Theme";
import { CosmicNebulaTheme } from "./components/themes/CosmicNebulaTheme";
import { Mark85CommandDeckTheme } from "./components/themes/Mark85CommandDeckTheme";
import { ALL_JARVIS_THEMES } from "./components/themes/themesData";
import { QuantumAppsMatrix, MatrixModuleId } from "./components/QuantumAppsMatrix";
import { QuantumSettingsModal } from "./components/QuantumSettingsModal";
import { VoiceJarvisModal } from "./components/VoiceJarvisModal";
import { HumanoidCommandStage } from "./components/HumanoidCommandStage";
import { FloatingAvatarWidget } from "./components/FloatingAvatarWidget";
import { AwayAutoPilot } from "./components/AwayAutoPilot";
import { MandatoryHealthLockdown } from "./components/MandatoryHealthLockdown";
import { DesktopInstallModal } from "./components/DesktopInstallModal";
import { OUTFIT_CATALOG } from "./data/avatarCatalog";
import { PERSONALITY_MODES } from "./data/jarvisCatalog";
import {
  LanguageCode,
  VoiceGender,
  UserProfile,
  DashboardCustomization,
  JarvisInterfaceThemeId,
  AvatarStudioConfig,
  AvatarBodyMovement,
  HologramDisplayMode,
} from "./types";
import {
  detectBodyMovementFromText,
  detectHologramModeFromText,
  BODY_MOVEMENT_COMMANDS,
} from "./utils/bodyMovementParser";
import { QUANTUM_THEMES, QuantumThemeColor } from "./components/AutoMorphingQuantumLogo";

export default function App() {
  // Authentication & Security State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("q_nexus_session_auth") === "active";
    }
    return false;
  });
  const [isAwayMode, setIsAwayMode] = useState(false);

  // Mandatory Health Screen-Time Rest Lockdown
  const [screenWorkSeconds, setScreenWorkSeconds] = useState(0);
  const [isHealthLockdownActive, setIsHealthLockdownActive] = useState(false);

  // App Settings & Customization (scanlines disabled for crystal clear UHD view)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [customization, setCustomization] = useState<DashboardCustomization>(() => {
    const c = storageService.getCustomization();
    return { ...c, scanlines: false };
  });
  const [currentQuantumTheme, setCurrentQuantumTheme] = useState<QuantumThemeColor>(QUANTUM_THEMES[0]);
  const [language, setLanguage] = useState<LanguageCode>(userProfile.preferredLanguage || "ur");
  const [coherence, setCoherence] = useState(99.98);

  // Modal & Stage States
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isAppsMatrixOpen, setIsAppsMatrixOpen] = useState(false);
  const [appsMatrixInitialModule, setAppsMatrixInitialModule] = useState<MatrixModuleId | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isHumanoidOpen, setIsHumanoidOpen] = useState(false);
  const [bodyMovement, setBodyMovement] = useState<AvatarBodyMovement>("idle");
  const [hologramMode, setHologramMode] = useState<HologramDisplayMode>("face");
  const [cinematicTrigger, setCinematicTrigger] = useState(0);
  const [outfitChangingBurst, setOutfitChangingBurst] = useState(false);

  const handleChangeHologramMode = (mode: HologramDisplayMode, triggerCinematic = false) => {
    setHologramMode(mode);
    if (triggerCinematic) {
      setCinematicTrigger((c) => c + 1);
    }
  };

  // Live Speech State
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);
  const [isJarvisListening, setIsJarvisListening] = useState(false);
  const [isWakeWordActive, setIsWakeWordActive] = useState(true);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const avatarConfig: AvatarStudioConfig = customization.avatarConfig || defaultAvatarConfig;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const triggerOutfitChangeBurst = () => {
    setOutfitChangingBurst(true);
    setTimeout(() => setOutfitChangingBurst(false), 950);
  };

  const handleUpdateAvatarConfig = (nextAvatar: AvatarStudioConfig) => {
    const updated: DashboardCustomization = {
      ...customization,
      avatarConfig: nextAvatar,
    };
    setCustomization(updated);
    storageService.saveCustomization(updated);
  };

  const handleShuffleOutfit = () => {
    triggerOutfitChangeBurst();
    const nextIdx = (avatarConfig.outfitIndex + 1 + Math.floor(Math.random() * 5)) % OUTFIT_CATALOG.length;
    handleUpdateAvatarConfig({ ...avatarConfig, outfitIndex: nextIdx });
    showToast(`Outfit Changed: ${OUTFIT_CATALOG[nextIdx].name}`);
  };

  // Sync wake words + ElevenLabs config with SpeechService
  useEffect(() => {
    speechService.setWakeWords(avatarConfig.customWakeWords);
    speechService.setElevenLabsConfig({
      enabled: avatarConfig.useElevenLabs,
      voiceId: avatarConfig.elevenLabsVoiceId,
      fastMode: avatarConfig.fastTalkingMode,
    });
  }, [avatarConfig]);

  // Auto Outfit Change timed animation loop
  useEffect(() => {
    if (!isAuthenticated || !avatarConfig.autoOutfitChange) return;
    const sec = Math.max(4, avatarConfig.autoOutfitIntervalSec || 12);
    const timer = setInterval(() => {
      setOutfitChangingBurst(true);
      setTimeout(() => setOutfitChangingBurst(false), 900);
      setCustomization((prev) => {
        const cur = prev.avatarConfig || defaultAvatarConfig;
        const nextIdx = (cur.outfitIndex + 1) % OUTFIT_CATALOG.length;
        const updated = { ...prev, avatarConfig: { ...cur, outfitIndex: nextIdx } };
        storageService.saveCustomization(updated);
        return updated;
      });
    }, sec * 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated, avatarConfig.autoOutfitChange, avatarConfig.autoOutfitIntervalSec]);

  // Setup 116+ Wake Word & Command Callbacks (Only active after authentication)
  useEffect(() => {
    if (!isAuthenticated) {
      speechService.enableWakeWord(false);
      return;
    }

    speechService.setCallbacks({
      onSpeakingStateChange: (speaking) => {
        setIsJarvisSpeaking(speaking);
      },
      onWakeWordDetected: (matchedPhrase) => {
        soundEffects.playBeepConfirm();
        const phrase = (matchedPhrase || "Hi Nexus").toLowerCase();
        const personality =
          PERSONALITY_MODES.find((p) => p.id === avatarConfig.personalityId) || PERSONALITY_MODES[0];

        // Direct hologram mode or body movement trigger via Wake Word!
        const wakeHoloMode = detectHologramModeFromText(phrase);
        const wakeMove = detectBodyMovementFromText(phrase);
        if (wakeHoloMode === "face" && (!wakeMove || wakeMove === "idle")) {
          handleChangeHologramMode("face");
          setBodyMovement("idle");
          setIsHumanoidOpen(true);
          speechService.speak("Ji Jaan! Ab sirf mera 3D Face Hologram aapke samnay hai.", {
            lang: language,
            gender: "female",
            pitch: 1.12,
            rate: 0.98,
          });
          showToast("✨ Hologram switched to Face-Only Mode!");
          return;
        }
        if (wakeMove) {
          handleChangeHologramMode("fullbody", true);
          setBodyMovement(wakeMove);
          setIsHumanoidOpen(true);
          const meta = BODY_MOVEMENT_COMMANDS.find((m) => m.id === wakeMove);
          const reply = language === "en" ? meta?.replyEn : meta?.replyUr;
          if (reply) {
            speechService.speak(reply, {
              lang: language,
              gender: "female",
              pitch: 1.12,
              rate: 0.98,
              useElevenLabs: avatarConfig.useElevenLabs,
              elevenLabsVoiceId: avatarConfig.elevenLabsVoiceId,
            });
          }
          showToast(`✨ Zoya 3D Hologram: ${meta?.label || wakeMove}`);
          return;
        }
        if (wakeHoloMode === "fullbody") {
          handleChangeHologramMode("fullbody", true);
          setBodyMovement("showcase");
          setIsHumanoidOpen(true);
          speechService.speak("Dekho Jaan! Ab main poora 3D Hologram Humanoid model cinematic view mein represent kar rahi hoon!", {
            lang: language,
            gender: "female",
            pitch: 1.12,
            rate: 0.98,
          });
          showToast("🎬 Cinematic Full-Body 3D Humanoid Reveal!");
          return;
        }

        // Direct command triggers via Wake Word!
        if (
          phrase.includes("humanoid") ||
          phrase.includes("avatar") ||
          phrase.includes("real girl")
        ) {
          setIsHumanoidOpen(true);
          speechService.speak("Assalamualaikum Wasi Jaan! Dekhein aapki Zoya ka 3D Face Hologram hazir hai.", {
            lang: language,
            gender: "female",
            pitch: 1.12,
            rate: 0.98,
          });
          showToast(`✨ Wake Command '${matchedPhrase}' -> 3D Hologram Opened!`);
          return;
        }

        if (phrase.includes("video studio") || phrase.includes("thumbnail") || phrase.includes("auto post") || phrase.includes("screen help")) {
          setAppsMatrixInitialModule("studio");
          setIsAppsMatrixOpen(true);
          showToast(`🎬 Wake Command '${matchedPhrase}' -> Creative Studio Opened!`);
          return;
        }

        setIsVoiceModalOpen(true);
        const wakeReply =
          language === "pa"
            ? personality.greetingPa
            : language === "en"
            ? personality.greetingEn
            : personality.greetingUr;

        speechService.speak(wakeReply, {
          lang: language,
          gender: personality.voiceGender || customization.activeVoiceMode,
          pitch: personality.pitch,
          rate: avatarConfig.fastTalkingMode ? Math.max(personality.rate, 1.12) : personality.rate,
          fast: avatarConfig.fastTalkingMode,
          useElevenLabs: avatarConfig.useElevenLabs,
          elevenLabsVoiceId: avatarConfig.elevenLabsVoiceId,
        });
        showToast(`⚡ Wake Word '${matchedPhrase || "Hi Nexus"}' Triggered!`);
      },
    });

    speechService.enableWakeWord(isWakeWordActive);

    return () => {
      speechService.enableWakeWord(false);
    };
  }, [isAuthenticated, language, customization.activeVoiceMode, isWakeWordActive, avatarConfig]);

  // Continuous Work Timer (Triggers Mandatory Health Rest)
  useEffect(() => {
    if (!isAuthenticated || isAwayMode || isHealthLockdownActive) return;

    const interval = setInterval(() => {
      setScreenWorkSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, isAwayMode, isHealthLockdownActive]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !isAwayMode &&
      !isHealthLockdownActive &&
      screenWorkSeconds >= customization.continuousWorkLimitMinutes * 60
    ) {
      setIsHealthLockdownActive(true);
      setScreenWorkSeconds(0);
    }
  }, [
    isAuthenticated,
    isAwayMode,
    isHealthLockdownActive,
    screenWorkSeconds,
    customization.continuousWorkLimitMinutes,
  ]);

  // Inactivity Screensaver Timer
  useEffect(() => {
    if (!isAuthenticated || isAwayMode || isHealthLockdownActive || customization.screensaverTimeoutMinutes === 0) return;

    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsAwayMode(true);
      }, customization.screensaverTimeoutMinutes * 60 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAuthenticated, isAwayMode, isHealthLockdownActive, customization.screensaverTimeoutMinutes]);

  // Fluctuate Quantum Coherence slightly for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setCoherence((prev) => Math.min(99.99, Math.max(99.85, parseFloat((prev + (Math.random() * 0.04 - 0.02)).toFixed(2)))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateCustomization = (updated: DashboardCustomization) => {
    setCustomization(updated);
    storageService.saveCustomization(updated);
    showToast("Quantum Settings Applied");
  };

  const handleSelectInterfaceTheme = (themeId: JarvisInterfaceThemeId) => {
    const themeMeta = ALL_JARVIS_THEMES.find((t) => t.id === themeId);
    const updated: DashboardCustomization = {
      ...customization,
      activeInterfaceTheme: themeId,
      customAccentHex: themeMeta?.accentHex || customization.customAccentHex,
    };
    setCustomization(updated);
    storageService.saveCustomization(updated);
    showToast(`Interface Theme: ${themeMeta?.name || themeId}`);
  };

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    const updated = { ...userProfile, preferredLanguage: newLang };
    setUserProfile(updated);
    storageService.saveUserProfile(updated);

    const confirmation =
      newLang === "pa"
        ? "Punjabi Lahori accent select ho gaya ae Wasi paji."
        : newLang === "en"
        ? "English neural voice interface activated, Commander Wasi."
        : "Urdu saaf Pakistani accent select ho gaya hai Wasi Sahab.";

    speechService.speak(confirmation, { lang: newLang, gender: customization.activeVoiceMode });
    showToast(`Language set to: ${newLang.toUpperCase()}`);
  };

  const toggleWakeWord = () => {
    const next = !isWakeWordActive;
    setIsWakeWordActive(next);
    speechService.enableWakeWord(next);
    soundEffects.playClick();
    showToast(next ? "Wake Word 'Hi Nexus' Active" : "Wake Word Disabled");
  };

  // Cloud Backup Export
  const handleExportBackup = () => {
    soundEffects.playBeepConfirm();
    const json = storageService.exportFullBackup();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quantum_Jarvis_Backup_Wasi_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Quantum Encrypted Backup Downloaded!");
  };

  // Cloud Backup Import
  const handleImportBackup = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const success = storageService.importFullBackup(text);
        if (success) {
          soundEffects.playQuantumStartup();
          setUserProfile(storageService.getUserProfile());
          setCustomization(storageService.getCustomization());
          showToast("Backup successfully restored!");
          window.location.reload();
        } else {
          soundEffects.playAlert();
          showToast("Failed to parse backup JSON.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Execute Action from Voice/Chat Command
  const handleExecuteVoiceAction = (action: string, payload?: any) => {
    soundEffects.playBeepConfirm();

    if (action === "AVATAR_MOVE" && payload?.movement) {
      const nextMove = payload.movement as AvatarBodyMovement;
      if (payload?.hologramMode === "face") {
        handleChangeHologramMode("face");
      } else if (payload?.hologramMode === "fullbody" || nextMove !== "idle") {
        handleChangeHologramMode("fullbody", nextMove === "showcase");
      }
      setBodyMovement(nextMove);
      setIsHumanoidOpen(true);
      showToast(`✨ Zoya 3D Hologram: ${String(nextMove).toUpperCase()}`);
    } else if (action === "OPEN_HUMANOID") {
      if (payload?.hologramMode === "fullbody" || payload?.cinematic) {
        handleChangeHologramMode("fullbody", true);
        setBodyMovement((payload?.movement as AvatarBodyMovement) || "showcase");
        showToast("🎬 Cinematic 3D Humanoid Model Reveal!");
      } else if (payload?.hologramMode === "face") {
        handleChangeHologramMode("face");
        setBodyMovement("idle");
        showToast("✨ Zoya 3D Face Hologram Active!");
      } else {
        setIsHumanoidOpen(true);
        showToast("✨ Zoya 3D Hologram Stage Opened!");
      }
      setIsHumanoidOpen(true);
    } else if (action === "OPEN_MEDIA_STUDIO" || action === "SCREEN_HELP") {
      setAppsMatrixInitialModule("studio");
      setIsAppsMatrixOpen(true);
      showToast("🎬 Creative Media & Auto-Post Studio Opened!");
    } else if (action === "CHANGE_OUTFIT") {
      handleShuffleOutfit();
    } else if (action === "OPEN_APP") {
      setAppsMatrixInitialModule("desktop");
      setIsAppsMatrixOpen(true);
      showToast(`Launched: ${payload?.appName || "Application"}`);
    } else if (action === "OPEN_AUTOMATION" || action === "SCAN_SCREEN") {
      setAppsMatrixInitialModule("automation");
      setIsAppsMatrixOpen(true);
      showToast("Workflow Automation Engine Activated");
    } else if (action === "OPEN_COMMUNICATION" || action === "SCHEDULE_MEET" || action === "DECOMPOSE_TASK") {
      setAppsMatrixInitialModule("communication");
      setIsAppsMatrixOpen(true);
      showToast("Omni-Channel & Coding Copilot Activated");
    } else if (action === "OPEN_MAPS" || action === "GPS_TRACK") {
      setAppsMatrixInitialModule("maps");
      setIsAppsMatrixOpen(true);
      showToast("Quantum Geospatial Maps & Radar Activated");
    } else if (action === "OPEN_DEVICES" || action === "FIND_PHONE") {
      setAppsMatrixInitialModule("devices");
      setIsAppsMatrixOpen(true);
      showToast(action === "FIND_PHONE" ? "🚨 Find My Phone Siren Triggered!" : "Digital Device Bridge Activated");
    } else if (action === "PRIVACY_CLOAK") {
      window.dispatchEvent(new CustomEvent("toggle-privacy-cloak"));
      showToast("🔒 High-Privacy Cloak Toggled!");
    } else if (action === "AIR_GAP") {
      window.dispatchEvent(new CustomEvent("toggle-air-gap"));
      showToast("🛡️ Air-Gap Isolation Toggled!");
    } else if (action === "START_FOCUS") {
      setAppsMatrixInitialModule("focus");
      setIsAppsMatrixOpen(true);
      showToast("Quantum Deep Focus Activated");
    } else if (action === "HEALTH_ALERT") {
      setAppsMatrixInitialModule("health");
      setIsAppsMatrixOpen(true);
      showToast(payload?.message || "Health Alert Active");
    } else if (action === "LOG_EXPENSE") {
      setAppsMatrixInitialModule("finance");
      setIsAppsMatrixOpen(true);
      showToast("Opened Financial Management");
    } else if (action === "LOCK_SYSTEM") {
      localStorage.removeItem("q_nexus_wasi_auth");
      sessionStorage.removeItem("q_nexus_session_auth");
      setIsAuthenticated(false);
    } else if (action === "AWAY_MODE") {
      setIsAwayMode(true);
    }
  };

  // 1. Strictly Lock Screen Interface First - Nothing else renders before unlocking
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#02050f] text-slate-100 font-rajdhani selection:bg-cyan-500 selection:text-black overflow-hidden flex items-center justify-center">
        {/* Animated Moving 3D Hologram Background on Lock Screen */}
        <QuantumBackground3D
          show3D={customization.show3DBackground}
          customBgUrl={customization.customBgUrl}
          customAccentHex="#06b6d4"
        />

        {/* Dedicated Pure Lock Screen Interface */}
        <SecurityGate
          onAuthenticated={() => {
            sessionStorage.setItem("q_nexus_session_auth", "active");
            setIsAuthenticated(true);
            setShowLoadingScreen(true);
          }}
          preferredLanguage={language}
        />
      </div>
    );
  }

  // 2. Main Interface & Cockpit Hub - ONLY rendered AFTER unlocking
  return (
    <div className="relative min-h-screen bg-[#02050f] text-slate-100 flex flex-col w-full font-rajdhani selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Visual Scanline Effect (Separate overlay so all click events work) */}
      {customization.scanlines && <div className="scanlines-overlay" />}

      {/* 3D Quantum Animated Moving Hologram Background (for Cockpit or Custom Wallpaper) */}
      {(customization.activeInterfaceTheme === "quantum_cockpit" ||
        !customization.activeInterfaceTheme ||
        Boolean(customization.customBgUrl)) && (
        <QuantumBackground3D
          show3D={customization.show3DBackground}
          customBgUrl={customization.customBgUrl}
          customAccentHex={currentQuantumTheme.hex}
        />
      )}

      {/* Mandatory Ergonomic Health Rest Lockdown (Blocks PC until rest timer ends) */}
      <MandatoryHealthLockdown
        isOpen={isHealthLockdownActive}
        onRestCompleted={() => {
          setIsHealthLockdownActive(false);
          setScreenWorkSeconds(0);
        }}
        language={language}
        voiceGender={customization.activeVoiceMode}
        durationMinutes={customization.mandatoryRestMinutes}
      />

      {/* Away Auto-Pilot Screensaver */}
      {isAwayMode && (
        <AwayAutoPilot
          onReturn={() => setIsAwayMode(false)}
          language={language}
          voiceGender={customization.activeVoiceMode}
        />
      )}

      {/* Unified Quantum Applications Matrix (All Folders & Tools in One Dedicated Interface) */}
      <QuantumAppsMatrix
        isOpen={isAppsMatrixOpen}
        onClose={() => setIsAppsMatrixOpen(false)}
        language={language}
        voiceGender={customization.activeVoiceMode}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onOpenDesktopInstall={() => setIsInstallModalOpen(true)}
        initialModule={appsMatrixInitialModule}
      />

      {/* Quantum Settings & Deep Customization Modal */}
      <QuantumSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customization={customization}
        onUpdateCustomization={handleUpdateCustomization}
        language={language}
        onLanguageChange={handleLanguageChange}
        isWakeWordActive={isWakeWordActive}
        onToggleWakeWord={toggleWakeWord}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* PC Desktop Installation Guide Modal */}
      <DesktopInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
      />

      {/* New Quantum Boot & Field Calibration Loading Screen */}
      <QuantumLoadingScreen
        isOpen={showLoadingScreen}
        onComplete={() => setShowLoadingScreen(false)}
        commanderName={userProfile.displayName || userProfile.username}
      />

      {/* Voice Command Center Modal (with In-Chat Image/Video Gen, YouTube & Screen Analysis) */}
      <VoiceJarvisModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        language={language}
        voiceGender={customization.activeVoiceMode}
        userProfile={userProfile}
        avatarConfig={avatarConfig}
        onUpdateAvatarConfig={handleUpdateAvatarConfig}
        onExecuteAction={handleExecuteVoiceAction}
      />

      {/* 3D Hologram Girlfriend Stage Modal */}
      <HumanoidCommandStage
        isOpen={isHumanoidOpen}
        onClose={() => setIsHumanoidOpen(false)}
        avatarConfig={avatarConfig}
        onUpdateAvatarConfig={handleUpdateAvatarConfig}
        language={language}
        isSpeaking={isJarvisSpeaking}
        isListening={isJarvisListening}
        bodyMovement={bodyMovement}
        onTriggerBodyMovement={(move) => setBodyMovement(move)}
        hologramMode={hologramMode}
        cinematicTrigger={cinematicTrigger}
        onChangeHologramMode={handleChangeHologramMode}
      />

      {/* Draggable Persistent Floating Hologram Girlfriend Widget */}
      <FloatingAvatarWidget
        avatarConfig={avatarConfig}
        isSpeaking={isJarvisSpeaking}
        isListening={isJarvisListening}
        bodyMovement={bodyMovement}
        hologramMode={hologramMode}
        cinematicTrigger={cinematicTrigger}
        onTriggerBodyMovement={(move) => {
          handleChangeHologramMode("fullbody", hologramMode === "face");
          setBodyMovement(move);
        }}
        onOpenHumanoidStage={() => setIsHumanoidOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onHideFloating={() => handleUpdateAvatarConfig({ ...avatarConfig, floatingAvatarEnabled: false })}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-300 text-xs font-mono shadow-xl shadow-cyan-950 animate-fadeIn flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active Selected Jarvis Interface Theme (7 Iconic Themes Switchable Anytime) */}
      {(() => {
        const activeThemeId = customization.activeInterfaceTheme || "quantum_cockpit";
        const sharedThemeProps = {
          userProfile,
          customization,
          coherence,
          screenWorkMinutes: Math.floor(screenWorkSeconds / 60),
          onOpenVoiceModal: () => setIsVoiceModalOpen(true),
          onOpenAppsMatrix: () => {
            setAppsMatrixInitialModule(null);
            setIsAppsMatrixOpen(true);
          },
          onOpenModule: (moduleId: string) => {
            setAppsMatrixInitialModule(moduleId as MatrixModuleId);
            setIsAppsMatrixOpen(true);
          },
          onOpenSettings: () => setIsSettingsOpen(true),
          onTriggerHealthLockdown: () => setIsHealthLockdownActive(true),
          onLockScreen: () => {
            sessionStorage.removeItem("q_nexus_session_auth");
            localStorage.removeItem("q_nexus_wasi_auth");
            setIsAuthenticated(false);
          },
          onToggleAwayMode: () => setIsAwayMode(true),
          onSelectTheme: handleSelectInterfaceTheme,
          language,
          voiceGender: customization.activeVoiceMode,
        };

        if (activeThemeId === "vector_hud_gui") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <VectorHudGuiTheme {...sharedThemeProps} />
            </main>
          );
        }
        if (activeThemeId === "ironman_shield") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <IronManShieldTheme {...sharedThemeProps} />
            </main>
          );
        }
        if (activeThemeId === "carbon_industrial") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <CarbonIndustrialTheme {...sharedThemeProps} />
            </main>
          );
        }
        if (activeThemeId === "stark_mark3") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <StarkMark3Theme {...sharedThemeProps} />
            </main>
          );
        }
        if (activeThemeId === "cosmic_nebula") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <CosmicNebulaTheme {...sharedThemeProps} />
            </main>
          );
        }
        if (activeThemeId === "mark_85_deck") {
          return (
            <main className="relative z-10 flex-1 min-h-screen w-full overflow-y-auto">
              <Mark85CommandDeckTheme {...sharedThemeProps} />
            </main>
          );
        }

        return (
          <main className="relative z-10 flex-1 min-h-screen flex flex-col justify-start p-2 sm:p-4 md:p-6 overflow-y-auto">
            <UltraCockpitDashboard
              {...sharedThemeProps}
              currentTheme={currentQuantumTheme}
              isSpeaking={isJarvisSpeaking}
              isListening={isJarvisListening}
              isAwayMode={isAwayMode}
              onOpenHumanoidStage={() => setIsHumanoidOpen(true)}
              onTriggerWakeWord={() => speechService.triggerWakeWordManually("Hi Nexus")}
            />
          </main>
        );
      })()}

      {/* Floating Bottom-Right Quick Action Dock (Humanoid, Media Studio & Voice Mic) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
        <button
          onClick={() => {
            soundEffects.playBeepConfirm();
            setAppsMatrixInitialModule("studio");
            setIsAppsMatrixOpen(true);
          }}
          className="p-3 rounded-full bg-rose-950/90 hover:bg-rose-800 border border-rose-400/70 text-rose-200 shadow-xl transition hover:scale-105 cursor-pointer"
          title="Open Video, Thumbnail, Image, Screen Help & Auto Social Post Studio"
        >
          <Film className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            soundEffects.playBeepConfirm();
            setIsHumanoidOpen(true);
          }}
          className="p-3 rounded-full bg-purple-950/90 hover:bg-purple-800 border border-purple-400/70 text-purple-200 shadow-xl transition hover:scale-105 cursor-pointer"
          title="Open Humanoid & 100+ Avatars Command Stage"
        >
          <User className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            soundEffects.playBeepConfirm();
            setIsVoiceModalOpen(true);
          }}
          className="relative group p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-2xl shadow-cyan-500/50 hover:scale-105 transition cursor-pointer"
          title="Summon Quantum Voice Jarvis (or say any of 116+ Wake Words)"
        >
          <span className="absolute -inset-1 rounded-full bg-cyan-400/40 animate-ping pointer-events-none"></span>
          <Mic className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
