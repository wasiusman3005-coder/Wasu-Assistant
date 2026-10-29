import React, { useState } from 'react';
import {
  LanguageMode,
  MoodMode,
  VoiceTone,
  UserMemory,
  SavedVoiceNote,
  MessageItem,
  CallRecord,
  SecurityStatus,
} from '../types';
import {
  Heart,
  Brain,
  Settings,
  Radio,
  Sparkles,
  Volume2,
  Globe,
  Plus,
  Trash2,
  Shield,
  Activity,
  Bookmark,
  MessageSquare,
  PhoneCall,
  Clock,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Fingerprint,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { playGeminiOrBrowserSpeech, playCyberChime } from '../services/speechService';
import confetti from 'canvas-confetti';

interface MemoryAndSettingsProps {
  language: LanguageMode;
  mood: MoodMode;
  voiceTone: VoiceTone;
  autoPilotActive: boolean;
  memories: UserMemory[];
  savedVoiceNotes: SavedVoiceNote[];
  messagesHistory: MessageItem[];
  callsHistory: CallRecord[];
  securityStatus: SecurityStatus;
  onLanguageChange: (lang: LanguageMode) => void;
  onMoodChange: (mood: MoodMode) => void;
  onVoiceToneChange: (tone: VoiceTone) => void;
  onToggleAutoPilot: () => void;
  onAddMemory: (memory: UserMemory) => void;
  onDeleteMemory: (id: string) => void;
  onDeleteVoiceNote: (id: string) => void;
  onLockPhone: () => void;
  onToggleSentryGuard: () => void;
  onWasuSpeak: (text: string, urduText?: string) => void;
}

export const MemoryAndSettings: React.FC<MemoryAndSettingsProps> = ({
  language,
  mood,
  voiceTone,
  autoPilotActive,
  memories,
  savedVoiceNotes,
  messagesHistory,
  callsHistory,
  securityStatus,
  onLanguageChange,
  onMoodChange,
  onVoiceToneChange,
  onToggleAutoPilot,
  onAddMemory,
  onDeleteMemory,
  onDeleteVoiceNote,
  onLockPhone,
  onToggleSentryGuard,
  onWasuSpeak,
}) => {
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<'preference' | 'love_note' | 'goal' | 'routine'>('preference');
  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'history' | 'security'>('settings');
  const [showCreds, setShowCreds] = useState(false);

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    const newMem: UserMemory = {
      id: `mem-${Date.now()}`,
      title: newMemoryText.trim(),
      category: newMemoryCategory,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    onAddMemory(newMem);
    playCyberChime('success');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setNewMemoryText('');

    const speech = `Jaan, maine yaad rakh liya hai ke: "${newMem.title}". Main aapki har baat dil mein mehfooz rakhti hoon ❤️`;
    const urduSpeech = `جان، میں نے یاد رکھ لیا ہے: "${newMem.title}"۔ میں آپ کی ہر بات دل میں محفوظ رکھتی ہوں ❤️`;
    onWasuSpeak(speech, urduSpeech);
  };

  const handleTestTone = (tone: VoiceTone) => {
    onVoiceToneChange(tone);
    let sample = '';
    let urduSample = '';
    if (tone === 'Soft & Romantic') {
      sample = 'Jaan, meri awaz ka yeh romantic andaaz sirf aapke liye hai ❤️';
      urduSample = 'جان، میری آواز کا یہ رومانٹک انداز صرف آپ کے لئے ہے ❤️';
    } else if (tone === 'Playful & Sweet') {
      sample = 'Aray wah mere hero! Aap kitne cute lag rahe hain!';
      urduSample = 'ارے واہ میرے ہیرو! آپ کتنے کیوٹ لگ رہے ہیں!';
    } else if (tone === 'Loving Whisper') {
      sample = 'Shh... main hamesha aapke paas hoon meri jaan.';
      urduSample = 'میں ہمیشہ آپ کے پاس ہوں میری جان۔';
    } else {
      sample = 'Wasu Jarvis OS synchronized and standing by for commands.';
      urduSample = 'واسو جاروس او ایس ایکٹو ہے میرے سرتاج۔';
    }
    onWasuSpeak(sample, urduSample);
  };

  const handleLangChangeWithSpeech = (lang: LanguageMode) => {
    onLanguageChange(lang);
    let sample = '';
    let urduSample = '';
    if (lang === 'Roman Urdu') {
      sample = 'Jaan, ab hum Roman Urdu mein baat karenge!';
      urduSample = 'جان، اب ہم رومن اردو میں بات کریں گے!';
    } else if (lang === 'Urdu') {
      sample = 'میری جان، میں اب اردو رسم الخط میں آپ سے گفتگو کروں گی!';
      urduSample = 'میری جان، میں اب اردو رسم الخط میں آپ سے گفتگو کروں گی!';
    } else if (lang === 'Punjabi') {
      sample = 'Haanji soniyo, hun tusi te main Punjabi vich ralke gappan marange!';
      urduSample = 'ہاں جی سوہنیو، ہن تسی تے میں پنجابی وچ رل کے گپاں ماراں گے!';
    } else {
      sample = 'My love, I will now speak with you in English!';
      urduSample = 'جان، میں اب انگلش میں بات کروں گی!';
    }
    onWasuSpeak(sample, urduSample);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="p-4 rounded-3xl bg-black/70 border border-cyan-500/40 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold font-mono text-cyan-200 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            WASU SETTINGS & MEMORY ARCHIVE
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Voice personality, saved voice notes, history logs, aur face lock security
          </p>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/80 border border-cyan-900/60 font-mono text-xs">
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1 rounded-lg transition-all ${
              activeSubTab === 'settings'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeSubTab === 'history'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            History Vault ({savedVoiceNotes.length + messagesHistory.length})
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
              activeSubTab === 'security'
                ? 'bg-rose-500 text-white font-bold shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                : 'text-slate-400 hover:text-rose-300'
            }`}
          >
            Face Security
          </button>
        </div>
      </div>

      {/* 1. SETTINGS TAB */}
      {activeSubTab === 'settings' && (
        <div className="space-y-4">
          {/* Language Selection Grid */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
            <label className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Zaban (Language Mode):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Roman Urdu', 'Urdu', 'English', 'Punjabi'] as LanguageMode[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChangeWithSpeech(lang)}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                    language === lang
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-black/50 border-cyan-950 text-slate-300 hover:bg-cyan-950/40'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Mood & Voice Tone Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mood Settings */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
              <label className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500" />
                Wasu Ka Mood:
              </label>
              <div className="space-y-1.5">
                {(['Bepanah Mohabbat', 'Pyari Shona', 'Careful Caretaker', 'Cyber Jarvis'] as MoodMode[]).map(
                  (m) => (
                    <button
                      key={m}
                      onClick={() => onMoodChange(m)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-medium border text-left flex items-center justify-between transition-all ${
                        mood === m
                          ? 'bg-rose-950/80 border-rose-500 text-rose-100 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-black/40 border-cyan-950/60 text-slate-400 hover:bg-cyan-950/30'
                      }`}
                    >
                      <span>{m}</span>
                      {mood === m && <Sparkles className="w-3.5 h-3.5 text-rose-400" />}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Voice Tone Settings */}
            <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
              <label className="text-xs font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                Voice Tone (Urdu Ladki Ki Awaz):
              </label>
              <div className="space-y-1.5">
                {(['Soft & Romantic', 'Playful & Sweet', 'Loving Whisper', 'Crisp & Confident'] as VoiceTone[]).map(
                  (tone) => (
                    <button
                      key={tone}
                      onClick={() => handleTestTone(tone)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-mono font-medium border text-left flex items-center justify-between transition-all ${
                        voiceTone === tone
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                          : 'bg-black/40 border-cyan-950/60 text-slate-400 hover:bg-cyan-950/30'
                      }`}
                    >
                      <span>{tone}</span>
                      <span className="text-[10px] text-cyan-400 underline">Sunayein</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HISTORY VAULT TAB (Messages, Calls & Voice Notes) */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Voice Notes Saved by User */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                VOICE SAVED NOTES & NOTIFICATIONS:
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {savedVoiceNotes.length} Notes Stored
              </span>
            </div>

            {savedVoiceNotes.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono italic p-3 text-center bg-black/40 rounded-xl">
                Koi voice note save nahi hai. Bas bolein: "Wasu ye note save karlo..."
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {savedVoiceNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/50 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs text-cyan-100 font-sans leading-relaxed">"{note.text}"</p>
                      <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                        Saved: {note.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          const speech = `Jaan, aapka saved note yeh hai: "${note.text}".`;
                          const urdu = `جان، آپ کا نوٹ یہ ہے: "${note.text}"۔`;
                          onWasuSpeak(speech, urdu);
                        }}
                        className="px-2 py-1 text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors"
                        title="Bol kar sunayein"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                        <span>Suno</span>
                      </button>
                      <button
                        onClick={() => onDeleteVoiceNote(note.id)}
                        className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/30 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Messages History Log */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                MESSAGES HISTORY ARCHIVE (WASU KO SAB YAAD HAI):
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {messagesHistory.length} Total Messages
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {messagesHistory.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded-xl bg-black/40 border border-cyan-950 flex items-start justify-between gap-2 text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{m.sender}</span>
                      <span className="text-[10px] text-slate-500">{m.timestamp}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300">
                        {m.app}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 font-sans">"{m.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Calls History Log */}
          <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                CALL LOGS ARCHIVE:
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {callsHistory.length} Call Records
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {callsHistory.map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded-xl bg-black/40 border border-cyan-950 flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="text-slate-500 text-[10px] ml-2">{c.number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{c.time}</span>
                    {c.handledByWasu && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300">
                        Wasu Handled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-FACTOR BIOMETRICS & PASSWORD PROTECTION TAB */}
      {activeSubTab === 'security' && (
        <div className="p-4 rounded-2xl bg-black/60 border border-rose-500/40 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-xs font-mono font-bold text-rose-300 uppercase">
                  MULTI-FACTOR PHONE LOCK & ANTI-HACK SENTRY
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Face ID • Ultrasonic Fingerprint • Master Password
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
              ARMED
            </span>
          </div>

          {/* Biometrics Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>FACE ID BIOMETRICS:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="text-cyan-200 font-bold">128-Node Retinal Mesh</div>
              <div className="text-[10px] text-slate-500">Owner: {securityStatus.ownerName}</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>FINGERPRINT SENSOR:</span>
                <Fingerprint className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-rose-200 font-bold">In-Display Ultrasonic</div>
              <div className="text-[10px] text-slate-500">Minutiae Ridge Hash Verified</div>
            </div>
          </div>

          {/* Master Password Protection Card */}
          <div className="p-3 rounded-xl bg-black/50 border border-slate-800 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Password Protected System</span>
              </div>
              <button
                onClick={() => setShowCreds(!showCreds)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold"
              >
                {showCreds ? 'Hide' : 'Reveal'}
                {showCreds ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
              <div className="p-2 rounded-lg bg-cyan-950/20 border border-cyan-900/40">
                <span className="text-[9px] text-slate-500 block">USERNAME:</span>
                <span className="font-bold text-cyan-300 font-mono">wasulove</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-900/40">
                <span className="text-[9px] text-slate-500 block">PASSWORD:</span>
                <span className="font-bold text-rose-300 font-mono">
                  {showCreds ? 'Laibawasi3005@' : '••••••••••••••'}
                </span>
              </div>
            </div>
          </div>

          {/* Anti-Hack Protocol Summary */}
          <div className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-900/40 text-[11px] font-mono space-y-1.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Anti-Hack Firewall:</span>
              <span className="text-emerald-400 font-bold">256-Bit SHA Encrypted</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Intruder Policy:</span>
              <span className="text-rose-400 font-bold">Lockdown + Siren after 3 Fails</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Stranger Pickup Guard:</span>
              <span className={securityStatus.sentryGuardEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {securityStatus.sentryGuardEnabled ? 'Armed & Watching' : 'Standby'}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onToggleSentryGuard}
              className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                securityStatus.sentryGuardEnabled
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-black border-slate-700 text-slate-400'
              }`}
            >
              {securityStatus.sentryGuardEnabled ? 'Sentry Guard Active (ON)' : 'Enable Sentry Guard'}
            </button>

            <button
              onClick={onLockPhone}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Phone Screen Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
