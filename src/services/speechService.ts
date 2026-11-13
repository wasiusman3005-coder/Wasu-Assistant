import { LanguageCode, VoiceGender } from "../types";
import { WAKE_WORDS_100_PLUS } from "../data/jarvisCatalog";

export interface SpeechListenerCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onSpeakingStateChange?: (speaking: boolean) => void;
  onWakeWordDetected?: (matchedPhrase?: string) => void;
}

class SpeechService {
  private recognition: any = null;
  private wakeRecognition: any = null;
  private isListening = false;
  private isWakeWordActive = false;
  private isSpeaking = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private callbacks: SpeechListenerCallbacks = {};
  private activeWakeWords: string[] = WAKE_WORDS_100_PLUS.map((w) => w.phrase.toLowerCase());
  private elevenLabsConfig: { enabled: boolean; voiceId: string; fastMode: boolean } = {
    enabled: false,
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    fastMode: true,
  };

  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initRecognition();
    this.initWakeWordDetector();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        if (list.length > 0) this.cachedVoices = list;
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public setWakeWords(extraWords: string[] = []) {
    const base = WAKE_WORDS_100_PLUS.map((w) => w.phrase.toLowerCase());
    const extras = extraWords.map((w) => w.trim().toLowerCase()).filter(Boolean);
    this.activeWakeWords = Array.from(new Set([...base, ...extras]));
  }

  public setElevenLabsConfig(cfg: { enabled: boolean; voiceId: string; fastMode: boolean }) {
    this.elevenLabsConfig = { ...cfg };
  }

  public getWakeWordCount() {
    return this.activeWakeWords.length;
  }

  public triggerWakeWordManually(phrase = "Hi Nexus") {
    this.callbacks.onWakeWordDetected?.(phrase);
  }

  private initRecognition() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.callbacks.onStart?.();
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            this.callbacks.onResult?.(finalTranscript, true);
          } else if (interimTranscript) {
            this.callbacks.onResult?.(interimTranscript, false);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn("Speech Recognition Error:", event.error);
          this.callbacks.onError?.(event.error);
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.callbacks.onEnd?.();
        };
      } catch (e) {
        console.warn("SpeechRecognition init failed:", e);
      }
    }
  }

  // Wake-word detector matching all 100+ built-in + custom wake phrases
  private initWakeWordDetector() {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.wakeRecognition = new SpeechRecognition();
        this.wakeRecognition.continuous = true;
        this.wakeRecognition.interimResults = true;
        this.wakeRecognition.lang = "en-US";

        this.wakeRecognition.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            const matched = this.activeWakeWords.find((phrase) => transcript.includes(phrase));
            if (matched) {
              console.log(`⚡ Wake Word Detected (${this.activeWakeWords.length} active):`, matched);
              this.callbacks.onWakeWordDetected?.(matched);
              break;
            }
          }
        };

        this.wakeRecognition.onend = () => {
          if (this.isWakeWordActive && !this.isListening) {
            try {
              this.wakeRecognition.start();
            } catch {
              // Ignore restart error
            }
          }
        };
      } catch (e) {
        console.warn("Wake word detector init failed:", e);
      }
    }
  }

  public enableWakeWord(enabled: boolean) {
    this.isWakeWordActive = enabled;
    if (enabled && this.wakeRecognition) {
      try {
        this.wakeRecognition.start();
      } catch {
        // Already running or permission pending
      }
    } else if (!enabled && this.wakeRecognition) {
      try {
        this.wakeRecognition.stop();
      } catch {
        // Ignored
      }
    }
  }

  public setCallbacks(cbs: SpeechListenerCallbacks) {
    this.callbacks = { ...this.callbacks, ...cbs };
  }

  public startListening(lang: LanguageCode = "ur"): boolean {
    if (!this.recognition) {
      this.callbacks.onError?.("Speech recognition not supported in this browser. You can type commands directly.");
      return false;
    }

    try {
      if (this.wakeRecognition && this.isWakeWordActive) {
        try {
          this.wakeRecognition.stop();
        } catch {}
      }

      if (this.isListening) {
        this.recognition.stop();
      }

      if (lang === "ur") {
        this.recognition.lang = "ur-PK";
      } else if (lang === "pa") {
        this.recognition.lang = "pa-IN";
      } else {
        this.recognition.lang = "en-US";
      }

      this.recognition.start();
      return true;
    } catch (err: any) {
      console.warn("Start listening error:", err);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
    if (this.isWakeWordActive && this.wakeRecognition) {
      try {
        this.wakeRecognition.start();
      } catch {}
    }
  }

  public getListeningState() {
    return this.isListening;
  }

  public getSpeakingState() {
    return this.isSpeaking;
  }

  private sanitizeForSpeech(raw: string): string {
    return raw
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .replace(/[*_`~#>]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * High-Fidelity Pakistani Urdu Female & Multi-Engine Speech Generator:
   * 1) ElevenLabs (if enabled & server-configured)
   * 2) Server Neural TTS (Gemini Korean/Kore OR Free Pakistani Urdu Microsoft Edge ur-PK-UzmaNeural)
   * 3) Zero-latency Browser SpeechSynthesis (strictly female, preferring ur-PK / hi-IN / en-IN female)
   */
  public async speak(
    text: string,
    options: {
      lang?: LanguageCode;
      gender?: VoiceGender;
      rate?: number;
      pitch?: number;
      fast?: boolean;
      useElevenLabs?: boolean;
      elevenLabsVoiceId?: string;
      onEnd?: () => void;
    } = {}
  ) {
    const cleanText = this.sanitizeForSpeech(text);
    if (!cleanText) return;

    const {
      lang = "ur",
      gender = "female",
      fast = this.elevenLabsConfig.fastMode,
      useElevenLabs = this.elevenLabsConfig.enabled,
      elevenLabsVoiceId = this.elevenLabsConfig.voiceId,
    } = options;

    this.cancelSpeech();

    // 1. Real ElevenLabs TTS (ultra-natural neural voice)
    if (useElevenLabs) {
      try {
        const elRes = await fetch("/api/tts/elevenlabs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanText,
            voiceId: elevenLabsVoiceId,
            fast,
          }),
        });
        if (elRes.ok) {
          const elData = await elRes.json();
          if (elData.base64Audio) {
            const audio = new Audio(`data:${elData.format || "audio/mpeg"};base64,${elData.base64Audio}`);
            this.currentAudioElement = audio;
            audio.playbackRate = fast ? 1.04 : 1.0;
            audio.onplay = () => {
              this.isSpeaking = true;
              this.callbacks.onSpeakingStateChange?.(true);
            };
            audio.onended = () => {
              this.isSpeaking = false;
              this.callbacks.onSpeakingStateChange?.(false);
              options.onEnd?.();
            };
            audio.onerror = () => {
              this.fallbackBrowserSpeak(cleanText, options);
            };
            try {
              await audio.play();
              return;
            } catch {
              // Fall through
            }
          }
        }
      } catch {
        // Fall through to Gemini / Edge-TTS / Browser TTS
      }
    }

    // 2. Server-side Neural TTS (Gemini TTS or free Python edge-tts ur-PK-UzmaNeural Pakistani Urdu Female!)
    try {
      const serverGender = gender === "male" ? "male" : "female";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch("/api/jarvis/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          text: cleanText,
          language: lang,
          gender: serverGender,
        }),
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.base64Audio) {
          const audio = new Audio(`data:${data.format || "audio/wav"};base64,${data.base64Audio}`);
          this.currentAudioElement = audio;
          audio.playbackRate = fast ? 1.04 : 1.0;

          audio.onplay = () => {
            this.isSpeaking = true;
            this.callbacks.onSpeakingStateChange?.(true);
          };

          audio.onended = () => {
            this.isSpeaking = false;
            this.callbacks.onSpeakingStateChange?.(false);
            options.onEnd?.();
          };

          audio.onerror = () => {
            this.fallbackBrowserSpeak(cleanText, options);
          };

          try {
            await audio.play();
            return;
          } catch {
            this.fallbackBrowserSpeak(cleanText, options);
            return;
          }
        }
      }
    } catch {
      // Fall through to browser synthesis
    }

    // 3. Zero-Latency Browser Synthesis Fallback
    this.fallbackBrowserSpeak(cleanText, options);
  }

  private fallbackBrowserSpeak(
    text: string,
    options: {
      lang?: LanguageCode;
      gender?: VoiceGender;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
    } = {}
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const { lang = "ur", gender = "female", rate = 0.98, pitch } = options;
    const isMaleRequested = gender === "male";
    const utterance = new SpeechSynthesisUtterance(text);

    const liveVoices = window.speechSynthesis.getVoices();
    const voices = liveVoices.length > 0 ? liveVoices : this.cachedVoices;

    const isMaleVoiceName = (name: string) =>
      /\b(david|mark|george|daniel|alex|asad|ravi|hemant|richard|guy|ryan|andrew|james|steffan|christopher|eric|roger|male)\b/i.test(
        name
      ) && !/\bfemale\b/i.test(name);

    const isFemaleVoiceName = (name: string) =>
      /(uzma|zira|aria|jenny|sonia|hazel|libby|samantha|swara|heera|kalpana|neerja|priya|lekha|female)/i.test(name);

    const pool = isMaleRequested ? voices : voices.filter((v) => !isMaleVoiceName(v.name));
    const searchPool = pool.length > 0 ? pool : voices;

    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (lang === "ur" || lang === "pa") {
      utterance.lang = lang === "pa" ? "pa-IN" : "ur-PK";
      selectedVoice =
        searchPool.find(
          (v) =>
            v.lang.toLowerCase().includes("ur-pk") &&
            (isFemaleVoiceName(v.name) || !isMaleVoiceName(v.name))
        ) ||
        searchPool.find((v) => v.lang.toLowerCase().startsWith("ur") || v.name.toLowerCase().includes("urdu")) ||
        searchPool.find((v) => v.lang.toLowerCase().startsWith("pa") || v.name.toLowerCase().includes("punjabi")) ||
        searchPool.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi-in") &&
            (isFemaleVoiceName(v.name) || !isMaleVoiceName(v.name))
        ) ||
        searchPool.find(
          (v) =>
            v.lang.toLowerCase().startsWith("en-in") &&
            (isFemaleVoiceName(v.name) || !isMaleVoiceName(v.name))
        ) ||
        searchPool.find((v) => isFemaleVoiceName(v.name)) ||
        searchPool[0] ||
        null;
    } else {
      utterance.lang = "en-US";
      selectedVoice =
        searchPool.find((v) =>
          isMaleRequested
            ? isMaleVoiceName(v.name)
            : isFemaleVoiceName(v.name)
        ) ||
        searchPool.find((v) => v.lang.startsWith("en-GB") || v.lang.startsWith("en-US") || v.lang.startsWith("en-IN")) ||
        searchPool[0] ||
        null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = Math.min(1.06, Math.max(0.9, rate));
    if (pitch !== undefined) {
      utterance.pitch = isMaleRequested ? pitch : Math.max(pitch, 1.12);
    } else {
      utterance.pitch = isMaleRequested ? 0.88 : 1.16;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.callbacks.onSpeakingStateChange?.(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.callbacks.onSpeakingStateChange?.(false);
      options.onEnd?.();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.callbacks.onSpeakingStateChange?.(false);
      options.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public cancelSpeech() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.callbacks.onSpeakingStateChange?.(false);
  }
}

export const speechService = new SpeechService();
