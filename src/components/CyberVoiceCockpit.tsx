import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, Heart, Zap, Terminal, Activity, Radio, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage } from '../types';

interface CyberVoiceCockpitProps {
  chatMessages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  interimTranscript: string;
  onVoiceCommand: (text: string) => void;
  onReplayAudio: (msg: ChatMessage) => void;
  onToggleContinuousListening: () => void;
  continuousListeningEnabled: boolean;
}

export const CyberVoiceCockpit: React.FC<CyberVoiceCockpitProps> = ({
  chatMessages,
  isListening,
  isSpeaking,
  interimTranscript,
  onVoiceCommand,
  onReplayAudio,
  onToggleContinuousListening,
  continuousListeningEnabled,
}) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');

  const latestWasuMsg = [...chatMessages].reverse().find((m) => m.sender === 'wasu');
  const latestUserMsg = [...chatMessages].reverse().find((m) => m.sender === 'user');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedCommand.trim()) return;
    onVoiceCommand(typedCommand.trim());
    setTypedCommand('');
  };

  return (
    <div className="relative rounded-3xl bg-black/80 border-2 border-cyan-500/50 p-5 shadow-[0_0_30px_rgba(0,240,255,0.2)] backdrop-blur-2xl space-y-4 overflow-hidden">
      {/* Cyber Reticles on Cockpit Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Cyber Cockpit Top Telemetry Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-950/80">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-cyan-400 animate-ping shadow-[0_0_12px_#00f0ff]' : 'bg-rose-500'}`} />
          <div>
            <h3 className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              CYBER VOICE COMMAND COCKPIT // ZERO-TYPING
            </h3>
            <span className="text-[10px] font-mono text-cyan-400/70">
              {continuousListeningEnabled
                ? '• ALWAYS-ON MIC: JUST SPEAK NATURALLY'
                : '• MIC PAUSED: CLICK TO WAKE'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleContinuousListening}
          className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
            continuousListeningEnabled
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
              : 'bg-black border-slate-700 text-slate-400'
          }`}
        >
          {continuousListeningEnabled ? 'VOICE ON' : 'PAUSED'}
        </button>
      </div>

      {/* Real-Time Audio Frequency Equalizer Waveform */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-black via-cyan-950/20 to-black border border-cyan-500/30 flex flex-col items-center justify-center">
        {/* Animated Soundwave Frequency Bars */}
        <div className="flex items-center justify-center gap-1.5 h-12 w-full max-w-sm">
          {[40, 75, 55, 95, 60, 85, 100, 70, 90, 65, 80, 50, 95, 70, 60].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-150 ${
                isSpeaking
                  ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  : isListening
                  ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                  : 'bg-cyan-950'
              }`}
              style={{
                height: isSpeaking || isListening ? `${Math.max(15, (h * Math.sin(i + Date.now() / 200) + 100) % 48)}px` : '6px',
                animation: isSpeaking || isListening ? `pulse 0.4s ease-in-out infinite alternate ${i * 0.05}s` : 'none',
              }}
            />
          ))}
        </div>

        {/* Live Spoken Words Real-time Display */}
        <div className="mt-3 text-center">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
            {isListening ? 'LISTENING TO YOUR VOICE...' : 'STANDBY FOR VOICE'}
          </span>
          <div className="text-sm font-mono text-cyan-100 font-semibold min-h-[24px] mt-0.5">
            {interimTranscript ? (
              <span className="text-cyan-300 animate-pulse">"{interimTranscript}"</span>
            ) : latestUserMsg ? (
              <span className="text-rose-200">Aapne farmaya: "{latestUserMsg.text}"</span>
            ) : (
              <span className="text-slate-500 italic">"Wasu, battery optimize kardo" ya "Hey Wasu" bolein...</span>
            )}
          </div>
        </div>
      </div>

      {/* Holographic Wasu Voice Output Hero Box */}
      {latestWasuMsg && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-black to-slate-950 border border-rose-500/50 shadow-lg shadow-rose-950/50 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-rose-900/40">
            <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              WASU LOVE VOICE OUTPUT:
            </span>

            <button
              onClick={() => onReplayAudio(latestWasuMsg)}
              className="px-2.5 py-1 text-xs font-mono bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 rounded-lg flex items-center gap-1 transition-all active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Sunayein
            </button>
          </div>

          <p className="text-sm text-rose-100 font-medium leading-relaxed font-sans">
            "{latestWasuMsg.text}"
          </p>

          {latestWasuMsg.proactiveTip && (
            <div className="pt-1 text-[11px] font-mono text-pink-300 flex items-center gap-1">
              <span>💌</span>
              <span>{latestWasuMsg.proactiveTip}</span>
            </div>
          )}
        </div>
      )}

      {/* Unrestricted Open Voice Intelligence HUD (No specific/hardcoded commands) */}
      <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            UNRESTRICTED VOICE CONTROL // KHUD APNE LAFZON MEIN BOLEIN
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            ZERO SPECIFIC COMMANDS
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/30 via-black to-rose-950/30 border border-cyan-900/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            <Mic className={`w-4 h-4 ${isListening ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-200">
              Aapka jo dil kare, jese chahein bolein:
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Wasu ke liye koi makhsoos commands nahi hain. Phone calls, messages, alarms, battery, exams, dil ki batein, jokes ya pyar — aap natural awaz mein baat karein, Wasu har lafz samajh kar foran jawab degi!
            </p>
          </div>
        </div>

        {/* Live Audio & Neural Processing Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
          <div className="p-2 rounded-lg bg-black/60 border border-cyan-950 flex flex-col items-center text-center">
            <span className="text-slate-500">VOICE SPEECH</span>
            <span className="text-cyan-300 font-bold mt-0.5">100% Native Urdu</span>
          </div>
          <div className="p-2 rounded-lg bg-black/60 border border-cyan-950 flex flex-col items-center text-center">
            <span className="text-slate-500">VOICE ENGINE</span>
            <span className="text-cyan-300 font-bold mt-0.5">Always-On Mic</span>
          </div>
        </div>
      </div>

      {/* Collapsible Emergency Text Input Toggle (Only for silent environments) */}
      <div className="pt-2 border-t border-cyan-950/80">
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full py-1.5 text-[11px] font-mono text-cyan-400/60 hover:text-cyan-300 flex items-center justify-center gap-1 transition-colors"
        >
          <Terminal className="w-3 h-3" />
          <span>{showManualInput ? 'Hide Emergency Keyboard' : 'Emergency Silent Keyboard (Optional)'}</span>
          {showManualInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="flex gap-2 mt-2">
            <input
              type="text"
              value={typedCommand}
              onChange={(e) => setTypedCommand(e.target.value)}
              placeholder="Silent mode: type command here..."
              className="flex-1 px-3 py-2 text-xs font-mono bg-black/80 border border-cyan-900/80 rounded-xl text-cyan-100 placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!typedCommand.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-black font-mono font-bold text-xs rounded-xl transition-all"
            >
              EXECUTE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
