// Speech synthesis with authentic Pakistani Urdu accent and instant low-latency response
import { convertToUrduPhonetics } from './urduPhonetics';

let currentAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];
const audioCache = new Map<string, string>(); // In-memory cache for ultra-fast instant audio playback

// Pre-load voices on startup
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export const playGeminiOrBrowserSpeech = async (
  text: string,
  options?: {
    useGeminiTts?: boolean;
    voiceTone?: string;
    language?: string;
    urduScriptText?: string;
    onStart?: () => void;
    onEnd?: () => void;
  }
): Promise<void> => {
  stopAllSpeech();

  // Clean text of emojis and special characters for clear speech
  const cleanText = text
    .replace(/[❤️💕💖✨🌹💍🥰😘😍🥺🌸💌📖☕⚠️🎙️|]/g, '')
    .replace(/[*#_~`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    options?.onEnd?.();
    return;
  }

  // 1. Check in-memory audio cache for instantaneous 0ms playback
  const cacheKey = (options?.urduScriptText || cleanText).slice(0, 150);
  if (audioCache.has(cacheKey)) {
    try {
      options?.onStart?.();
      const base64Audio = audioCache.get(cacheKey)!;
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audio.playbackRate = 1.08; // Delicate, sweet feminine cadence (bareek awaz)
      currentAudio = audio;
      audio.onended = () => {
        currentAudio = null;
        options?.onEnd?.();
      };
      audio.onerror = () => {
        currentAudio = null;
        speakWithBrowserUrdu(cleanText, options);
      };
      await audio.play();
      return;
    } catch {
      // Audio autoplay blocked or failed
    }
  }

  // 2. Play 100% native authentic Pakistani Urdu voice with zero English accent
  if (options?.useGeminiTts !== false) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      options?.onStart?.();
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          urduScript: options?.urduScriptText,
          language: options?.language,
          voiceTone: options?.voiceTone,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          // Cache the audio for instant future playback
          audioCache.set(cacheKey, data.audio);

          const mime = data.mimeType || 'audio/mpeg';
          const audio = new Audio(`data:${mime};base64,${data.audio}`);
          audio.playbackRate = 1.08; // Delicate, sweet feminine cadence (bareek awaz)
          currentAudio = audio;
          audio.onended = () => {
            currentAudio = null;
            options?.onEnd?.();
          };
          audio.onerror = () => {
            currentAudio = null;
            speakWithBrowserUrdu(cleanText, options);
          };
          await audio.play();
          return;
        }
      }
    } catch {
      clearTimeout(timeoutId);
    }
  }

  // 3. Fallback: Browser Web Speech API with phonetic South Asian adaptation
  speakWithBrowserUrdu(cleanText, options);
};

export const speakWithBrowserUrdu = (
  text: string,
  options?: {
    voiceTone?: string;
    language?: string;
    urduScriptText?: string;
    onStart?: () => void;
    onEnd?: () => void;
  }
) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Phonetic adaptation for authentic pronunciation
    const speechContent = convertToUrduPhonetics(text);
    const utterance = new SpeechSynthesisUtterance(speechContent);

    const isPunjabi = options?.language === 'Punjabi';
    utterance.lang = isPunjabi ? 'pa-PK' : 'ur-PK';

    // Melodious, sweet Pakistani girl pitch & tempo (Bareek, sweet & clear)
    if (options?.voiceTone === 'Soft & Romantic' || !options?.voiceTone) {
      utterance.pitch = 1.38;
      utterance.rate = 0.93;
    } else if (options?.voiceTone === 'Playful & Sweet') {
      utterance.pitch = 1.48;
      utterance.rate = 0.96;
    } else if (options?.voiceTone === 'Loving Whisper') {
      utterance.pitch = 1.28;
      utterance.rate = 0.90;
    } else {
      utterance.pitch = 1.32;
      utterance.rate = 0.94;
    }

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();

    // STRICT NATIVE VOICE MATCHING
    let selectedVoice = voices.find(
      (v) =>
        v.lang === 'ur-PK' ||
        v.lang === 'ur_PK' ||
        v.lang.startsWith('ur') ||
        v.name.toLowerCase().includes('urdu') ||
        v.name.toLowerCase().includes('asma') ||
        v.name.toLowerCase().includes('uzma')
    );

    if (!selectedVoice && isPunjabi) {
      selectedVoice = voices.find(
        (v) => v.lang.startsWith('pa') || v.name.toLowerCase().includes('punjabi')
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(
        (v) =>
          v.lang.startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('kavya') ||
          v.name.toLowerCase().includes('kalpana')
      );
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      if (selectedVoice.lang.startsWith('hi')) {
        utterance.lang = 'hi-IN';
      }
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    options?.onEnd?.();
  }
};

export const stopAllSpeech = () => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Ignore
  }
};

// Web Audio API Synthesizer for Heartbeat & Romantic Chimes
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      try {
        audioCtx = new AudioContextClass();
      } catch {
        // Not supported
      }
    }
  }
  return audioCtx;
};

export const playHeartbeatBeep = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Ignore
  }
};

export const playCyberChime = (type: 'success' | 'alert' | 'wake_alarm' = 'success') => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'wake_alarm') {
      const notes = [440, 554, 659, 880];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.12, now + idx * 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.4);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + idx * 0.2);
        o.stop(now + idx * 0.2 + 0.45);
      });
      return;
    }

    osc.type = 'sine';
    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    } else {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Ignore
  }
};
